<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filters Sidebar -->
      <aside class="w-full lg:w-72 flex-shrink-0">
        <div class="card p-5 sticky top-24">
          <h2 class="font-bold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
            <svg class="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Filters
          </h2>

          <!-- Job Type -->
          <div class="mb-5">
            <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Job Type</p>
            <div class="space-y-2">
              <label v-for="t in jobTypes" :key="t" class="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" :id="`type-${t}`" v-model="filters.types" :value="t" class="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"/>
                <span class="text-sm text-surface-700 dark:text-surface-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{{ t }}</span>
              </label>
            </div>
          </div>

          <!-- Experience Level -->
          <div class="mb-5">
            <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Experience Level</p>
            <div class="space-y-2">
              <label v-for="lvl in expLevels" :key="lvl" class="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" :id="`exp-${lvl}`" v-model="filters.expLevels" :value="lvl" class="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"/>
                <span class="text-sm text-surface-700 dark:text-surface-300 group-hover:text-brand-600 transition-colors">{{ lvl }}</span>
              </label>
            </div>
          </div>

          <!-- Salary Range -->
          <div class="mb-5">
            <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Min Salary</p>
            <select id="salary-filter" v-model="filters.minSalary" class="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm px-3 py-2.5 text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40">
              <option value="">Any</option>
              <option value="300000">₹3 Lakh+</option>
              <option value="600000">₹6 Lakh+</option>
              <option value="1000000">₹10 Lakh+</option>
              <option value="1500000">₹15 Lakh+</option>
              <option value="2500000">₹25 Lakh+</option>
            </select>
          </div>

          <!-- Category -->
          <div class="mb-5">
            <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Category</p>
            <select id="category-filter" v-model="filters.category" class="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm px-3 py-2.5 text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40">
              <option value="">All Categories</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <Button accent="blue" size="sm" full @click="applyFilters" id="apply-filters-btn">Apply Filters</Button>
          <button @click="resetFilters" id="reset-filters-btn" class="w-full mt-2 text-xs text-surface-500 hover:text-brand-600 transition-colors py-1">Reset all</button>
        </div>
      </aside>

      <!-- Jobs List -->
      <div class="flex-1 min-w-0">
        <!-- Search bar -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
            <input id="jobs-keyword-search" v-model="searchKeyword" type="text" placeholder="Search job title or keyword…" class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40" @keyup.enter="fetchJobs"/>
          </div>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
            <input id="jobs-location-search" v-model="searchLocation" type="text" placeholder="Location…" class="pl-10 pr-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 w-full sm:w-44" @keyup.enter="fetchJobs"/>
          </div>
          <Button accent="blue" size="md" @click="fetchJobs" id="jobs-search-btn" :loading="loading">Search</Button>
        </div>

        <!-- Results count & sort -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-surface-500"><span class="font-semibold text-surface-800 dark:text-surface-200">{{ total }}</span> jobs found</p>
          <select id="sort-jobs" v-model="sortBy" @change="fetchJobs" class="text-sm border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 rounded-xl px-3 py-1.5 text-surface-700 dark:text-surface-300 focus:outline-none">
            <option value="newest">Newest First</option>
            <option value="salary_desc">Highest Salary</option>
            <option value="salary_asc">Lowest Salary</option>
          </select>
        </div>

        <!-- Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="i in 8" :key="i" class="card p-5 space-y-3">
            <Skeleton height="h-4" width="w-2/3"/>
            <Skeleton height="h-3" width="w-1/2"/>
            <Skeleton height="h-3" width="w-full"/>
            <Skeleton height="h-3" width="w-3/4"/>
          </div>
        </div>

        <!-- Job cards -->
        <div v-else-if="jobs.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <JobCard v-for="job in jobs" :key="job.id" :job="job"/>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-20 card">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-bold text-surface-800 dark:text-surface-200 mb-2">No jobs found</h3>
          <p class="text-surface-500 text-sm mb-6">Try adjusting your search terms or filters</p>
          <Button accent="blue" size="sm" @click="resetFilters" id="empty-reset-btn">Clear Filters</Button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
          <button v-for="p in totalPages" :key="p" @click="goToPage(p-1)" :id="`page-${p}`"
            :class="['w-9 h-9 rounded-xl text-sm font-medium transition-all', currentPage === p-1 ? 'bg-brand-600 text-white shadow-lg' : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-brand-400']">
            {{ p }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { seekerApi } from '@/api/seeker'
import Button from '@/components/shared/Button.vue'
import Skeleton from '@/components/shared/Skeleton.vue'
import JobCard from '@/components/seeker/JobCard.vue'

const route = useRoute()
const loading = ref(true)
const jobs    = ref([])
const total   = ref(0)
const totalPages = ref(1)
const currentPage = ref(0)
const sortBy  = ref('newest')

const searchKeyword  = ref(route.query.keyword || '')
const searchLocation = ref(route.query.location || '')

const filters = ref({ types: [], expLevels: [], minSalary: '', category: route.query.category || '' })

const jobTypes  = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
const expLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager']
const categories = ['Technology', 'Design', 'Marketing', 'Finance', 'Healthcare', 'Sales', 'Education', 'Engineering']

async function fetchJobs() {
  loading.value = true
  try {
    const params = {
      page: currentPage.value, size: 12, sort: sortBy.value,
      keyword: searchKeyword.value, location: searchLocation.value,
      minSalary: filters.value.minSalary, category: filters.value.category,
      types: filters.value.types.join(','), expLevels: filters.value.expLevels.join(','),
    }
    const res = await seekerApi.get('/jobs', { params })
    jobs.value       = res.data.content || res.data || []
    total.value      = res.data.totalElements || jobs.value.length
    totalPages.value = res.data.totalPages || 1
  } catch (err) {
    console.error('Failed to fetch jobs', err)
    jobs.value = []
    total.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

function applyFilters() { currentPage.value = 0; fetchJobs() }
function goToPage(p) { currentPage.value = p; fetchJobs() }
function resetFilters() {
  filters.value = { types: [], expLevels: [], minSalary: '', category: '' }
  searchKeyword.value = ''; searchLocation.value = ''
  currentPage.value = 0; fetchJobs()
}

onMounted(fetchJobs)
watch(() => route.query, () => {
  searchKeyword.value  = route.query.keyword || ''
  searchLocation.value = route.query.location || ''
  filters.value.category = route.query.category || ''
  fetchJobs()
})
</script>
