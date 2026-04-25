<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-6">
      <RouterLink :to="`/employers/jobs`" class="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-emp-600 mb-4 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Back to Jobs
      </RouterLink>
      <div v-if="!loadingJob">
        <h1 class="text-2xl font-black text-surface-900 dark:text-white">Applicants — {{ job?.title }}</h1>
        <p class="text-surface-500 mt-1">{{ total }} applicants for this position</p>
      </div>
      <div v-else class="space-y-2"><Skeleton height="h-7" width="w-1/2"/><Skeleton height="h-4" width="w-1/4"/></div>
    </div>

    <!-- Status Filter Tabs -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button v-for="tab in statusTabs" :key="tab" @click="activeStatus=tab; fetchApps()"
        :id="`apps-tab-${tab}`"
        :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all', activeStatus===tab ? 'bg-emp-600 text-white shadow-lg shadow-emp-600/30' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-emp-400']">
        {{ tab }}
      </button>
    </div>

    <!-- Search -->
    <div class="relative max-w-xs mb-6">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
      <input id="apps-search" v-model="searchQ" type="text" placeholder="Search applicants…" @input="fetchApps" class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-emp-500/40 text-surface-900 dark:text-surface-100"/>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="card p-5 flex gap-4">
        <Skeleton height="h-12" width="w-12" class="rounded-full flex-shrink-0"/>
        <div class="flex-1 space-y-2"><Skeleton height="h-4" width="w-1/2"/><Skeleton height="h-3" width="w-1/3"/></div>
        <Skeleton height="h-8" width="w-32" class="flex-shrink-0"/>
      </div>
    </div>

    <!-- Applicants list -->
    <div v-else-if="applications.length" class="space-y-4">
      <div v-for="app in applications" :key="app.id" class="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-emp-400 to-emp-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {{ (app.applicantName || 'A')[0].toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-surface-900 dark:text-white">{{ app.applicantName }}</h3>
          <p class="text-sm text-surface-500">{{ app.applicantEmail }}</p>
          <p class="text-xs text-surface-400 mt-0.5">Applied {{ timeAgo(app.appliedAt) }}</p>
          <p v-if="app.coverLetter" class="text-xs text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">{{ app.coverLetter }}</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <!-- Resume download -->
          <a v-if="app.resumeUrl" :href="app.resumeUrl" target="_blank" :id="`resume-${app.id}`" class="text-xs font-medium text-emp-600 dark:text-emp-400 hover:underline px-3 py-1.5 rounded-lg hover:bg-emp-50 dark:hover:bg-emp-900/20 transition-colors">📄 Resume</a>

          <!-- Status changer -->
          <select :id="`status-${app.id}`" :value="app.status" @change="updateStatus(app, $event.target.value)" class="text-xs rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-emp-500/40 transition-all" :class="statusBg(app.status)">
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
      </div>
    </div>

    <div v-else class="card p-16 text-center">
      <div class="text-7xl mb-4">📭</div>
      <h3 class="text-xl font-bold text-surface-800 dark:text-surface-200 mb-2">No applicants {{ activeStatus !== 'All' ? `with status "${activeStatus}"` : 'yet' }}</h3>
      <p class="text-surface-500 text-sm">Share this job to attract more candidates</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { employerApi } from '@/api/employer'
import { useToastStore } from '@/stores/toast'
import Skeleton from '@/components/shared/Skeleton.vue'

const route  = useRoute()
const toast  = useToastStore()
const loading = ref(true); const loadingJob = ref(true)
const applications = ref([]); const job = ref(null); const total = ref(0)
const activeStatus = ref('All'); const searchQ = ref('')
const statusTabs = ['All', 'Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired']
const statusOptions = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired']

const timeAgo = d => { if (!d) return ''; const days = Math.floor((Date.now()-new Date(d))/86400000); return days===0?'Today':days===1?'1d ago':`${days}d ago` }
const statusBg = s => ({ Pending:'text-amber-700', Reviewed:'text-blue-700', Shortlisted:'text-violet-700', Rejected:'text-red-600', Hired:'text-emerald-700' }[s] || '')

async function fetchApps() {
  loading.value = true
  try {
    const params = { status: activeStatus.value === 'All' ? '' : activeStatus.value, search: searchQ.value }
    const res = await employerApi.get(`/employer/jobs/${route.params.id}/applications`, { params })
    applications.value = res.data.content || res.data || []
    total.value        = res.data.totalElements || applications.value.length
  } catch (err) {
    console.error('Failed to fetch applicants', err)
    applications.value = []
    total.value = 0
  }
  finally   { loading.value = false }
}

async function updateStatus(app, newStatus) {
  try {
    await employerApi.patch(`/employer/applications/${app.id}/status`, { status: newStatus })
    app.status = newStatus
    toast.success(`Status updated to ${newStatus}`)
  } catch { toast.error('Failed to update status') }
}

onMounted(async () => {
  try {
    const res = await employerApi.get(`/employer/jobs/${route.params.id}`)
    job.value = res.data
  } catch { 
    toast.error('Failed to load job details')
  }
  finally   { loadingJob.value = false }
  fetchApps()
})
</script>
