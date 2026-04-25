<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-surface-900 dark:text-white">Manage Jobs</h1>
        <p class="text-surface-500 mt-1">{{ total }} job listings</p>
      </div>
      <RouterLink to="/employers/post-job">
        <Button accent="green" size="md" id="manage-post-job-btn">+ Post New Job</Button>
      </RouterLink>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
        <input id="manage-jobs-search" v-model="searchQ" type="text" placeholder="Search jobs…" class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-emp-500/40 text-surface-900 dark:text-surface-100" @input="fetchJobs"/>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="card p-5 flex gap-4">
        <div class="flex-1 space-y-2"><Skeleton height="h-5" width="w-1/2"/><Skeleton height="h-4" width="w-1/3"/></div>
        <Skeleton height="h-8" width="w-24"/>
      </div>
    </div>

    <!-- Job table -->
    <div v-else-if="jobs.length" class="space-y-3">
      <div v-for="job in jobs" :key="job.id" class="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <h3 class="font-bold text-surface-900 dark:text-white">{{ job.title }}</h3>
            <span :class="['badge', job.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-surface-100 dark:bg-surface-700 text-surface-500']">{{ job.status || 'Active' }}</span>
          </div>
          <p class="text-sm text-surface-500">{{ job.location }} · {{ job.type }} · {{ job.applicationCount || 0 }} applications · Posted {{ timeAgo(job.createdAt) }}</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <RouterLink :to="`/employers/jobs/${job.id}/applicants`" class="text-xs font-medium text-emp-600 dark:text-emp-400 hover:underline px-3 py-1.5 rounded-lg hover:bg-emp-50 dark:hover:bg-emp-900/20 transition-colors">Applicants</RouterLink>
          <RouterLink :to="`/employers/post-job?edit=${job.id}`" class="text-xs font-medium text-surface-600 dark:text-surface-300 hover:underline px-3 py-1.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">Edit</RouterLink>
          <button @click="confirmDelete(job)" :id="`delete-job-${job.id}`" class="text-xs font-medium text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete</button>
        </div>
      </div>
    </div>

    <div v-else class="card p-16 text-center">
      <div class="text-7xl mb-4">📋</div>
      <h3 class="text-xl font-bold text-surface-800 dark:text-surface-200 mb-2">No jobs posted yet</h3>
      <p class="text-surface-500 text-sm mb-6">Post your first job to start receiving applications</p>
      <RouterLink to="/employers/post-job"><Button accent="green">Post First Job</Button></RouterLink>
    </div>

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div class="card max-w-md w-full p-6 shadow-2xl">
          <h3 class="text-xl font-bold text-surface-900 dark:text-white mb-2">Delete Job Listing?</h3>
          <p class="text-surface-500 text-sm mb-6">This will permanently remove "<strong>{{ deleteTarget.title }}</strong>" and all its applications. This cannot be undone.</p>
          <div class="flex gap-3">
            <Button accent="green" outline @click="deleteTarget=null" id="cancel-delete-btn" class="flex-1">Cancel</Button>
            <button @click="doDelete" id="confirm-delete-btn" class="flex-1 inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-5 py-2.5 text-sm bg-red-600 hover:bg-red-700 text-white transition-all active:scale-95" :disabled="deleting">
              <svg v-if="deleting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              {{ deleting ? 'Deleting…' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { employerApi } from '@/api/employer'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/shared/Button.vue'
import Skeleton from '@/components/shared/Skeleton.vue'

const toast   = useToastStore()
const loading = ref(true)
const deleting = ref(false)
const jobs    = ref([])
const total   = ref(0)
const searchQ = ref('')
const deleteTarget = ref(null)

const timeAgo = d => { if (!d) return ''; const days = Math.floor((Date.now()-new Date(d))/86400000); return days===0?'Today':days===1?'1d ago':`${days}d ago` }

async function fetchJobs() {
  loading.value = true
  try {
    const res = await employerApi.get('/employer/jobs', { params: { search: searchQ.value } })
    jobs.value  = res.data.content || res.data || []
    total.value = res.data.totalElements || jobs.value.length
  } catch (err) {
    console.error('Failed to fetch jobs', err)
    jobs.value = []
    total.value = 0
  } finally { loading.value = false }
}

function confirmDelete(job) { deleteTarget.value = job }
async function doDelete() {
  deleting.value = true
  try {
    await employerApi.delete(`/employer/jobs/${deleteTarget.value.id}`)
    jobs.value = jobs.value.filter(j => j.id !== deleteTarget.value.id)
    toast.success('Job deleted')
    deleteTarget.value = null
  } catch { toast.error('Failed to delete job') }
  finally   { deleting.value = false }
}

onMounted(fetchJobs)
</script>
