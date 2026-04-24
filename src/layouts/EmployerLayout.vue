<template>
  <div class="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950">
    <!-- Employer Navbar - different accent (green) -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-emp-100 dark:border-surface-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/employers" class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emp-500 to-emp-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emp-500/30 group-hover:scale-105 transition-transform">H</div>
            <span class="font-bold text-xl text-surface-900 dark:text-white">Hiring<span class="text-emp-600 dark:text-emp-400">Zone</span></span>
            <span class="hidden sm:inline text-xs font-semibold bg-emp-100 dark:bg-emp-900/40 text-emp-700 dark:text-emp-300 px-2 py-0.5 rounded-full">for Employers</span>
          </RouterLink>

          <!-- Nav -->
          <nav class="hidden md:flex items-center gap-6">
            <template v-if="employerAuth.isAuthenticated">
              <RouterLink to="/employers/dashboard" :class="navLinkClass" active-class="!text-emp-600 dark:!text-emp-400">Dashboard</RouterLink>
              <RouterLink to="/employers/jobs" :class="navLinkClass" active-class="!text-emp-600 dark:!text-emp-400">Manage Jobs</RouterLink>
              <RouterLink to="/employers/post-job" :class="navLinkClass" active-class="!text-emp-600 dark:!text-emp-400">Post a Job</RouterLink>
            </template>
            <template v-else>
              <a href="#features" :class="navLinkClass">Features</a>
              <a href="#pricing" :class="navLinkClass">Pricing</a>
            </template>
          </nav>

          <div class="flex items-center gap-3">
            <!-- Dark mode -->
            <button @click="darkMode.toggle()" id="employer-dark-toggle" class="p-2 rounded-lg text-surface-500 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
              <svg v-if="darkMode.isDark.value" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </button>

            <template v-if="employerAuth.isAuthenticated">
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emp-50 dark:bg-emp-900/20 border border-emp-200 dark:border-emp-800">
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-emp-400 to-emp-600 flex items-center justify-center text-white text-xs font-bold">
                  {{ (employerAuth.employer?.companyName || 'E')[0].toUpperCase() }}
                </div>
                <span class="text-sm font-medium text-surface-800 dark:text-surface-200 hidden sm:block">{{ employerAuth.employer?.companyName || 'Company' }}</span>
              </div>
              <Button accent="green" size="sm" outline @click="handleLogout" id="employer-logout-btn">Sign Out</Button>
            </template>
            <template v-else>
              <RouterLink to="/employers/login" class="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-emp-600 dark:hover:text-emp-400 transition-colors px-2">Sign In</RouterLink>
              <RouterLink to="/employers/register" id="employer-register-btn">
                <Button accent="green" size="sm">Post a Job Free</Button>
              </RouterLink>
            </template>

            <button @click="mobileOpen=!mobileOpen" class="md:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
              <svg class="w-5 h-5 text-surface-600 dark:text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <Transition name="slide-down">
          <nav v-if="mobileOpen" class="md:hidden py-4 border-t border-surface-200 dark:border-surface-700 flex flex-col gap-1">
            <template v-if="employerAuth.isAuthenticated">
              <RouterLink to="/employers/dashboard" @click="mobileOpen=false" class="mobile-nav-link">Dashboard</RouterLink>
              <RouterLink to="/employers/jobs" @click="mobileOpen=false" class="mobile-nav-link">Manage Jobs</RouterLink>
              <RouterLink to="/employers/post-job" @click="mobileOpen=false" class="mobile-nav-link">Post a Job</RouterLink>
              <button @click="handleLogout" class="mobile-nav-link text-left text-red-500">Sign Out</button>
            </template>
            <template v-else>
              <RouterLink to="/employers/login" @click="mobileOpen=false" class="mobile-nav-link">Sign In</RouterLink>
              <RouterLink to="/employers/register" @click="mobileOpen=false" class="mobile-nav-link">Get Started Free</RouterLink>
            </template>
          </nav>
        </Transition>
      </div>
    </header>

    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Employer Footer -->
    <footer class="bg-surface-900 dark:bg-surface-950 text-surface-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emp-500 to-emp-700 flex items-center justify-center text-white font-bold text-sm">H</div>
              <span class="font-bold text-lg text-white">HiringZone <span class="text-emp-400 text-sm font-normal">for Employers</span></span>
            </div>
            <p class="text-sm">Hire smarter. Reach thousands of qualified candidates instantly — always free.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Product</h4>
            <ul class="space-y-2 text-sm">
              <li><RouterLink to="/employers" class="hover:text-white transition-colors">Home</RouterLink></li>
              <li><RouterLink to="/employers/register" class="hover:text-white transition-colors">Start Hiring</RouterLink></li>
              <li><RouterLink to="/employers/dashboard" class="hover:text-white transition-colors">Dashboard</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Support</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-surface-700 pt-6 text-xs">
          <p>© {{ new Date().getFullYear() }} HiringZone for Employers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useEmployerAuthStore } from '@/stores/employerAuth'
import { useToastStore } from '@/stores/toast'
import { useDarkMode } from '@/composables/useDarkMode'
import Button from '@/components/shared/Button.vue'

const employerAuth = useEmployerAuthStore()
const toast        = useToastStore()
const router       = useRouter()
const darkMode     = useDarkMode()
const mobileOpen   = ref(false)

const navLinkClass = 'text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-emp-600 dark:hover:text-emp-400 transition-colors'

function handleLogout() {
  employerAuth.logout()
  mobileOpen.value = false
  toast.success('Signed out successfully')
  router.push('/employers')
}
</script>

<style scoped>
@reference "@/style.css";

.mobile-nav-link { @apply px-3 py-2.5 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all; }
.slide-down-enter-active { animation: slideDown 0.2s ease; }
.slide-down-leave-active { animation: slideDown 0.2s ease reverse; }
@keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
