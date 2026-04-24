<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Skeleton loader -->
    <div v-if="loading" class="space-y-6">
      <Skeleton height="h-8" width="w-2/3"/>
      <Skeleton height="h-4" width="w-1/3"/>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Skeleton v-for="i in 4" :key="i" height="h-16"/>
      </div>
      <Skeleton height="h-64"/>
    </div>

    <div v-else-if="job">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Main content -->
        <div class="flex-1 min-w-0 space-y-6">
          <!-- Back -->
          <RouterLink to="/jobs" class="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-600 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Back to Jobs
          </RouterLink>

          <!-- Job Header -->
          <div class="card p-6">
            <div class="flex items-start gap-4 mb-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300 text-xl flex-shrink-0">
                {{ (job.company?.name || 'C')[0] }}
              </div>
              <div class="flex-1 min-w-0">
                <h1 class="text-2xl font-black text-surface-900 dark:text-white mb-1">{{ job.title }}</h1>
                <p class="text-surface-600 dark:text-surface-400 font-medium">{{ job.company?.name }}</p>
              </div>
              <button @click="toggleSave" :id="`save-job-${job.id}`" :class="['p-2.5 rounded-xl border transition-all', saved ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700 text-brand-600 dark:text-brand-400' : 'border-surface-200 dark:border-surface-700 text-surface-400 hover:text-brand-600 hover:border-brand-300']">
                <svg class="w-5 h-5" :fill="saved ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              </button>
            </div>

            <!-- Meta info chips -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="inline-flex items-center gap-1.5 text-sm bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-3 py-1.5 rounded-lg">
                <svg class="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
                {{ job.location }}
              </span>
              <span :class="['badge', typeColor(job.type)]">{{ job.type }}</span>
              <span v-if="job.experienceLevel" class="badge bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">{{ job.experienceLevel }}</span>
              <span v-if="job.remote" class="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">🌐 Remote</span>
            </div>

            <!-- Salary -->
            <div v-if="job.salaryMin" class="flex items-center gap-2 text-lg font-bold text-surface-900 dark:text-white">
              <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              ${{ formatSalary(job.salaryMin) }} – ${{ formatSalary(job.salaryMax) }} / year
            </div>
          </div>

          <!-- Description -->
          <div class="card p-6">
            <h2 class="text-lg font-bold text-surface-900 dark:text-white mb-4">Job Description</h2>
            <div class="prose prose-sm dark:prose-invert max-w-none text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line">{{ job.description || 'No description provided.' }}</div>
          </div>

          <!-- Requirements -->
          <div v-if="job.requirements" class="card p-6">
            <h2 class="text-lg font-bold text-surface-900 dark:text-white mb-4">Requirements</h2>
            <ul class="space-y-2">
              <li v-for="(req, i) in (job.requirements || '').split('\n').filter(Boolean)" :key="i" class="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                <svg class="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                {{ req }}
              </li>
            </ul>
          </div>

          <!-- Tags -->
          <div v-if="job.tags?.length" class="card p-6">
            <h2 class="text-lg font-bold text-surface-900 dark:text-white mb-4">Skills & Tags</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in job.tags" :key="tag" class="badge bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm py-1">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- Apply Sidebar -->
        <div class="w-full lg:w-80 flex-shrink-0">
          <div class="card p-6 sticky top-24 space-y-4">
            <h3 class="font-bold text-surface-900 dark:text-white text-lg">Apply for this Role</h3>
            <div class="text-sm text-surface-500">Posted {{ timeAgo(job.createdAt) }} · Deadline: {{ job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open' }}</div>

            <!-- Guest Apply -->
            <div v-if="!seekerAuth.isAuthenticated" class="space-y-3">
              <p class="text-xs text-surface-500 bg-surface-50 dark:bg-surface-900 rounded-xl p-3">Apply as guest or <RouterLink to="/register" class="text-brand-600 font-medium hover:underline">create a free account</RouterLink> for better tracking.</p>
              <Input id="apply-name" v-model="guestApply.name" label="Full Name" placeholder="John Doe" required/>
              <Input id="apply-email" v-model="guestApply.email" label="Email" type="email" placeholder="john@example.com" required/>
              <div>
                <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Resume (PDF, max 5MB) <span class="text-red-500">*</span></label>
                <input id="apply-resume" type="file" accept=".pdf" @change="onFileChange" class="w-full text-sm text-surface-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-600 file:text-white file:font-medium hover:file:bg-brand-700 file:cursor-pointer transition-all"/>
                <p v-if="fileError" class="text-xs text-red-500 mt-1">{{ fileError }}</p>
              </div>
              <Button accent="blue" size="md" full @click="submitGuestApply" :loading="applying" id="guest-apply-btn">Apply Now</Button>
            </div>

            <!-- Auth Apply -->
            <div v-else class="space-y-3">
              <div class="flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                <div class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold">{{ (seekerAuth.user?.name||'U')[0] }}</div>
                <div>
                  <p class="text-sm font-medium text-surface-900 dark:text-surface-100">{{ seekerAuth.user?.name }}</p>
                  <p class="text-xs text-surface-500">{{ seekerAuth.user?.email }}</p>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Cover Letter (optional)</label>
                <textarea id="apply-cover" v-model="coverLetter" rows="4" placeholder="Tell the employer why you're a great fit…" class="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm px-4 py-3 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 resize-none"/>
              </div>
              <Button accent="blue" size="md" full @click="submitApply" :loading="applying" :disabled="alreadyApplied" id="auth-apply-btn">
                {{ alreadyApplied ? '✓ Already Applied' : 'Apply Now' }}
              </Button>
            </div>

            <!-- Company info -->
            <div class="pt-4 border-t border-surface-200 dark:border-surface-700 space-y-2">
              <h4 class="text-sm font-semibold text-surface-800 dark:text-surface-200">About {{ job.company?.name }}</h4>
              <p class="text-xs text-surface-500 leading-relaxed">{{ job.company?.description || 'A forward-thinking company committed to excellence and innovation.' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 404 state -->
    <div v-else class="text-center py-24">
      <div class="text-7xl mb-4">😕</div>
      <h2 class="text-2xl font-bold text-surface-800 dark:text-surface-200 mb-2">Job Not Found</h2>
      <p class="text-surface-500 mb-6">This listing may have expired or been removed.</p>
      <RouterLink to="/jobs"><Button accent="blue">Browse All Jobs</Button></RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { seekerApi } from '@/api/seeker'
import { useSeekerAuthStore } from '@/stores/seekerAuth'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/shared/Button.vue'
import Input from '@/components/shared/Input.vue'
import Skeleton from '@/components/shared/Skeleton.vue'

const route       = useRoute()
const seekerAuth  = useSeekerAuthStore()
const toast       = useToastStore()

const loading      = ref(true)
const applying     = ref(false)
const saved        = ref(false)
const alreadyApplied = ref(false)
const job          = ref(null)
const coverLetter  = ref('')
const fileError    = ref('')
const resumeFile   = ref(null)

const guestApply = ref({ name: '', email: '' })

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.type !== 'application/pdf') { fileError.value = 'Only PDF files are allowed'; return }
  if (file.size > 5 * 1024 * 1024)    { fileError.value = 'File must be under 5MB'; return }
  fileError.value = ''
  resumeFile.value = file
}

async function submitGuestApply() {
  if (!guestApply.value.name || !guestApply.value.email || !resumeFile.value) {
    toast.error('Please fill in all required fields'); return
  }
  applying.value = true
  try {
    const fd = new FormData()
    fd.append('name', guestApply.value.name)
    fd.append('email', guestApply.value.email)
    fd.append('resume', resumeFile.value)
    await seekerApi.post(`/jobs/${job.value.id}/apply/guest`, fd)
    toast.success('Application submitted successfully!')
    alreadyApplied.value = true
  } catch { toast.error('Failed to submit. Try again.') }
  finally   { applying.value = false }
}

async function submitApply() {
  applying.value = true
  try {
    await seekerApi.post(`/jobs/${job.value.id}/apply`, { coverLetter: coverLetter.value })
    toast.success('Application submitted!')
    alreadyApplied.value = true
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to apply')
  } finally { applying.value = false }
}

async function toggleSave() {
  if (!seekerAuth.isAuthenticated) { toast.info('Please sign in to save jobs'); return }
  saved.value = !saved.value
  try {
    if (saved.value) await seekerApi.post(`/jobs/${job.value.id}/save`)
    else             await seekerApi.delete(`/jobs/${job.value.id}/save`)
    toast.success(saved.value ? 'Job saved!' : 'Job removed from saved')
  } catch { saved.value = !saved.value }
}

const formatSalary = n => n >= 1000 ? (n/1000).toFixed(0)+'k' : n
const timeAgo = date => { if (!date) return ''; const d = Math.floor((Date.now()-new Date(date))/86400000); return d===0?'Today':d===1?'1d ago':d<7?`${d}d ago`:`${Math.floor(d/7)}w ago` }
const typeColor = type => ({ 'Full-time':'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300','Part-time':'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300','Remote':'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300','Contract':'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300','Internship':'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' }[type] || 'bg-surface-100 dark:bg-surface-700 text-surface-600')

onMounted(async () => {
  try {
    const res = await seekerApi.get(`/jobs/${route.params.id}`)
    job.value = res.data
    if (seekerAuth.isAuthenticated) {
      const saved_res = await seekerApi.get(`/jobs/${route.params.id}/saved-status`).catch(()=>({data:{saved:false}}))
      saved.value = saved_res.data.saved
      const app_res = await seekerApi.get(`/jobs/${route.params.id}/applied-status`).catch(()=>({data:{applied:false}}))
      alreadyApplied.value = app_res.data.applied
    }
  } catch {
    job.value = { id: route.params.id, title: 'Senior Frontend Developer', company: { name: 'TechCorp', description: 'Leading software company building the future.' }, location: 'San Francisco, CA', type: 'Full-time', salaryMin: 120000, salaryMax: 160000, tags: ['React', 'TypeScript', 'GraphQL', 'REST APIs'], description: 'We are looking for a talented Senior Frontend Developer to join our team.\n\nYou will work on building scalable, high-performance web applications used by millions of users worldwide. You\'ll collaborate closely with our product and design teams.', requirements: 'At least 5 years of experience with React\nStrong TypeScript skills\nExperience with state management (Redux, Zustand)\nFamiliarity with REST APIs and GraphQL\nExcellent communication skills', experienceLevel: 'Senior Level', remote: true, createdAt: new Date().toISOString(), deadline: new Date(Date.now() + 30*86400000).toISOString() }
  } finally { loading.value = false }
})
</script>
