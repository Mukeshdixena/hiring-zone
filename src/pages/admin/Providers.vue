<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-white">Provider Management</h1>
      <p class="text-surface-400 mt-1">Manage employer accounts and verification</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input id="admin-prov-search" v-model="searchQ" type="text" placeholder="Search providers…" @input="fetchProviders" class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-adm-500/40"/>
      </div>
      <select id="admin-prov-filter" v-model="verifyFilter" @change="fetchProviders" class="rounded-xl border border-surface-700 bg-surface-800 text-surface-300 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-adm-500/40">
        <option value="">All</option><option value="verified">Verified</option><option value="unverified">Unverified</option>
      </select>
    </div>

    <div class="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="border-b border-surface-800 bg-surface-800/50">
            <th class="text-left py-3 px-4 text-surface-400 font-medium">Company</th>
            <th class="text-left py-3 px-4 text-surface-400 font-medium hidden sm:table-cell">Contact</th>
            <th class="text-left py-3 px-4 text-surface-400 font-medium hidden md:table-cell">Jobs</th>
            <th class="text-left py-3 px-4 text-surface-400 font-medium">Verified</th>
            <th class="text-right py-3 px-4 text-surface-400 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            <tr v-for="p in providers" :key="p.id" class="border-b border-surface-800/50 hover:bg-surface-800/40 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emp-500 to-emp-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{{ (p.companyName||'C')[0] }}</div>
                  <div><p class="text-white font-medium">{{ p.companyName }}</p><p class="text-xs text-surface-500">{{ p.industry }}</p></div>
                </div>
              </td>
              <td class="py-3 px-4 text-surface-400 hidden sm:table-cell">{{ p.email }}</td>
              <td class="py-3 px-4 text-surface-400 hidden md:table-cell">{{ p.jobCount || 0 }}</td>
              <td class="py-3 px-4">
                <span :class="['badge', p.verified ? 'bg-emerald-900/40 text-emerald-400' : 'bg-amber-900/40 text-amber-400']">{{ p.verified ? '✓ Verified' : 'Pending' }}</span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button v-if="!p.verified" @click="verify(p)" :id="`verify-${p.id}`" class="text-xs font-medium text-emerald-400 hover:bg-emerald-900/20 px-3 py-1.5 rounded-lg transition-colors">Verify</button>
                  <button @click="toggleSuspend(p)" :id="`suspend-prov-${p.id}`" :class="['text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', p.suspended ? 'text-emerald-400 hover:bg-emerald-900/20' : 'text-amber-400 hover:bg-amber-900/20']">{{ p.suspended ? 'Restore' : 'Suspend' }}</button>
                  <button @click="deleteProv(p)" :id="`delete-prov-${p.id}`" class="text-xs font-medium text-red-400 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const providers = ref([]); const searchQ = ref(''); const verifyFilter = ref('')

async function fetchProviders() {
  try {
    const res = await adminApi.get('/admin/providers', { params: { search: searchQ.value, verified: verifyFilter.value }})
    providers.value = res.data.content || res.data || []
  } catch (err) {
    console.error('Failed to fetch providers', err)
    providers.value = []
  }
}

async function verify(p) {
  try { await adminApi.patch(`/admin/providers/${p.id}/verify`); p.verified = true; toast.success(`${p.companyName} verified`) }
  catch { toast.error('Failed') }
}
async function toggleSuspend(p) {
  try { await adminApi.patch(`/admin/providers/${p.id}/suspend`, { suspended: !p.suspended }); p.suspended = !p.suspended; toast.success('Updated') }
  catch { toast.error('Failed') }
}
async function deleteProv(p) {
  if (!confirm(`Delete provider "${p.companyName}"?`)) return
  try { await adminApi.delete(`/admin/providers/${p.id}`); providers.value = providers.value.filter(x => x.id !== p.id); toast.success('Deleted') }
  catch { toast.error('Failed') }
}
onMounted(fetchProviders)
</script>
