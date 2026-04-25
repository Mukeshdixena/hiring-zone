<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-surface-900 dark:text-white">My Profile</h1>
        <p class="text-surface-500 mt-1">Complete your profile to generate a professional resume and stand out to employers</p>
      </div>
      <div class="flex gap-3">
        <Button accent="blue" outline @click="previewMode = !previewMode" id="profile-preview-btn">
          {{ previewMode ? 'Edit Profile' : 'Preview Resume' }}
        </Button>
        <Button accent="blue" @click="saveProfile" :loading="saving" id="profile-save-btn">
          Save Changes
        </Button>
      </div>
    </div>

    <!-- Preview Mode -->
    <div v-if="previewMode" class="card p-10 bg-white dark:bg-surface-900 shadow-2xl space-y-10" id="resume-preview">
      <div class="flex flex-col md:flex-row justify-between gap-6 border-b border-surface-200 dark:border-surface-800 pb-8">
        <div>
          <h2 class="text-4xl font-black text-surface-900 dark:text-white mb-2">{{ seekerAuth.user?.name }}</h2>
          <p class="text-xl text-brand-600 dark:text-brand-400 font-bold mb-4">{{ profile.title || 'Job Seeker' }}</p>
          <div class="flex flex-wrap gap-4 text-sm text-surface-500">
            <span v-if="profile.location" class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>{{ profile.location }}</span>
            <span v-if="profile.phone" class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>{{ profile.phone }}</span>
            <span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>{{ seekerAuth.user?.email }}</span>
          </div>
        </div>
        <div class="flex gap-3">
          <a v-if="profile.githubUrl" :href="profile.githubUrl" target="_blank" class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
          <a v-if="profile.linkedinUrl" :href="profile.linkedinUrl" target="_blank" class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.774-.773 1.774-1.729V1.729C24 .774 23.204 0 22.225 0z"/></svg></a>
        </div>
      </div>

      <section v-if="profile.bio">
        <h3 class="text-lg font-black text-surface-900 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-brand-600 pl-4">Professional Summary</h3>
        <p class="text-surface-700 dark:text-surface-300 leading-relaxed">{{ profile.bio }}</p>
      </section>

      <section v-if="profile.skills">
        <h3 class="text-lg font-black text-surface-900 dark:text-white uppercase tracking-wider mb-4 border-l-4 border-brand-600 pl-4">Core Skills</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="skill in skillsArray" :key="skill" class="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 px-4 py-1.5 rounded-lg text-sm font-medium border border-surface-200 dark:border-surface-700">{{ skill }}</span>
        </div>
      </section>

      <section v-if="profile.experiences?.length">
        <h3 class="text-lg font-black text-surface-900 dark:text-white uppercase tracking-wider mb-6 border-l-4 border-brand-600 pl-4">Work Experience</h3>
        <div class="space-y-8">
          <div v-for="exp in profile.experiences" :key="exp.id" class="relative pl-6 border-l-2 border-surface-100 dark:border-surface-800">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-600 border-4 border-white dark:border-surface-900"/>
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-black text-surface-900 dark:text-white text-lg">{{ exp.position }}</h4>
                <p class="text-brand-600 dark:text-brand-400 font-bold">{{ exp.company }}</p>
              </div>
              <span class="text-sm font-medium text-surface-500 bg-surface-50 dark:bg-surface-800 px-3 py-1 rounded-full border border-surface-200 dark:border-surface-700">
                {{ formatDate(exp.startDate) }} – {{ exp.current ? 'Present' : formatDate(exp.endDate) }}
              </span>
            </div>
            <p class="text-surface-600 dark:text-surface-400 text-sm leading-relaxed whitespace-pre-line">{{ exp.description }}</p>
          </div>
        </div>
      </section>

      <section v-if="profile.educations?.length">
        <h3 class="text-lg font-black text-surface-900 dark:text-white uppercase tracking-wider mb-6 border-l-4 border-brand-600 pl-4">Education</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="edu in profile.educations" :key="edu.id" class="card p-6 bg-surface-50 dark:bg-surface-800/50 border-none">
            <h4 class="font-bold text-surface-900 dark:text-white">{{ edu.degree }} in {{ edu.fieldOfStudy }}</h4>
            <p class="text-sm text-surface-500 mt-1">{{ edu.institution }}</p>
            <p class="text-xs text-brand-600 dark:text-brand-400 font-bold mt-2">{{ edu.startYear }} – {{ edu.endYear }}</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Edit Mode -->
    <div v-else class="space-y-8">
      <!-- Personal Info -->
      <div class="card p-6 space-y-6">
        <h2 class="text-xl font-bold text-surface-900 dark:text-white border-b border-surface-100 dark:border-surface-800 pb-4">Personal Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input id="prof-title" v-model="profile.title" label="Professional Title" placeholder="e.g. Senior Frontend Developer"/>
          <Input id="prof-phone" v-model="profile.phone" label="Phone Number" placeholder="+1 (555) 000-0000"/>
          <Input id="prof-location" v-model="profile.location" label="Location" placeholder="San Francisco, CA"/>
          <Input id="prof-skills" v-model="profile.skills" label="Skills (comma separated)" placeholder="React, Node.js, AWS..."/>
        </div>
        <Input id="prof-bio" v-model="profile.bio" label="Professional Summary" type="textarea" :rows="5" placeholder="Write a brief professional summary..."/>
      </div>

      <!-- Social Links -->
      <div class="card p-6 space-y-6">
        <h2 class="text-xl font-bold text-surface-900 dark:text-white border-b border-surface-100 dark:border-surface-800 pb-4">Links & Social</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input id="prof-portfolio" v-model="profile.portfolioUrl" label="Portfolio URL" placeholder="https://..."/>
          <Input id="prof-github" v-model="profile.githubUrl" label="GitHub URL" placeholder="https://github.com/..."/>
          <Input id="prof-linkedin" v-model="profile.linkedinUrl" label="LinkedIn URL" placeholder="https://linkedin.com/in/..."/>
        </div>
      </div>

      <!-- Experience -->
      <div class="card p-6 space-y-6">
        <div class="flex items-center justify-between border-b border-surface-100 dark:border-surface-800 pb-4">
          <h2 class="text-xl font-bold text-surface-900 dark:text-white">Work Experience</h2>
          <Button accent="blue" size="sm" @click="addExperience">+ Add Experience</Button>
        </div>
        <div class="space-y-6">
          <div v-for="(exp, i) in profile.experiences" :key="i" class="p-6 bg-surface-50 dark:bg-surface-800 rounded-2xl relative group">
            <button @click="removeExperience(i)" class="absolute top-4 right-4 text-surface-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <Input :id="`exp-comp-${i}`" v-model="exp.company" label="Company" placeholder="Google"/>
              <Input :id="`exp-pos-${i}`" v-model="exp.position" label="Position" placeholder="Software Engineer"/>
              <Input :id="`exp-start-${i}`" v-model="exp.startDate" type="date" label="Start Date"/>
              <div class="space-y-1">
                <label class="text-sm font-medium text-surface-700 dark:text-surface-300 block">End Date</label>
                <div class="flex items-center gap-4 h-[42px]">
                  <input v-if="!exp.current" type="date" v-model="exp.endDate" class="flex-1 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40"/>
                  <label class="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" v-model="exp.current" class="rounded text-brand-600"/>
                    <span class="text-sm">Current</span>
                  </label>
                </div>
              </div>
            </div>
            <Input :id="`exp-desc-${i}`" v-model="exp.description" label="Description" type="textarea" :rows="3"/>
          </div>
        </div>
      </div>

      <!-- Education -->
      <div class="card p-6 space-y-6">
        <div class="flex items-center justify-between border-b border-surface-100 dark:border-surface-800 pb-4">
          <h2 class="text-xl font-bold text-surface-900 dark:text-white">Education</h2>
          <Button accent="blue" size="sm" @click="addEducation">+ Add Education</Button>
        </div>
        <div class="space-y-6">
          <div v-for="(edu, i) in profile.educations" :key="i" class="p-6 bg-surface-50 dark:bg-surface-800 rounded-2xl relative group">
            <button @click="removeEducation(i)" class="absolute top-4 right-4 text-surface-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input :id="`edu-inst-${i}`" v-model="edu.institution" label="Institution" placeholder="Stanford University"/>
              <Input :id="`edu-deg-${i}`" v-model="edu.degree" label="Degree" placeholder="Bachelor of Science"/>
              <Input :id="`edu-field-${i}`" v-model="edu.fieldOfStudy" label="Field of Study" placeholder="Computer Science"/>
              <div class="grid grid-cols-2 gap-4">
                <Input :id="`edu-start-${i}`" v-model="edu.startYear" label="Start Year" placeholder="2018"/>
                <Input :id="`edu-end-${i}`" v-model="edu.endYear" label="End Year" placeholder="2022"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { seekerApi } from '@/api/seeker'
import { useSeekerAuthStore } from '@/stores/seekerAuth'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/shared/Button.vue'
import Input from '@/components/shared/Input.vue'

const seekerAuth = useSeekerAuthStore()
const toast = useToastStore()

const loading = ref(true)
const saving = ref(false)
const previewMode = ref(false)
const profile = ref({
  title: '',
  bio: '',
  phone: '',
  location: '',
  portfolioUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  skills: '',
  experiences: [],
  educations: []
})

const skillsArray = computed(() => profile.value.skills ? profile.value.skills.split(',').map(s => s.trim()).filter(Boolean) : [])

async function fetchProfile() {
  loading.value = true
  try {
    const res = await seekerApi.get('/profile')
    profile.value = res.data
  } catch (err) {
    toast.error('Failed to load profile')
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  try {
    const res = await seekerApi.put('/profile', profile.value)
    profile.value = res.data
    toast.success('Profile updated successfully!')
  } catch (err) {
    toast.error('Failed to save profile')
  } finally {
    saving.value = false
  }
}

function addExperience() {
  profile.value.experiences.unshift({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  })
}

function removeExperience(index) {
  profile.value.experiences.splice(index, 1)
}

function addEducation() {
  profile.value.educations.unshift({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: ''
  })
}

function removeEducation(index) {
  profile.value.educations.splice(index, 1)
}

const formatDate = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''

onMounted(fetchProfile)
</script>

<style scoped>
#resume-preview {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
