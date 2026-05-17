<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-white">Provider Management</h1>
      <p class="text-surface-400 mt-1">{{ total.toLocaleString() }} employer accounts</p>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input id="admin-prov-search" v-model="searchQ" type="text" placeholder="Search by company or email…"
               @input="debouncedFetch"
               class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-adm-500/40"/>
      </div>
      <select id="admin-prov-filter" v-model="verifyFilter" @change="fetchProviders"
              class="rounded-xl border border-surface-700 bg-surface-800 text-surface-300 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-adm-500/40">
        <option value="">All</option>
        <option value="verified">Verified</option>
        <option value="unverified">Unverified</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-surface-800 bg-surface-800/50">
              <th class="text-left py-3 px-4 text-surface-400 font-medium">Company</th>
              <th class="text-left py-3 px-4 text-surface-400 font-medium hidden sm:table-cell">Contact</th>
              <th class="text-left py-3 px-4 text-surface-400 font-medium hidden md:table-cell">Jobs</th>
              <th class="text-left py-3 px-4 text-surface-400 font-medium">Verified</th>
              <th class="text-right py-3 px-4 text-surface-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody v-if="!loading">
            <tr v-for="p in providers" :key="p.id"
                class="border-b border-surface-800/50 hover:bg-surface-800/40 transition-colors cursor-pointer"
                @click="openDetail(p.id)">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emp-500 to-emp-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {{ (p.companyName || 'C')[0].toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-white font-medium">{{ p.companyName }}</p>
                    <p class="text-xs text-surface-500">{{ p.industry || '—' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-surface-400 text-xs hidden sm:table-cell">{{ p.email }}</td>
              <td class="py-3 px-4 hidden md:table-cell">
                <span class="text-white font-medium">{{ p.jobCount }}</span>
                <span class="text-surface-500 ml-1 text-xs">jobs</span>
              </td>
              <td class="py-3 px-4">
                <span :class="['badge', p.verified ? 'bg-emerald-900/40 text-emerald-400' : 'bg-amber-900/40 text-amber-400']">
                  {{ p.verified ? '✓ Verified' : 'Pending' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1">
                  <button @click="openDetail(p.id)"
                          class="text-xs font-medium text-adm-400 hover:bg-adm-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                    View
                  </button>
                  <button v-if="!p.verified" @click="verify(p)" :id="`verify-${p.id}`"
                          class="text-xs font-medium text-emerald-400 hover:bg-emerald-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                    Verify
                  </button>
                  <button @click="toggleSuspend(p)" :id="`suspend-prov-${p.id}`"
                          :class="['text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors',
                                   p.suspended ? 'text-emerald-400 hover:bg-emerald-900/20' : 'text-amber-400 hover:bg-amber-900/20']">
                    {{ p.suspended ? 'Restore' : 'Suspend' }}
                  </button>
                  <button @click="deleteProv(p)" :id="`delete-prov-${p.id}`"
                          class="text-xs font-medium text-red-400 hover:bg-red-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="i in 8" :key="i">
              <td colspan="5" class="py-3 px-4">
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-lg skeleton flex-shrink-0"/>
                  <div class="flex-1 space-y-1.5"><div class="skeleton h-3 w-1/3 rounded"/><div class="skeleton h-2.5 w-1/4 rounded"/></div>
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

    <!-- ── Provider Detail Drawer ─────────────────────────────────────────── -->
    <Transition name="drawer-fade">
      <div v-if="drawerOpen" class="fixed inset-0 z-50 flex justify-end">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDrawer"/>

        <div class="relative z-10 w-full max-w-lg bg-surface-950 border-l border-surface-800 h-full overflow-y-auto flex flex-col">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-surface-800 sticky top-0 bg-surface-950 z-10">
            <h2 class="font-bold text-white">Provider Details</h2>
            <button @click="closeDrawer" class="text-surface-400 hover:text-white p-1 rounded-lg hover:bg-surface-800 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Loading -->
          <div v-if="detailLoading" class="flex-1 p-6 space-y-4">
            <div class="flex gap-4 items-center">
              <div class="w-16 h-16 rounded-2xl skeleton flex-shrink-0"/>
              <div class="space-y-2 flex-1"><div class="skeleton h-5 w-1/2 rounded"/><div class="skeleton h-3.5 w-2/3 rounded"/></div>
            </div>
            <div v-for="i in 5" :key="i" class="skeleton h-12 rounded-xl"/>
          </div>

          <!-- Content -->
          <div v-else-if="detail" class="flex-1 p-6 space-y-6">

            <!-- Company header -->
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emp-500 to-emp-700 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                {{ (detail.companyName || 'C')[0].toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-white">{{ detail.companyName }}</h3>
                <p class="text-surface-400 text-sm">{{ detail.industry || 'Industry not set' }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span :class="['badge text-xs', detail.verified ? 'bg-emerald-900/40 text-emerald-400' : 'bg-amber-900/40 text-amber-400']">
                    {{ detail.verified ? '✓ Verified' : 'Unverified' }}
                  </span>
                  <span :class="['badge text-xs', detail.suspended ? 'bg-red-900/40 text-red-400' : 'bg-emerald-900/40 text-emerald-400']">
                    {{ detail.suspended ? 'Suspended' : 'Active' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contact info -->
            <div class="bg-surface-900 border border-surface-800 rounded-xl p-4 space-y-2.5">
              <div v-if="detail.email" class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-5 text-center">📧</span>
                <span class="text-surface-300">{{ detail.email }}</span>
              </div>
              <div v-if="detail.website" class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-5 text-center">🌐</span>
                <a :href="detail.website" target="_blank" class="text-blue-400 hover:underline truncate">{{ detail.website }}</a>
              </div>
              <div v-if="detail.location" class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-5 text-center">📍</span>
                <span class="text-surface-300">{{ detail.location }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-surface-500 w-5 text-center">📅</span>
                <span class="text-surface-300">Joined {{ detail.joinedAt || '—' }}</span>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-surface-900 border border-surface-800 rounded-xl p-4">
                <p class="text-xs text-surface-500 mb-1">Jobs Posted</p>
                <p class="text-white font-bold text-2xl">{{ detail.jobCount }}</p>
              </div>
              <div class="bg-surface-900 border border-surface-800 rounded-xl p-4">
                <p class="text-xs text-surface-500 mb-1">Total Applications</p>
                <p class="text-white font-bold text-2xl">{{ detail.totalApplications }}</p>
              </div>
            </div>

            <!-- About -->
            <div v-if="detail.description" class="bg-surface-900 border border-surface-800 rounded-xl p-4">
              <p class="text-xs text-surface-500 mb-2 font-medium uppercase tracking-wide">About</p>
              <p class="text-surface-300 text-sm leading-relaxed">{{ detail.description }}</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button v-if="!detail.verified" @click="verifyDetail" :disabled="actioning"
                      class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-60">
                Verify Provider
              </button>
              <button @click="toggleSuspendDetail" :disabled="actioning"
                      :class="['flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60',
                               detail.suspended ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white']">
                {{ detail.suspended ? 'Restore Account' : 'Suspend Account' }}
              </button>
              <button @click="deleteDetail" :disabled="actioning"
                      class="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 transition-all disabled:opacity-60">
                Delete
              </button>
            </div>

            <!-- Jobs list -->
            <div>
              <h4 class="font-bold text-white mb-3 flex items-center gap-2">
                Posted Jobs
                <span class="badge bg-surface-800 text-surface-400 text-xs">{{ detail.jobs?.length || 0 }}</span>
              </h4>

              <div v-if="!detail.jobs?.length" class="text-sm text-surface-500 text-center py-6 bg-surface-900 rounded-xl border border-surface-800">
                No jobs posted yet
              </div>

              <div v-else class="space-y-2 max-h-80 overflow-y-auto">
                <div v-for="job in detail.jobs" :key="job.id"
                     class="flex items-start gap-3 bg-surface-900 border border-surface-800 rounded-xl p-3">
                  <div class="w-8 h-8 rounded-lg bg-emp-900/40 flex items-center justify-center text-sm flex-shrink-0">💼</div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-medium truncate">{{ job.title }}</p>
                    <p class="text-surface-500 text-xs">
                      {{ job.type }}{{ job.location ? ' · ' + job.location : '' }}{{ job.remote ? ' · Remote' : '' }}
                    </p>
                    <p class="text-surface-500 text-xs mt-0.5">{{ job.applicationCount }} applicants · Posted {{ job.postedAt }}</p>
                  </div>
                  <div class="flex flex-col items-end gap-1 flex-shrink-0">
                    <span v-if="job.flagged"  class="badge text-xs bg-red-900/40 text-red-400">Flagged</span>
                    <span v-if="job.expired"  class="badge text-xs bg-surface-700 text-surface-400">Expired</span>
                    <span v-if="!job.flagged && !job.expired" class="badge text-xs bg-emerald-900/40 text-emerald-400">Active</span>
                  </div>
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

const toast        = useToastStore()
const loading      = ref(true)
const providers    = ref([])
const total        = ref(0)
const totalPages   = ref(1)
const currentPage  = ref(0)
const searchQ      = ref('')
const verifyFilter = ref('')

const drawerOpen    = ref(false)
const detailLoading = ref(false)
const detail        = ref(null)
const actioning     = ref(false)
let searchTimer     = null

async function fetchProviders() {
  loading.value = true
  try {
    const res = await adminApi.get('/admin/providers', {
      params: { page: currentPage.value, size: 15, search: searchQ.value, verified: verifyFilter.value }
    })
    providers.value = res.data.content || []
    total.value     = res.data.totalElements || providers.value.length
    totalPages.value = res.data.totalPages || 1
  } catch (err) {
    console.error('Failed to fetch providers', err)
    providers.value = []
  } finally {
    loading.value = false
  }
}

function debouncedFetch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { currentPage.value = 0; fetchProviders() }, 350)
}

async function verify(p) {
  try {
    await adminApi.patch(`/admin/providers/${p.id}/verify`)
    p.verified = true
    toast.success(`${p.companyName} verified`)
  } catch { toast.error('Failed') }
}

async function toggleSuspend(p) {
  try {
    await adminApi.patch(`/admin/providers/${p.id}/suspend`, { suspended: !p.suspended })
    p.suspended = !p.suspended
    toast.success(p.suspended ? 'Provider suspended' : 'Provider restored')
  } catch { toast.error('Failed') }
}

async function deleteProv(p) {
  if (!confirm(`Delete provider "${p.companyName}"?`)) return
  try {
    await adminApi.delete(`/admin/providers/${p.id}`)
    providers.value = providers.value.filter(x => x.id !== p.id)
    total.value--
    toast.success('Deleted')
  } catch { toast.error('Failed') }
}

async function openDetail(id) {
  drawerOpen.value    = true
  detailLoading.value = true
  detail.value        = null
  try {
    const res = await adminApi.get(`/admin/providers/${id}`)
    detail.value = res.data
  } catch { toast.error('Failed to load provider details') }
  finally { detailLoading.value = false }
}

function closeDrawer() {
  drawerOpen.value = false
  detail.value     = null
}

async function verifyDetail() {
  if (!detail.value) return
  actioning.value = true
  try {
    await adminApi.patch(`/admin/providers/${detail.value.id}/verify`)
    detail.value.verified = true
    const p = providers.value.find(p => p.id === detail.value.id)
    if (p) p.verified = true
    toast.success('Provider verified')
  } catch { toast.error('Failed') }
  finally { actioning.value = false }
}

async function toggleSuspendDetail() {
  if (!detail.value) return
  actioning.value = true
  try {
    await adminApi.patch(`/admin/providers/${detail.value.id}/suspend`, { suspended: !detail.value.suspended })
    detail.value.suspended = !detail.value.suspended
    const p = providers.value.find(p => p.id === detail.value.id)
    if (p) p.suspended = detail.value.suspended
    toast.success(detail.value.suspended ? 'Provider suspended' : 'Provider restored')
  } catch { toast.error('Failed') }
  finally { actioning.value = false }
}

async function deleteDetail() {
  if (!detail.value || !confirm(`Delete provider "${detail.value.companyName}"?`)) return
  actioning.value = true
  try {
    await adminApi.delete(`/admin/providers/${detail.value.id}`)
    providers.value = providers.value.filter(p => p.id !== detail.value.id)
    total.value--
    closeDrawer()
    toast.success('Deleted')
  } catch { toast.error('Failed') }
  finally { actioning.value = false }
}

function goToPage(p) { currentPage.value = p; fetchProviders() }

onMounted(fetchProviders)
</script>

<style scoped>
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.25s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-fade-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(.16,1,.3,1); }
.drawer-fade-enter-from > div:last-child { transform: translateX(100%); }
</style>
