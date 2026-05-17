<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-white">User Management</h1>
        <p class="text-surface-400 mt-1">{{ total.toLocaleString() }} registered seekers</p>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
        <input id="admin-user-search" v-model="searchQ" type="text" placeholder="Search by name or email…"
               @input="debouncedFetch"
               class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-adm-500/40"/>
      </div>
      <select id="admin-user-status-filter" v-model="statusFilter" @change="fetchUsers"
              class="rounded-xl border border-surface-700 bg-surface-800 text-surface-300 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-adm-500/40">
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
              <th class="text-left py-3 px-4 text-surface-400 font-medium hidden sm:table-cell">Role</th>
              <th class="text-left py-3 px-4 text-surface-400 font-medium hidden sm:table-cell">Joined</th>
              <th class="text-left py-3 px-4 text-surface-400 font-medium hidden md:table-cell">Applications</th>
              <th class="text-left py-3 px-4 text-surface-400 font-medium">Status</th>
              <th class="text-right py-3 px-4 text-surface-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody v-if="!loading">
            <tr v-for="user in users" :key="user.id"
                class="border-b border-surface-800/50 hover:bg-surface-800/40 transition-colors cursor-pointer"
                @click="openDetail(user.id)">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {{ (user.name || 'U')[0].toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-white font-medium">{{ user.name }}</p>
                    <p class="text-surface-500 text-xs">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 hidden sm:table-cell">
                <span :class="['badge text-xs', roleBadge(user.role).cls]">{{ roleBadge(user.role).label }}</span>
              </td>
              <td class="py-3 px-4 text-surface-400 hidden sm:table-cell">{{ user.joinedAt }}</td>
              <td class="py-3 px-4 hidden md:table-cell">
                <span class="text-white font-medium">{{ user.applicationCount }}</span>
                <span class="text-surface-500 ml-1 text-xs">apps</span>
              </td>
              <td class="py-3 px-4">
                <span :class="['badge', user.suspended ? 'bg-red-900/40 text-red-400' : 'bg-emerald-900/40 text-emerald-400']">
                  {{ user.suspended ? 'Suspended' : 'Active' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1">
                  <button @click="openDetail(user.id)"
                          class="text-xs font-medium text-adm-400 hover:bg-adm-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                    View
                  </button>
                  <button @click="toggleSuspend(user)" :id="`suspend-${user.id}`"
                          :class="['text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors',
                                   user.suspended ? 'text-emerald-400 hover:bg-emerald-900/20' : 'text-amber-400 hover:bg-amber-900/20']">
                    {{ user.suspended ? 'Restore' : 'Suspend' }}
                  </button>
                  <button @click="deleteUser(user)" :id="`delete-user-${user.id}`"
                          class="text-xs font-medium text-red-400 hover:bg-red-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="i in 8" :key="i">
              <td colspan="6" class="py-3 px-4">
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-full skeleton flex-shrink-0"/>
                  <div class="flex-1 space-y-1.5">
                    <div class="skeleton h-3 w-1/3 rounded"/>
                    <div class="skeleton h-2.5 w-1/4 rounded"/>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2 flex-wrap">
      <button v-for="p in totalPages" :key="p" @click="goToPage(p - 1)"
              :class="['w-9 h-9 rounded-xl text-sm font-medium transition-all',
                       currentPage === p - 1 ? 'bg-adm-600 text-white' : 'bg-surface-800 text-surface-300 border border-surface-700 hover:border-adm-500']">
        {{ p }}
      </button>
    </div>

    <!-- ── Detail Drawer ─────────────────────────────────────────────────── -->
    <Transition name="drawer-fade">
      <div v-if="drawerOpen" class="fixed inset-0 z-50 flex justify-end" @click.self="closeDrawer">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDrawer"/>

        <!-- Panel -->
        <div class="relative z-10 w-full max-w-lg bg-surface-950 border-l border-surface-800 h-full overflow-y-auto flex flex-col">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-surface-800 sticky top-0 bg-surface-950 z-10">
            <h2 class="font-bold text-white">User Details</h2>
            <button @click="closeDrawer" class="text-surface-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-surface-800">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="detailLoading" class="flex-1 flex items-center justify-center">
            <div class="space-y-4 w-full px-6 py-8">
              <div class="flex gap-4 items-center">
                <div class="w-16 h-16 rounded-full skeleton flex-shrink-0"/>
                <div class="space-y-2 flex-1"><div class="skeleton h-5 w-1/2 rounded"/><div class="skeleton h-3.5 w-2/3 rounded"/></div>
              </div>
              <div v-for="i in 4" :key="i" class="skeleton h-12 rounded-xl"/>
            </div>
          </div>

          <!-- Detail content -->
          <div v-else-if="detail" class="flex-1 p-6 space-y-6">

            <!-- Profile card -->
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                {{ (detail.name || 'U')[0].toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-white">{{ detail.name }}</h3>
                <p class="text-surface-400 text-sm">{{ detail.email }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span :class="['badge text-xs', roleBadge(detail.role).cls]">{{ roleBadge(detail.role).label }}</span>
                  <span :class="['badge text-xs', detail.suspended ? 'bg-red-900/40 text-red-400' : 'bg-emerald-900/40 text-emerald-400']">
                    {{ detail.suspended ? 'Suspended' : 'Active' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-surface-900 border border-surface-800 rounded-xl p-4">
                <p class="text-xs text-surface-500 mb-1">Joined</p>
                <p class="text-white font-bold">{{ detail.joinedAt || '—' }}</p>
              </div>
              <div class="bg-surface-900 border border-surface-800 rounded-xl p-4">
                <p class="text-xs text-surface-500 mb-1">Total Applications</p>
                <p class="text-white font-bold text-lg">{{ detail.applicationCount }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button @click="toggleSuspendDetail" :disabled="actioning"
                      :class="['flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60',
                               detail.suspended ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white']">
                {{ detail.suspended ? 'Restore Account' : 'Suspend Account' }}
              </button>
              <button @click="deleteDetail" :disabled="actioning"
                      class="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-900/30 hover:bg-red-900/50 text-red-400 transition-all border border-red-900/50 disabled:opacity-60">
                Delete
              </button>
            </div>

            <!-- Application History -->
            <div>
              <h4 class="font-bold text-white mb-3 flex items-center gap-2">
                Application History
                <span class="badge bg-surface-800 text-surface-400 text-xs">{{ detail.applications?.length || 0 }}</span>
              </h4>

              <div v-if="!detail.applications?.length" class="text-sm text-surface-500 text-center py-6 bg-surface-900 rounded-xl border border-surface-800">
                No applications yet
              </div>

              <div v-else class="space-y-2 max-h-80 overflow-y-auto">
                <div v-for="app in detail.applications" :key="app.id"
                     class="flex items-start gap-3 bg-surface-900 border border-surface-800 rounded-xl p-3">
                  <div class="w-8 h-8 rounded-lg bg-violet-900/40 flex items-center justify-center text-sm flex-shrink-0">💼</div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-medium truncate">{{ app.jobTitle }}</p>
                    <p class="text-surface-500 text-xs">{{ app.company }}{{ app.location ? ' · ' + app.location : '' }}</p>
                    <p class="text-surface-500 text-xs mt-0.5">{{ app.jobType }} · Applied {{ app.appliedAt }}</p>
                  </div>
                  <span :class="['badge text-xs flex-shrink-0', statusBadge(app.status)]">{{ app.status }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'
import { useToastStore } from '@/stores/toast'

const toast       = useToastStore()
const loading     = ref(true)
const users       = ref([])
const total       = ref(0)
const totalPages  = ref(1)
const currentPage = ref(0)
const searchQ     = ref('')
const statusFilter = ref('')

// Drawer state
const drawerOpen   = ref(false)
const detailLoading = ref(false)
const detail       = ref(null)
const actioning    = ref(false)
let searchTimer    = null

async function fetchUsers() {
  loading.value = true
  try {
    const res = await adminApi.get('/admin/users', {
      params: { page: currentPage.value, size: 15, search: searchQ.value, status: statusFilter.value }
    })
    users.value      = res.data.content || []
    total.value      = res.data.totalElements || users.value.length
    totalPages.value = res.data.totalPages || 1
  } catch (err) {
    console.error('Failed to fetch users', err)
    users.value = []
  } finally {
    loading.value = false
  }
}

function debouncedFetch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { currentPage.value = 0; fetchUsers() }, 350)
}

async function toggleSuspend(user) {
  try {
    await adminApi.patch(`/admin/users/${user.id}/suspend`, { suspended: !user.suspended })
    user.suspended = !user.suspended
    toast.success(user.suspended ? 'User suspended' : 'User restored')
  } catch { toast.error('Action failed') }
}

async function deleteUser(user) {
  if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return
  try {
    await adminApi.delete(`/admin/users/${user.id}`)
    users.value = users.value.filter(u => u.id !== user.id)
    total.value--
    toast.success('User deleted')
  } catch { toast.error('Delete failed') }
}

async function openDetail(id) {
  drawerOpen.value   = true
  detailLoading.value = true
  detail.value       = null
  try {
    const res = await adminApi.get(`/admin/users/${id}`)
    detail.value = res.data
  } catch { toast.error('Failed to load user details') }
  finally { detailLoading.value = false }
}

function closeDrawer() {
  drawerOpen.value = false
  detail.value     = null
}

async function toggleSuspendDetail() {
  if (!detail.value) return
  actioning.value = true
  try {
    await adminApi.patch(`/admin/users/${detail.value.id}/suspend`, { suspended: !detail.value.suspended })
    detail.value.suspended = !detail.value.suspended
    const u = users.value.find(u => u.id === detail.value.id)
    if (u) u.suspended = detail.value.suspended
    toast.success(detail.value.suspended ? 'User suspended' : 'User restored')
  } catch { toast.error('Action failed') }
  finally { actioning.value = false }
}

async function deleteDetail() {
  if (!detail.value || !confirm(`Delete user "${detail.value.name}"? This cannot be undone.`)) return
  actioning.value = true
  try {
    await adminApi.delete(`/admin/users/${detail.value.id}`)
    users.value = users.value.filter(u => u.id !== detail.value.id)
    total.value--
    closeDrawer()
    toast.success('User deleted')
  } catch { toast.error('Delete failed') }
  finally { actioning.value = false }
}

function goToPage(p) { currentPage.value = p; fetchUsers() }

function roleBadge(role) {
  if (role === 'ROLE_EMPLOYER') return { label: 'Employer', cls: 'bg-emp-900/40 text-emp-400' }
  if (role === 'ROLE_ADMIN')    return { label: 'Admin',    cls: 'bg-adm-900/40 text-adm-400' }
  return { label: 'Seeker', cls: 'bg-blue-900/40 text-blue-400' }
}

function statusBadge(status) {
  const map = {
    Hired:       'bg-emerald-900/40 text-emerald-400',
    Shortlisted: 'bg-blue-900/40 text-blue-400',
    Reviewed:    'bg-violet-900/40 text-violet-400',
    Rejected:    'bg-red-900/40 text-red-400',
    Pending:     'bg-amber-900/40 text-amber-400',
  }
  return map[status] || 'bg-surface-700 text-surface-300'
}

onMounted(fetchUsers)
</script>

<style scoped>
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.25s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-fade-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(.16,1,.3,1); }
.drawer-fade-enter-from > div:last-child { transform: translateX(100%); }
</style>
