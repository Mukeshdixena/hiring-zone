<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-white">Job Moderation</h1>
      <p class="text-surface-400 mt-1">Review, flag, and moderate all platform job listings</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input id="admin-jobs-search" v-model="searchQ" type="text" placeholder="Search jobs…" @input="fetchJobs" class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-adm-500/40"/>
      </div>
      <select id="admin-jobs-filter" v-model="flagFilter" @change="fetchJobs" class="rounded-xl border border-surface-700 bg-surface-800 text-surface-300 text-sm px-4 py-2.5 focus:outline-none">
        <option value="">All Jobs</option><option value="flagged">Flagged</option><option value="active">Active</option>
      </select>
    </div>

    <div class="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="border-b border-surface-800 bg-surface-800/50">
            <th class="text-left py-3 px-4 text-surface-400 font-medium">Job</th>
            <th class="text-left py-3 px-4 text-surface-400 font-medium hidden sm:table-cell">Company</th>
            <th class="text-left py-3 px-4 text-surface-400 font-medium hidden md:table-cell">Apps</th>
            <th class="text-left py-3 px-4 text-surface-400 font-medium">Status</th>
            <th class="text-right py-3 px-4 text-surface-400 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            <tr v-for="job in jobs" :key="job.id" class="border-b border-surface-800/50 hover:bg-surface-800/40 transition-colors">
              <td class="py-3 px-4">
                <p class="text-white font-medium">{{ job.title }}</p>
                <p class="text-xs text-surface-500">{{ job.location }} · {{ job.type }}</p>
              </td>
              <td class="py-3 px-4 text-surface-400 hidden sm:table-cell">{{ job.company?.name }}</td>
              <td class="py-3 px-4 text-surface-400 hidden md:table-cell">{{ job.applicationCount || 0 }}</td>
              <td class="py-3 px-4">
                <span :class="['badge', job.flagged ? 'bg-red-900/40 text-red-400' : job.expired ? 'bg-surface-700 text-surface-400' : 'bg-emerald-900/40 text-emerald-400']">
                  {{ job.flagged ? '🚩 Flagged' : job.expired ? 'Expired' : 'Active' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="toggleFlag(job)" :id="`flag-job-${job.id}`" :class="['text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', job.flagged ? 'text-emerald-400 hover:bg-emerald-900/20' : 'text-amber-400 hover:bg-amber-900/20']">{{ job.flagged ? 'Unflag' : 'Flag' }}</button>
                  <button @click="forceExpire(job)" :id="`expire-job-${job.id}`" class="text-xs font-medium text-violet-400 hover:bg-violet-900/20 px-3 py-1.5 rounded-lg transition-colors">Expire</button>
                  <button @click="deleteJob(job)" :id="`admin-delete-job-${job.id}`" class="text-xs font-medium text-red-400 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
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

const toast = useToastStore(); const jobs = ref([]); const searchQ = ref(''); const flagFilter = ref('')

async function fetchJobs() {
  try {
    const res = await adminApi.get('/admin/jobs', { params: { search: searchQ.value, flagged: flagFilter.value === 'flagged' }})
    jobs.value = res.data.content || res.data || []
  } catch { jobs.value = sampleJobs() }
}

async function toggleFlag(job) {
  try { await adminApi.patch(`/admin/jobs/${job.id}/flag`, { flagged: !job.flagged }); job.flagged = !job.flagged; toast.success(job.flagged ? 'Job flagged' : 'Flag removed') }
  catch { toast.error('Failed') }
}
async function forceExpire(job) {
  try { await adminApi.patch(`/admin/jobs/${job.id}/expire`); job.expired = true; toast.success('Job expired') }
  catch { toast.error('Failed') }
}
async function deleteJob(job) {
  if (!confirm(`Delete job "${job.title}"?`)) return
  try { await adminApi.delete(`/admin/jobs/${job.id}`); jobs.value = jobs.value.filter(j => j.id !== job.id); toast.success('Deleted') }
  catch { toast.error('Failed') }
}
onMounted(fetchJobs)
function sampleJobs() { return [
  { id:1, title:'Senior Frontend Dev', company:{name:'TechCorp'}, location:'Remote', type:'Full-time', applicationCount:12, flagged:false, expired:false },
  { id:2, title:'Fake Data Entry Job', company:{name:'SpamCo'},   location:'Anywhere', type:'Part-time', applicationCount:0, flagged:true, expired:false },
  { id:3, title:'Product Designer',    company:{name:'Designify'}, location:'NY', type:'Full-time', applicationCount:8, flagged:false, expired:false },
]}
</script>
