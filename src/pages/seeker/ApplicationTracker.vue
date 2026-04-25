<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-surface-900 dark:text-white mb-1">My Applications</h1>
      <p class="text-surface-500">Track the status of every job you've applied to</p>
    </div>

    <!-- Status filter tabs -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button v-for="tab in statusTabs" :key="tab.value" @click="activeStatus=tab.value; fetchApps()"
        :id="`tab-${tab.value}`"
        :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all', activeStatus===tab.value ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-brand-400']">
        {{ tab.label }}
        <span v-if="tab.count" class="ml-1.5 text-xs bg-white/20 rounded-full px-1.5 py-0.5">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="card p-5 flex gap-4">
        <Skeleton height="h-12" width="w-12" class="rounded-xl flex-shrink-0"/>
        <div class="flex-1 space-y-2"><Skeleton height="h-5" width="w-2/3"/><Skeleton height="h-4" width="w-1/2"/><Skeleton height="h-3" width="w-1/4"/></div>
        <Skeleton height="h-6" width="w-24" class="flex-shrink-0 rounded-full"/>
      </div>
    </div>

    <!-- Application list -->
    <div v-else-if="applications.length" class="space-y-4">
      <div v-for="app in applications" :key="app.id" class="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-lg flex-shrink-0">
          {{ (app.job?.company?.name || 'C')[0] }}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-surface-900 dark:text-white">{{ app.job?.title }}</h3>
          <p class="text-sm text-surface-500">{{ app.job?.company?.name }} · {{ app.job?.location }}</p>
          <p class="text-xs text-surface-400 mt-1">Applied {{ timeAgo(app.appliedAt) }}</p>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <span :class="['badge', statusColor(app.status)]">{{ app.status }}</span>
          <button @click="$router.push(`/jobs/${app.job?.id}`)" class="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">View Job →</button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="card p-16 text-center">
      <div class="text-7xl mb-4">📭</div>
      <h3 class="text-xl font-bold text-surface-800 dark:text-surface-200 mb-2">
        {{ activeStatus ? `No ${activeStatus.toLowerCase()} applications` : 'No applications yet' }}
      </h3>
      <p class="text-surface-500 text-sm mb-6">Start applying to jobs and they'll appear here</p>
      <RouterLink to="/jobs"><Button accent="blue">Browse Jobs</Button></RouterLink>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
      <button v-for="p in totalPages" :key="p" @click="goToPage(p-1)"
        :class="['w-9 h-9 rounded-xl text-sm font-medium transition-all', currentPage===p-1 ? 'bg-brand-600 text-white' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-brand-400']">
        {{ p }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { seekerApi } from '@/api/seeker'
import Button from '@/components/shared/Button.vue'
import Skeleton from '@/components/shared/Skeleton.vue'

const loading = ref(true)
const applications = ref([])
const totalPages   = ref(1)
const currentPage  = ref(0)
const activeStatus = ref('')

const statusTabs = ref([
  { label: 'All',         value: '' },
  { label: 'Pending',     value: 'Pending' },
  { label: 'Reviewed',    value: 'Reviewed' },
  { label: 'Shortlisted', value: 'Shortlisted' },
  { label: 'Hired',       value: 'Hired' },
  { label: 'Rejected',    value: 'Rejected' },
])

const statusColor = s => ({
  Pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  Reviewed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Shortlisted: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  Rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  Hired: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
}[s] || 'bg-surface-100 dark:bg-surface-700 text-surface-600')

const timeAgo = d => { if (!d) return ''; const days = Math.floor((Date.now()-new Date(d))/86400000); return days===0?'Today':days===1?'Yesterday':`${days} days ago` }

async function fetchApps() {
  loading.value = true
  try {
    const params = { page: currentPage.value, size: 10 }
    if (activeStatus.value) params.status = activeStatus.value
    const res = await seekerApi.get('/applications', { params })
    applications.value = res.data.content || res.data || []
    totalPages.value   = res.data.totalPages || 1
  } catch (err) {
    console.error('Failed to fetch applications', err)
    applications.value = []
    totalPages.value = 1
  } finally { loading.value = false }
}

function goToPage(p) { currentPage.value = p; fetchApps() }
onMounted(fetchApps)
</script>
