<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-surface-900 dark:text-white">Employer Dashboard</h1>
      <p class="text-surface-500 mt-1">Welcome back, {{ employerAuth.employer?.companyName || 'Company' }}</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="s in stats" :key="s.label" class="card p-5 border-l-4" :class="s.border">
        <div class="text-2xl font-black text-surface-900 dark:text-white">{{ s.value }}</div>
        <div class="text-sm text-surface-500 mt-1">{{ s.label }}</div>
        <div class="text-xs mt-2" :class="s.trend > 0 ? 'text-emerald-500' : 'text-surface-400'">{{ s.trend > 0 ? `↑ ${s.trend}` : '—' }} this month</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Jobs -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-surface-800 dark:text-surface-200">Active Job Listings</h2>
          <RouterLink to="/employers/post-job">
            <Button accent="green" size="sm" id="dash-post-job-btn">+ Post Job</Button>
          </RouterLink>
        </div>

        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="card p-4 space-y-2"><Skeleton height="h-5" width="w-2/3"/><Skeleton height="h-4" width="w-1/2"/></div>
        </div>

        <div v-else-if="jobs.length" class="space-y-3">
          <div v-for="job in jobs" :key="job.id" class="card p-4 flex items-center gap-4">
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-surface-900 dark:text-white truncate">{{ job.title }}</p>
              <p class="text-xs text-surface-500">{{ job.location }} · {{ job.type }} · Posted {{ timeAgo(job.createdAt) }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{{ job.applicationCount || 0 }} apps</span>
              <RouterLink :to="`/employers/jobs/${job.id}/applicants`" class="text-xs text-emp-600 dark:text-emp-400 font-medium hover:underline">View</RouterLink>
              <RouterLink :to="`/employers/post-job?edit=${job.id}`" class="text-xs text-surface-500 hover:text-surface-700 dark:hover:text-surface-200">Edit</RouterLink>
            </div>
          </div>
        </div>

        <div v-else class="card p-10 text-center">
          <div class="text-5xl mb-3">📢</div>
          <h3 class="font-bold text-surface-700 dark:text-surface-300 mb-2">No jobs posted yet</h3>
          <p class="text-sm text-surface-500 mb-4">Post your first job and start receiving applications</p>
          <RouterLink to="/employers/post-job"><Button accent="green" size="sm">Post Your First Job</Button></RouterLink>
        </div>
      </div>

      <!-- Sidebar: Recent Applicants -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-surface-800 dark:text-surface-200">Recent Applicants</h2>
        <div v-if="recentApps.length" class="space-y-2">
          <div v-for="app in recentApps.slice(0,5)" :key="app.id" class="card p-3 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emp-400 to-emp-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {{ (app.applicantName || 'A')[0].toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-surface-900 dark:text-white truncate">{{ app.applicantName }}</p>
              <p class="text-xs text-surface-500 truncate">{{ app.job?.title }}</p>
            </div>
            <span :class="['badge text-xs flex-shrink-0', statusColor(app.status)]">{{ app.status }}</span>
          </div>
        </div>
        <div v-else class="card p-5 text-center text-sm text-surface-500">No applications yet</div>

        <!-- Quick Actions -->
        <div class="card p-4 space-y-2">
          <h3 class="font-semibold text-surface-800 dark:text-surface-200 text-sm mb-3">Quick Actions</h3>
          <RouterLink to="/employers/post-job" class="flex items-center gap-2 p-2.5 rounded-xl hover:bg-emp-50 dark:hover:bg-emp-900/20 transition-colors text-sm text-surface-700 dark:text-surface-300 group">
            <span class="w-7 h-7 rounded-lg bg-emp-100 dark:bg-emp-900/30 flex items-center justify-center text-emp-600 dark:text-emp-400 group-hover:scale-110 transition-transform">+</span>
            Post New Job
          </RouterLink>
          <RouterLink to="/employers/jobs" class="flex items-center gap-2 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm text-surface-700 dark:text-surface-300">
            <span class="w-7 h-7 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-600 dark:text-surface-400">📋</span>
            Manage Jobs
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useEmployerAuthStore } from '@/stores/employerAuth'
import { employerApi } from '@/api/employer'
import Button from '@/components/shared/Button.vue'
import Skeleton from '@/components/shared/Skeleton.vue'

const employerAuth = useEmployerAuthStore()
const loading = ref(true)
const jobs = ref([])
const recentApps = ref([])

const stats = ref([
  { label: 'Active Jobs',        value: '0', border: 'border-emp-500',    trend: 2 },
  { label: 'Total Applications', value: '0', border: 'border-blue-500',   trend: 15 },
  { label: 'Shortlisted',        value: '0', border: 'border-violet-500', trend: 3 },
  { label: 'Hired',              value: '0', border: 'border-emerald-500', trend: 1 },
])

const statusColor = s => ({ Pending:'bg-amber-100 dark:bg-amber-900/30 text-amber-700', Reviewed:'bg-blue-100 dark:bg-blue-900/30 text-blue-700', Shortlisted:'bg-violet-100 dark:bg-violet-900/30 text-violet-700', Rejected:'bg-red-100 dark:bg-red-900/30 text-red-600', Hired:'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700' }[s] || '')
const timeAgo = d => { if (!d) return ''; const days = Math.floor((Date.now()-new Date(d))/86400000); return days===0?'Today':days===1?'1d ago':`${days}d ago` }

onMounted(async () => {
  try {
    const [jobsRes, appsRes, statsRes] = await Promise.all([
      employerApi.get('/employer/jobs?page=0&size=5'),
      employerApi.get('/employer/applications/recent'),
      employerApi.get('/employer/stats'),
    ])
    jobs.value      = jobsRes.data.content || jobsRes.data || []
    recentApps.value = appsRes.data.content || appsRes.data || []
    if (statsRes.data) {
      stats.value[0].value = statsRes.data.activeJobs || '0'
      stats.value[0].trend = statsRes.data.activeJobsTrend || 0
      
      stats.value[1].value = statsRes.data.totalApplications || '0'
      stats.value[1].trend = statsRes.data.totalApplicationsTrend || 0
      
      stats.value[2].value = statsRes.data.shortlisted || '0'
      stats.value[2].trend = statsRes.data.shortlistedTrend || 0
      
      stats.value[3].value = statsRes.data.hired || '0'
      stats.value[3].trend = statsRes.data.hiredTrend || 0
    }
  } catch {
    jobs.value = sampleJobs()
    recentApps.value = sampleApps()
    stats.value[0].value='3'; stats.value[1].value='24'; stats.value[2].value='7'; stats.value[3].value='2'
  } finally { loading.value = false }
})

function sampleJobs() { return [
  { id:1, title:'Senior Frontend Developer', location:'Remote', type:'Full-time', createdAt: new Date().toISOString(), applicationCount: 12 },
  { id:2, title:'Product Designer',           location:'New York, NY', type:'Full-time', createdAt: new Date(Date.now()-86400000*2).toISOString(), applicationCount: 8 },
  { id:3, title:'Data Scientist',             location:'Remote', type:'Remote', createdAt: new Date(Date.now()-86400000*5).toISOString(), applicationCount: 15 },
]}
function sampleApps() { return [
  { id:1, applicantName:'Alice Johnson', status:'Shortlisted', job:{ title:'Senior Frontend Developer' }},
  { id:2, applicantName:'Bob Smith',     status:'Pending',     job:{ title:'Product Designer' }},
  { id:3, applicantName:'Carol White',   status:'Reviewed',    job:{ title:'Data Scientist' }},
]}
</script>
