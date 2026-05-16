<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
      <RouterLink to="/employers/jobs" class="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-emp-600 transition-colors mb-4">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Back to Jobs
      </RouterLink>
      <h1 class="text-3xl font-black text-surface-900 dark:text-white">{{ isEdit ? 'Edit Job' : 'Post a New Job' }}</h1>
      <p class="text-surface-500 mt-1">Fill in the details below to {{ isEdit ? 'update your' : 'publish a new' }} listing</p>
    </div>

    <div class="card p-8 space-y-6">
      <!-- Basic Info -->
      <div>
        <h2 class="text-lg font-bold text-surface-800 dark:text-surface-200 mb-4 pb-2 border-b border-surface-200 dark:border-surface-700">Basic Information</h2>
        <div class="space-y-4">
          <Input id="job-title" v-model="form.title" label="Job Title" placeholder="e.g. Senior Frontend Developer" :error="errors.title" required/>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Job Type <span class="text-red-500">*</span></label>
              <select id="job-type" v-model="form.type" class="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emp-500/40 text-surface-900 dark:text-surface-100">
                <option v-for="t in jobTypes" :key="t">{{ t }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Experience Level</label>
              <select id="job-exp" v-model="form.experienceLevel" class="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emp-500/40 text-surface-900 dark:text-surface-100">
                <option v-for="lvl in expLevels" :key="lvl">{{ lvl }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="job-location" v-model="form.location" label="Location" placeholder="Remote / New York, NY" :error="errors.location" required/>
            <div>
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Category</label>
              <select id="job-category" v-model="form.category" class="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emp-500/40 text-surface-900 dark:text-surface-100">
                <option v-for="c in categories" :key="c">{{ c }}</option>
              </select>
            </div>
          </div>
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input id="job-remote" type="checkbox" v-model="form.remote" class="w-4 h-4 rounded border-surface-300 text-emp-600 focus:ring-emp-500"/>
            <span class="text-sm font-medium text-surface-700 dark:text-surface-300">This is a remote-friendly position</span>
          </label>
        </div>
      </div>

      <!-- Salary -->
      <div>
        <h2 class="text-lg font-bold text-surface-800 dark:text-surface-200 mb-4 pb-2 border-b border-surface-200 dark:border-surface-700">Compensation</h2>
        <div class="grid grid-cols-2 gap-4">
          <Input id="job-salary-min" v-model="form.salaryMin" label="Min Salary (₹ / yr)" type="number" placeholder="500000"/>
          <Input id="job-salary-max" v-model="form.salaryMax" label="Max Salary (₹ / yr)" type="number" placeholder="1500000"/>
        </div>
      </div>

      <!-- Description -->
      <div>
        <h2 class="text-lg font-bold text-surface-800 dark:text-surface-200 mb-4 pb-2 border-b border-surface-200 dark:border-surface-700">Job Details</h2>
        <div class="space-y-4">
          <Input id="job-description" v-model="form.description" label="Job Description" type="textarea" placeholder="Describe the role, responsibilities, and team…" :error="errors.description" :rows="6" required/>
          <Input id="job-requirements" v-model="form.requirements" label="Requirements" type="textarea" placeholder="One requirement per line…" :rows="5"/>
          <Input id="job-benefits" v-model="form.benefits" label="Benefits & Perks" type="textarea" placeholder="Health insurance, 401k, remote work…" :rows="3"/>
        </div>
      </div>

      <!-- Tags -->
      <div>
        <h2 class="text-lg font-bold text-surface-800 dark:text-surface-200 mb-4 pb-2 border-b border-surface-200 dark:border-surface-700">Skills & Tags</h2>
        <div class="flex flex-wrap gap-2 mb-3">
          <span v-for="(tag, i) in form.tags" :key="i" class="badge bg-emp-100 dark:bg-emp-900/30 text-emp-700 dark:text-emp-300 text-sm py-1">
            {{ tag }}
            <button @click="form.tags.splice(i,1)" class="ml-1 hover:text-red-500 transition-colors">×</button>
          </span>
        </div>
        <div class="flex gap-2">
          <input id="tag-input" v-model="tagInput" type="text" placeholder="Add skill tag (press Enter)" @keyup.enter="addTag" class="flex-1 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm px-4 py-2.5 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-emp-500/40"/>
          <Button accent="green" size="sm" @click="addTag" id="add-tag-btn">Add</Button>
        </div>
      </div>

      <!-- Deadline -->
      <div>
        <Input id="job-deadline" v-model="form.deadline" label="Application Deadline (optional)" type="date"/>
      </div>

      <!-- Error -->
      <div v-if="errors.general" class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">{{ errors.general }}</div>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <Button type="button" accent="green" size="lg" @click="submitJob" :loading="loading" id="submit-job-btn" class="flex-1">
          {{ isEdit ? 'Update Job' : 'Publish Job' }}
        </Button>
        <RouterLink to="/employers/jobs">
          <Button type="button" accent="green" size="lg" outline id="cancel-job-btn">Cancel</Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { employerApi } from '@/api/employer'
import { seekerApi } from '@/api/seeker'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/shared/Button.vue'
import Input from '@/components/shared/Input.vue'

const route  = useRoute()
const router = useRouter()
const toast  = useToastStore()

const isEdit  = computed(() => !!route.query.edit)
const loading = ref(false)
const errors  = ref({})
const tagInput = ref('')

const form = ref({ title:'', type:'Full-time', experienceLevel:'Mid Level', location:'', category:'Technology', remote:false, salaryMin:'', salaryMax:'', description:'', requirements:'', benefits:'', tags:[], deadline:'' })

const jobTypes   = ref([])
const expLevels  = ref([])
const categories = ref([])

function addTag() {
  const t = tagInput.value.trim()
  if (t && !form.value.tags.includes(t) && form.value.tags.length < 10) { form.value.tags.push(t) }
  tagInput.value = ''
}

async function submitJob() {
  errors.value = {}
  if (!form.value.title)       { errors.value.title       = 'Job title is required'; return }
  if (!form.value.location)    { errors.value.location    = 'Location is required'; return }
  if (!form.value.description) { errors.value.description = 'Description is required'; return }

  loading.value = true
  try {
    const payload = { ...form.value, salaryMin: form.value.salaryMin ? Number(form.value.salaryMin) : null, salaryMax: form.value.salaryMax ? Number(form.value.salaryMax) : null }
    if (isEdit.value) {
      await employerApi.put(`/employer/jobs/${route.query.edit}`, payload)
      toast.success('Job updated successfully!')
    } else {
      await employerApi.post('/employer/jobs', payload)
      toast.success('Job published successfully! 🎉')
    }
    router.push('/employers/jobs')
  } catch (e) { errors.value.general = e.response?.data?.message || 'Failed to save job' }
  finally      { loading.value = false }
}

onMounted(async () => {
  try {
    const metaRes = await seekerApi.get('/meta')
    jobTypes.value   = metaRes.data.jobTypes || []
    expLevels.value  = metaRes.data.experienceLevels || []
    categories.value = metaRes.data.categories || []
  } catch {
    jobTypes.value   = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
    expLevels.value  = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager', 'Director']
    categories.value = ['Technology', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Sales', 'Education', 'Engineering', 'Operations', 'Other']
  }
  if (isEdit.value) {
    try {
      const res = await employerApi.get(`/employer/jobs/${route.query.edit}`)
      Object.assign(form.value, res.data)
    } catch { toast.error('Failed to load job') }
  }
})
</script>
