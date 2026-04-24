<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-emp-900 via-emp-800 to-surface-900 min-h-[88vh] flex items-center">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-emp-600/20 rounded-full blur-3xl animate-pulse"/>
        <div class="absolute top-1/2 -left-32 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-pulse" style="animation-delay:1.2s"/>
        <div class="absolute bottom-0 right-1/4 w-56 h-56 bg-emp-400/10 rounded-full blur-3xl animate-pulse" style="animation-delay:0.5s"/>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div class="max-w-3xl slide-up">
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-emp-400 pulse-dot"/>
            Always free — no credit card required
          </div>
          <h1 class="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Hire Top Talent<br/><span class="gradient-text-green">Faster Than Ever</span>
          </h1>
          <p class="text-xl text-green-200 mb-10 leading-relaxed max-w-2xl">
            Post unlimited jobs, manage all applications in one place, and find the perfect candidates — completely free.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink to="/employers/register" id="employer-hero-cta">
              <Button accent="green" size="xl">Start Hiring Free →</Button>
            </RouterLink>
            <RouterLink to="/employers/login">
              <Button accent="green" size="xl" outline class="!text-white !border-white/40 hover:!bg-white/10">Sign In</Button>
            </RouterLink>
          </div>
          <p class="text-sm text-green-300 mt-4">Join 4,200+ companies already hiring on HiringZone</p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="s in empStats" :key="s.label">
            <div class="text-3xl font-black text-emp-600 dark:text-emp-400">{{ s.value }}</div>
            <div class="text-sm text-surface-500 mt-1">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-black text-surface-900 dark:text-white mb-3">Everything you need to <span class="gradient-text-green">hire smarter</span></h2>
        <p class="text-surface-500 max-w-xl mx-auto">A complete hiring toolkit built for modern teams</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="f in features" :key="f.title" class="card p-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform', f.bg]">{{ f.icon }}</div>
          <h3 class="font-bold text-surface-900 dark:text-white text-lg mb-2">{{ f.title }}</h3>
          <p class="text-surface-500 text-sm leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-24 bg-surface-100 dark:bg-surface-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-black text-surface-900 dark:text-white mb-3">Up and running in <span class="gradient-text-green">minutes</span></h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(step, i) in steps" :key="i" class="relative text-center">
            <div class="w-16 h-16 rounded-2xl bg-emp-100 dark:bg-emp-900/30 border border-emp-200 dark:border-emp-800 flex items-center justify-center text-2xl mx-auto mb-4 font-black text-emp-600 dark:text-emp-400">{{ i+1 }}</div>
            <h3 class="font-bold text-surface-800 dark:text-surface-200 mb-2">{{ step.title }}</h3>
            <p class="text-surface-500 text-sm">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 bg-gradient-to-br from-emp-600 to-emp-800">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">Ready to find your next hire?</h2>
        <p class="text-green-200 mb-8 text-lg">Create your company account and post your first job in under 5 minutes.</p>
        <RouterLink to="/employers/register">
          <Button accent="green" size="xl" id="employer-cta-btn" class="!bg-white !text-emp-700 hover:!bg-green-50 !shadow-2xl">Get Started — It's Free</Button>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Button from '@/components/shared/Button.vue'

const empStats = [
  { value: '98,000+', label: 'Active Candidates' },
  { value: '4,200+',  label: 'Companies Hiring' },
  { value: '12,480+', label: 'Jobs Posted' },
  { value: '< 5min',  label: 'To Post a Job' },
]

const features = [
  { icon: '📢', title: 'Unlimited Job Posts',    desc: 'Post as many jobs as you need — forever free, no limits, no hidden costs.',           bg: 'bg-emp-100 dark:bg-emp-900/30' },
  { icon: '📥', title: 'Applicant Inbox',        desc: 'All applications centralized. Review resumes, cover letters, and profiles in one view.', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: '🔄', title: 'Status Management',      desc: 'Move candidates through Pending → Reviewed → Shortlisted → Hired with one click.',     bg: 'bg-violet-100 dark:bg-violet-900/30' },
  { icon: '🔍', title: 'Smart Candidate Search', desc: 'Filter applicants by skills, experience level, location, and more in real time.',      bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { icon: '📊', title: 'Analytics Dashboard',    desc: 'Track views, applications, and conversion rates for each job listing.',               bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { icon: '🏢', title: 'Company Profile',        desc: 'Build a branded employer profile that attracts the right candidates organically.',     bg: 'bg-pink-100 dark:bg-pink-900/30' },
]

const steps = [
  { title: 'Create your company profile', desc: 'Sign up free and set up your company profile in minutes. No credit card needed.' },
  { title: 'Post your job listing',       desc: 'Fill in the job details — title, requirements, salary range, and publish instantly.' },
  { title: 'Review and hire',             desc: 'Manage all applications in your dashboard and move the best candidates forward.' },
]
</script>
