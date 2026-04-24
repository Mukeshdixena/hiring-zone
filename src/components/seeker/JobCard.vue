<template>
  <div class="w-full h-full rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group" @click="$router.push(`/jobs/${job.id}`)">
    <!-- Header -->
    <div class="flex items-start justify-between gap-3 mb-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 flex items-center justify-center font-bold text-brand-700 dark:text-brand-300 text-sm flex-shrink-0">
          {{ (job.company?.name || 'C')[0].toUpperCase() }}
        </div>
        <div>
          <p class="text-xs font-medium text-surface-500">{{ job.company?.name || 'Unknown Company' }}</p>
          <div class="flex items-center gap-1 text-xs text-surface-400">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
            {{ job.location }}
          </div>
        </div>
      </div>
      <div v-if="job.remote" class="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex-shrink-0">Remote</div>
    </div>

    <h3 class="font-bold text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2 leading-snug">{{ job.title }}</h3>

    <!-- Tags -->
    <div class="flex flex-wrap gap-1.5 mb-4">
      <span v-for="tag in (job.tags || []).slice(0,3)" :key="tag" class="badge bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">{{ tag }}</span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-700">
      <div class="text-sm font-bold text-surface-800 dark:text-surface-200">
        <span v-if="job.salaryMin">${{ formatSalary(job.salaryMin) }} – ${{ formatSalary(job.salaryMax) }}</span>
        <span v-else class="text-surface-400 font-normal text-xs">Salary not disclosed</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-surface-400">{{ timeAgo(job.createdAt) }}</span>
        <span :class="['badge', typeColor(job.type)]">{{ job.type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ job: { type: Object, required: true } })

function formatSalary(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k'
  return n
}
function timeAgo(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days/7)}w ago`
  return `${Math.floor(days/30)}mo ago`
}
function typeColor(type) {
  const m = { 'Full-time': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', 'Part-time': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', 'Remote': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300', 'Contract': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', 'Internship': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' }
  return m[type] || 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
}
</script>
