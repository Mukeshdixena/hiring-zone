<template>
  <div class="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              H
            </div>
            <span class="font-bold text-xl text-surface-900 dark:text-white">Hiring<span class="text-brand-500">Zone</span></span>
          </RouterLink>

          <!-- Nav Links (desktop) -->
          <nav class="hidden md:flex items-center gap-6">
            <RouterLink to="/jobs" :class="navLinkClass" active-class="!text-brand-600 dark:!text-brand-400">Browse Jobs</RouterLink>
            <template v-if="seekerAuth.isAuthenticated">
              <RouterLink to="/dashboard" :class="navLinkClass" active-class="!text-brand-600 dark:!text-brand-400">Dashboard</RouterLink>
              <RouterLink to="/applications" :class="navLinkClass" active-class="!text-brand-600 dark:!text-brand-400">My Applications</RouterLink>
            </template>
          </nav>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">
            <!-- Dark mode toggle -->
            <button @click="darkMode.toggle()" :id="'seeker-dark-toggle'" class="p-2 rounded-lg text-surface-500 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
              <svg v-if="darkMode.isDark.value" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </button>

            <template v-if="seekerAuth.isAuthenticated">
              <div class="relative" ref="profileRef">
                <button @click="profileOpen = !profileOpen" id="seeker-profile-menu" class="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
                    {{ (seekerAuth.user?.name || 'U')[0].toUpperCase() }}
                  </div>
                  <svg class="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div v-if="profileOpen" class="absolute right-0 top-full mt-2 w-48 card shadow-xl py-1 z-50">
                  <RouterLink to="/dashboard" @click="profileOpen=false" class="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">Dashboard</RouterLink>
                  <RouterLink to="/applications" @click="profileOpen=false" class="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">My Applications</RouterLink>
                  <div class="border-t border-surface-200 dark:border-surface-700 my-1"/>
                  <button @click="handleLogout" id="seeker-logout-btn" class="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Sign Out</button>
                </div>
              </div>
            </template>
            <template v-else>
              <RouterLink to="/login" class="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors px-2">Sign In</RouterLink>
              <RouterLink to="/register" id="seeker-register-btn">
                <Button accent="blue" size="sm">Get Started</Button>
              </RouterLink>
            </template>

            <!-- Mobile menu toggle -->
            <button @click="mobileOpen=!mobileOpen" class="md:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
              <svg class="w-5 h-5 text-surface-600 dark:text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <Transition name="slide-down">
          <nav v-if="mobileOpen" class="md:hidden py-4 border-t border-surface-200 dark:border-surface-700 flex flex-col gap-1">
            <RouterLink to="/jobs" @click="mobileOpen=false" class="mobile-nav-link">Browse Jobs</RouterLink>
            <template v-if="seekerAuth.isAuthenticated">
              <RouterLink to="/dashboard" @click="mobileOpen=false" class="mobile-nav-link">Dashboard</RouterLink>
              <RouterLink to="/applications" @click="mobileOpen=false" class="mobile-nav-link">My Applications</RouterLink>
              <button @click="handleLogout" class="mobile-nav-link text-left text-red-500">Sign Out</button>
            </template>
            <template v-else>
              <RouterLink to="/login" @click="mobileOpen=false" class="mobile-nav-link">Sign In</RouterLink>
              <RouterLink to="/register" @click="mobileOpen=false" class="mobile-nav-link">Create Account</RouterLink>
            </template>
          </nav>
        </Transition>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer class="bg-surface-900 dark:bg-surface-950 text-surface-400 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">H</div>
              <span class="font-bold text-xl text-white">Hiring<span class="text-brand-400">Zone</span></span>
            </div>
            <p class="text-sm leading-relaxed max-w-xs">Find your dream job with thousands of opportunities from top companies worldwide.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Job Seekers</h4>
            <ul class="space-y-2 text-sm">
              <li><RouterLink to="/jobs" class="hover:text-white transition-colors">Browse Jobs</RouterLink></li>
              <li><RouterLink to="/register" class="hover:text-white transition-colors">Create Account</RouterLink></li>
              <li><RouterLink to="/dashboard" class="hover:text-white transition-colors">Dashboard</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Support</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-surface-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-xs">© {{ new Date().getFullYear() }} HiringZone. All rights reserved.</p>
          <p class="text-xs"><a href="/employers" class="hover:text-surface-300 transition-colors">For Employers</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useSeekerAuthStore } from '@/stores/seekerAuth'
import { useToastStore } from '@/stores/toast'
import { useDarkMode } from '@/composables/useDarkMode'
import Button from '@/components/shared/Button.vue'

const seekerAuth = useSeekerAuthStore()
const toast      = useToastStore()
const router     = useRouter()
const darkMode   = useDarkMode()

const mobileOpen = ref(false)
const profileOpen = ref(false)

const navLinkClass = 'text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors'

function handleLogout() {
  seekerAuth.logout()
  profileOpen.value = false
  mobileOpen.value  = false
  toast.success('Signed out successfully')
  router.push('/')
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
