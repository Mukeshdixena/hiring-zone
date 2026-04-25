<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Welcome header -->
    <div class="mb-8">
      <h1 class="text-3xl font-black text-surface-900 dark:text-white">
        Welcome back, <span class="gradient-text-blue">{{ seekerAuth.user?.name?.split(' ')[0] || 'there' }}</span> 👋
      </h1>
      <p class="text-surface-500 mt-1">Here's what's happening with your job search</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="s in stats" :key="s.label" class="card p-5">
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3', s.bg]">{{ s.icon }}</div>
        <div class="text-2xl font-black text-surface-900 dark:text-white">{{ s.value }}</div>
        <div class="text-xs text-surface-500 mt-0.5">{{ s.label }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Applications -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-surface-800 dark:text-surface-200">Recent Applications</h2>
          <RouterLink to="/applications" class="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">View all →</RouterLink>
        </div>

        <div v-if="loadingApps" class="space-y-3">
          <div v-for="i in 3" :key="i" class="card p-4 flex gap-3">
            <Skeleton height="h-10" width="w-10" class="rounded-xl flex-shrink-0"/>
            <div class="flex-1 space-y-2">
              <Skeleton height="h-4" width="w-2/3"/>
              <Skeleton height="h-3" width="w-1/2"/>
            </div>
          </div>
        </div>

        <div v-else-if="recentApps.length" class="space-y-3">
          <div v-for="app in recentApps" :key="app.id" class="card card-hover p-4 flex items-center gap-4" @click="$router.push(`/jobs/${app.job?.id}`)">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300 flex-shrink-0">
              {{ (app.job?.company?.name || 'C')[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-surface-900 dark:text-white text-sm truncate">{{ app.job?.title }}</p>
              <p class="text-xs text-surface-500 truncate">{{ app.job?.company?.name }} · {{ app.job?.location }}</p>
            </div>
            <span :class="['badge flex-shrink-0', statusColor(app.status)]">{{ app.status }}</span>
          </div>
        </div>

        <div v-else class="card p-10 text-center">
          <div class="text-5xl mb-3">📋</div>
          <h3 class="font-bold text-surface-700 dark:text-surface-300 mb-1">No applications yet</h3>
          <p class="text-sm text-surface-500 mb-4">Start applying to jobs and track your progress here</p>
          <RouterLink to="/jobs"><Button accent="blue" size="sm">Browse Jobs</Button></RouterLink>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Saved Jobs -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-bold text-surface-800 dark:text-surface-200">Saved Jobs</h2>
          </div>
          <div v-if="savedJobs.length" class="space-y-2">
            <div v-for="job in savedJobs.slice(0,4)" :key="job.id" class="card p-3 flex items-center gap-3 card-hover cursor-pointer" @click="$router.push(`/jobs/${job.id}`)">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-xs flex-shrink-0">{{ (job.company?.name||'C')[0] }}</div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-surface-900 dark:text-white truncate">{{ job.title }}</p>
                <p class="text-xs text-surface-500 truncate">{{ job.company?.name }}</p>
              </div>
            </div>
          </div>
          <div v-else class="card p-5 text-center">
            <p class="text-sm text-surface-500">No saved jobs yet</p>
            <RouterLink to="/jobs" class="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline">Browse Jobs</RouterLink>
          </div>
        </div>

        <!-- Profile Completion -->
        <div class="card p-5">
          <h3 class="font-bold text-surface-800 dark:text-surface-200 mb-3">Profile Strength</h3>
          <div class="flex items-center gap-3 mb-2">
            <div class="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
              <div class="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full transition-all duration-500" :style="`width: ${profileCompletion}%`"/>
            </div>
            <span class="text-sm font-bold text-brand-600 dark:text-brand-400">{{ profileCompletion }}%</span>
          </div>
          <p class="text-xs text-surface-500">Complete your profile to get noticed by employers</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSeekerAuthStore } from '@/stores/seekerAuth'
import { seekerApi } from '@/api/seeker'
import Button from '@/components/shared/Button.vue'
import Skeleton from '@/components/shared/Skeleton.vue'

const seekerAuth = useSeekerAuthStore()
const loadingApps = ref(true)
const recentApps = ref([])
const savedJobs  = ref([])
const profileCompletion = ref(60)

const stats = ref([
  { icon: '📤', label: 'Applications Sent',  value: '0', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: '👀', label: 'Profile Views',       value: '0', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  { icon: '💾', label: 'Saved Jobs',          value: '0', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { icon: '✅', label: 'Interviews Received', value: '0', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
])

const statusColor = s => ({
  Pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  Reviewed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Shortlisted: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  Rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  Hired: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
}[s] || 'bg-surface-100 dark:bg-surface-700 text-surface-600')

onMounted(async () => {
  try {
    const [appsRes, savedRes, statsRes] = await Promise.all([
      seekerApi.get('/applications?page=0&size=5'),
      seekerApi.get('/saved-jobs?page=0&size=4'),
      seekerApi.get('/applications/stats'),
    ])
    recentApps.value = appsRes.data.content || appsRes.data || []
    savedJobs.value  = savedRes.data.content || savedRes.data || []
    if (statsRes.data) {
      stats.value[0].value = (statsRes.data.totalApplications || 0).toString()
      stats.value[3].value = (statsRes.data.interviews || 0).toString()
    }
    stats.value[2].value = (savedRes.data.totalElements || savedJobs.value.length).toString()
    // Profile views (mocked)
    stats.value[1].value = Math.floor(Math.random() * 50).toString()
  } catch (err) {
    console.error('Failed to load seeker dashboard', err)
    recentApps.value = []
    savedJobs.value = []
  } finally { loadingApps.value = false }
})
</script>
