<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-surface-900 min-h-[90vh] flex items-center">
      <!-- Animated background blobs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse"/>
        <div class="absolute top-1/3 -left-40 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl animate-pulse" style="animation-delay:1s"/>
        <div class="absolute bottom-0 right-1/3 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl animate-pulse" style="animation-delay:2s"/>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div class="text-center max-w-4xl mx-auto slide-up">
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"/>
            <span>{{ stats.activeJobs.toLocaleString() }}+ jobs live right now</span>
          </div>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Find Your <span class="gradient-text-blue">Dream Job</span><br/>Today
          </h1>
          <p class="text-xl text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Thousands of opportunities from top companies. Search, apply, and get hired — faster than ever.
          </p>

          <!-- Search Bar -->
          <div class="glass rounded-2xl p-2 max-w-3xl mx-auto shadow-2xl">
            <div class="flex flex-col sm:flex-row gap-2">
              <div class="flex-1 relative">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
                <input id="hero-search-keyword" v-model="search.keyword" type="text" placeholder="Job title, keywords..." class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" @keyup.enter="doSearch"/>
              </div>
              <div class="flex-1 relative">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <input id="hero-search-location" v-model="search.location" type="text" placeholder="Location or Remote" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" @keyup.enter="doSearch"/>
              </div>
              <Button id="hero-search-btn" accent="blue" size="lg" @click="doSearch" :loading="searching">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
                Search
              </Button>
            </div>
          </div>

          <!-- Popular tags -->
          <div class="flex flex-wrap justify-center gap-2 mt-6">
            <span class="text-blue-300 text-sm">Popular:</span>
            <button v-for="tag in popularTags" :key="tag" @click="search.keyword=tag; doSearch()" class="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all border border-white/10">{{ tag }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="s in statCards" :key="s.label" class="text-center">
            <div class="text-3xl font-black text-brand-600 dark:text-brand-400">{{ s.value }}</div>
            <div class="text-sm text-surface-500 mt-1">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Job Categories -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-black text-surface-900 dark:text-white mb-3">Browse by <span class="gradient-text-blue">Category</span></h2>
        <p class="text-surface-500">Explore jobs across all industries and domains</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <button v-for="cat in categories" :key="cat.name" @click="searchByCategory(cat.name)"
          class="card card-hover p-5 text-left group cursor-pointer">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 transition-transform group-hover:scale-110', cat.bg]">{{ cat.icon }}</div>
          <div class="font-semibold text-surface-800 dark:text-surface-200 text-sm">{{ cat.name }}</div>
          <div class="text-xs text-surface-500 mt-0.5">{{ cat.count }} jobs</div>
        </button>
      </div>
    </section>

    <!-- Featured Jobs -->
    <section class="py-20 bg-surface-100 dark:bg-surface-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2 class="text-3xl font-black text-surface-900 dark:text-white mb-1">Featured <span class="gradient-text-blue">Opportunities</span></h2>
            <p class="text-surface-500">Hand-picked roles from top employers</p>
          </div>
          <RouterLink to="/jobs" class="hidden sm:flex items-center gap-1 text-brand-600 dark:text-brand-400 font-semibold hover:underline text-sm">
            View all jobs →
          </RouterLink>
        </div>

        <div v-if="loadingJobs" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="card p-6 space-y-3">
            <Skeleton height="h-5" width="w-3/4"/>
            <Skeleton height="h-4" width="w-1/2"/>
            <Skeleton height="h-4" width="w-full"/>
            <Skeleton height="h-4" width="w-2/3"/>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <JobCard v-for="job in featuredJobs" :key="job.id" :job="job"/>
        </div>

        <div class="text-center mt-10">
          <RouterLink to="/jobs">
            <Button accent="blue" size="lg" outline id="landing-view-all-btn">View All Jobs</Button>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-black text-surface-900 dark:text-white mb-3">Get hired in <span class="gradient-text-blue">3 simple steps</span></h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(step, i) in steps" :key="i" class="text-center">
          <div class="w-16 h-16 rounded-2xl bg-brand-600/10 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-2xl mx-auto mb-4">{{ step.icon }}</div>
          <h3 class="text-lg font-bold text-surface-800 dark:text-surface-200 mb-2">{{ step.title }}</h3>
          <p class="text-surface-500 text-sm leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-br from-brand-600 to-brand-800">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">Ready to find your next opportunity?</h2>
        <p class="text-blue-200 mb-8 text-lg">Join thousands of job seekers who found their dream job on HiringZone</p>
        <RouterLink to="/register">
          <Button accent="blue" size="xl" id="landing-cta-btn" class="!bg-white !text-brand-700 hover:!bg-blue-50 !shadow-2xl">Create Free Account</Button>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import Button from '@/components/shared/Button.vue'
import Skeleton from '@/components/shared/Skeleton.vue'
import JobCard from '@/components/seeker/JobCard.vue'
import { seekerApi } from '@/api/seeker'

const router   = useRouter()
const searching = ref(false)
const loadingJobs = ref(true)
const featuredJobs = ref([])

const search = ref({ keyword: '', location: '' })

const stats = ref({ activeJobs: 12480 })
const statCards = [
  { value: '12,480+', label: 'Active Jobs' },
  { value: '4,200+', label: 'Companies Hiring' },
  { value: '98,000+', label: 'Job Seekers' },
  { value: '92%', label: 'Placement Rate' },
]

const popularTags = ['Remote', 'Python', 'React', 'Full-Stack', 'Design', 'Marketing', 'Sales']

const categories = [
  { name: 'Technology',   icon: '💻', count: '3.2k', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { name: 'Design',       icon: '🎨', count: '1.1k', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { name: 'Marketing',    icon: '📣', count: '980',  bg: 'bg-pink-100 dark:bg-pink-900/30' },
  { name: 'Finance',      icon: '💰', count: '760',  bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { name: 'Healthcare',   icon: '🏥', count: '1.4k', bg: 'bg-red-100 dark:bg-red-900/30' },
  { name: 'Sales',        icon: '🤝', count: '890',  bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { name: 'Education',    icon: '📚', count: '540',  bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  { name: 'Engineering',  icon: '⚙️',  count: '2.1k', bg: 'bg-orange-100 dark:bg-orange-900/30' },
]

const steps = [
  { icon: '📝', title: 'Create Your Profile', desc: 'Sign up free and build a standout profile that showcases your skills and experience.' },
  { icon: '🔍', title: 'Find the Right Job', desc: 'Search thousands of listings and filter by salary, location, type, and experience level.' },
  { icon: '🚀', title: 'Apply with One Click', desc: 'Apply instantly using your profile or upload a resume. Track every application in real time.' },
]

async function doSearch() {
  searching.value = true
  await router.push({ path: '/jobs', query: { keyword: search.value.keyword, location: search.value.location } })
  searching.value = false
}

function searchByCategory(name) {
  router.push({ path: '/jobs', query: { category: name } })
}

onMounted(async () => {
  try {
    const res = await seekerApi.get('/jobs?page=0&size=6&featured=true')
    featuredJobs.value = res.data.content || res.data || []
  } catch {
    // Use placeholder data if backend not running
    featuredJobs.value = placeholderJobs()
  } finally {
    loadingJobs.value = false
  }
})

function placeholderJobs() {
  return [
    { id: 1, title: 'Senior Frontend Developer', company: { name: 'TechCorp Inc.' }, location: 'San Francisco, CA', type: 'Full-time', salaryMin: 120000, salaryMax: 160000, tags: ['React', 'TypeScript'], createdAt: new Date().toISOString(), remote: true },
    { id: 2, title: 'Product Designer', company: { name: 'Designify' }, location: 'New York, NY', type: 'Full-time', salaryMin: 90000, salaryMax: 130000, tags: ['Figma', 'UX'], createdAt: new Date().toISOString(), remote: false },
    { id: 3, title: 'Data Scientist', company: { name: 'DataFlow AI' }, location: 'Remote', type: 'Remote', salaryMin: 110000, salaryMax: 150000, tags: ['Python', 'ML'], createdAt: new Date().toISOString(), remote: true },
    { id: 4, title: 'DevOps Engineer', company: { name: 'CloudBurst' }, location: 'Austin, TX', type: 'Full-time', salaryMin: 105000, salaryMax: 140000, tags: ['AWS', 'Kubernetes'], createdAt: new Date().toISOString(), remote: false },
    { id: 5, title: 'Marketing Manager', company: { name: 'GrowthHQ' }, location: 'Chicago, IL', type: 'Full-time', salaryMin: 75000, salaryMax: 100000, tags: ['SEO', 'Analytics'], createdAt: new Date().toISOString(), remote: false },
    { id: 6, title: 'Backend Engineer (Go)', company: { name: 'Finvest' }, location: 'Remote', type: 'Remote', salaryMin: 130000, salaryMax: 170000, tags: ['Go', 'PostgreSQL'], createdAt: new Date().toISOString(), remote: true },
  ]
}
</script>
