<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-white">User Management</h1>
        <p class="text-surface-400 mt-1">{{ total }} registered seekers</p>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
        <input id="admin-user-search" v-model="searchQ" type="text" placeholder="Search by name or email…" @input="fetchUsers" class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-adm-500/40"/>
      </div>
      <select id="admin-user-status-filter" v-model="statusFilter" @change="fetchUsers" class="rounded-xl border border-surface-700 bg-surface-800 text-surface-300 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-adm-500/40">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-800 bg-surface-800/50">
              <th class="text-left py-3 px-4 text-surface-400 font-medium">User</th>
              <th class="text-left py-3 px-4 text-surface-400 font-medium hidden sm:table-cell">Joined</th>
              <th class="text-left py-3 px-4 text-surface-400 font-medium hidden md:table-cell">Applications</th>
              <th class="text-left py-3 px-4 text-surface-400 font-medium">Status</th>
              <th class="text-right py-3 px-4 text-surface-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody v-if="!loading">
            <tr v-for="user in users" :key="user.id" class="border-b border-surface-800/50 hover:bg-surface-800/40 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{{ (user.name||'U')[0] }}</div>
                  <div>
                    <p class="text-white font-medium">{{ user.name }}</p>
                    <p class="text-surface-500 text-xs">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-surface-400 hidden sm:table-cell">{{ user.joinedAt }}</td>
              <td class="py-3 px-4 text-surface-400 hidden md:table-cell">{{ user.applicationCount || 0 }}</td>
              <td class="py-3 px-4">
                <span :class="['badge', user.suspended ? 'bg-red-900/40 text-red-400' : 'bg-emerald-900/40 text-emerald-400']">
                  {{ user.suspended ? 'Suspended' : 'Active' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="toggleSuspend(user)" :id="`suspend-${user.id}`" :class="['text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', user.suspended ? 'text-emerald-400 hover:bg-emerald-900/20' : 'text-amber-400 hover:bg-amber-900/20']">
                    {{ user.suspended ? 'Unsuspend' : 'Suspend' }}
                  </button>
                  <button @click="deleteUser(user)" :id="`delete-user-${user.id}`" class="text-xs font-medium text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="i in 8" :key="i"><td colspan="5" class="py-3 px-4"><div class="flex gap-3"><div class="w-8 h-8 rounded-full skeleton flex-shrink-0"/><div class="flex-1 space-y-1.5"><div class="skeleton h-3 w-1/3 rounded"/><div class="skeleton h-2.5 w-1/4 rounded"/></div></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2">
      <button v-for="p in totalPages" :key="p" @click="goToPage(p-1)" :class="['w-9 h-9 rounded-xl text-sm font-medium transition-all', currentPage===p-1 ? 'bg-adm-600 text-white' : 'bg-surface-800 text-surface-300 border border-surface-700 hover:border-adm-500']">{{ p }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'
import { useToastStore } from '@/stores/toast'

const toast   = useToastStore()
const loading = ref(true)
const users   = ref([])
const total   = ref(0); const totalPages = ref(1); const currentPage = ref(0)
const searchQ = ref(''); const statusFilter = ref('')

async function fetchUsers() {
  loading.value = true
  try {
    const res = await adminApi.get('/admin/users', { params: { page: currentPage.value, size: 15, search: searchQ.value, status: statusFilter.value }})
    users.value      = res.data.content || res.data || []
    total.value      = res.data.totalElements || users.value.length
    totalPages.value = res.data.totalPages || 1
  } catch { users.value = sampleUsers(); total.value = users.value.length }
  finally   { loading.value = false }
}

async function toggleSuspend(user) {
  try {
    await adminApi.patch(`/admin/users/${user.id}/suspend`, { suspended: !user.suspended })
    user.suspended = !user.suspended
    toast.success(user.suspended ? 'User suspended' : 'User unsuspended')
  } catch { toast.error('Action failed') }
}

async function deleteUser(user) {
  if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return
  try {
    await adminApi.delete(`/admin/users/${user.id}`)
    users.value = users.value.filter(u => u.id !== user.id)
    toast.success('User deleted')
  } catch { toast.error('Delete failed') }
}

function goToPage(p) { currentPage.value = p; fetchUsers() }
onMounted(fetchUsers)

function sampleUsers() { return [
  { id:1, name:'Alice Johnson',  email:'alice@example.com', joinedAt:'2024-01-15', applicationCount:12, suspended:false },
  { id:2, name:'Bob Smith',      email:'bob@example.com',   joinedAt:'2024-02-03', applicationCount:5,  suspended:false },
  { id:3, name:'Carol White',    email:'carol@example.com', joinedAt:'2024-01-28', applicationCount:0,  suspended:true  },
  { id:4, name:'Dan Brown',      email:'dan@example.com',   joinedAt:'2024-03-10', applicationCount:8,  suspended:false },
  { id:5, name:'Eva Green',      email:'eva@example.com',   joinedAt:'2024-03-15', applicationCount:3,  suspended:false },
]}
</script>
