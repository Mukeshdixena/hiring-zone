<template>
  <div class="min-h-screen flex bg-surface-950">
    <!-- Admin Sidebar -->
    <aside :class="['flex flex-col bg-surface-900 border-r border-surface-800 transition-all duration-300 flex-shrink-0', sidebarOpen ? 'w-64' : 'w-16']">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-surface-800">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-adm-500 to-adm-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-adm-500/30">H</div>
        <Transition name="fade-x">
          <span v-if="sidebarOpen" class="font-bold text-white whitespace-nowrap">Admin <span class="text-adm-400">Panel</span></span>
        </Transition>
      </div>

      <!-- Nav items -->
      <nav class="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        <AdminNavItem v-for="item in navItems" :key="item.name" :item="item" :collapsed="!sidebarOpen" />
      </nav>

      <!-- Bottom actions -->
      <div class="px-2 py-4 border-t border-surface-800 flex flex-col gap-1">
        <button @click="darkMode.toggle()" id="admin-dark-toggle" :class="['flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition-all w-full', !sidebarOpen ? 'justify-center' : '']">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path v-if="darkMode.isDark.value" stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
          <span v-if="sidebarOpen" class="text-sm">{{ darkMode.isDark.value ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
        <button @click="handleLogout" id="admin-logout-btn" :class="['flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all w-full', !sidebarOpen ? 'justify-center' : '']">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span v-if="sidebarOpen" class="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="bg-surface-900 border-b border-surface-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <button @click="sidebarOpen=!sidebarOpen" id="admin-sidebar-toggle" class="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-sm text-surface-400">
            <div class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"/>
            <span>{{ adminAuth.admin?.email || 'Admin' }}</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-adm-400 to-adm-600 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto bg-surface-950 p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAdminAuthStore } from '@/stores/adminAuth'
import { useToastStore } from '@/stores/toast'
import { useDarkMode } from '@/composables/useDarkMode'

const adminAuth  = useAdminAuthStore()
const toast      = useToastStore()
const router     = useRouter()
const darkMode   = useDarkMode()
const sidebarOpen = ref(true)

function handleLogout() {
  adminAuth.logout()
  toast.success('Admin signed out')
  router.push('/admin/login')
}

const navItems = [
  { name: 'Dashboard',      to: '/admin',              icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Users',          to: '/admin/users',        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Providers',      to: '/admin/providers',    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { name: 'Role Management', to: '/admin/roles',       icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: 'Job Moderation', to: '/admin/jobs',         icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { name: 'Announcements',  to: '/admin/announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
]

// Inline nav item component
const AdminNavItem = defineComponent({
  props: { item: Object, collapsed: Boolean },
  setup(props) {
    return () => {
      const { item, collapsed } = props
      return h(RouterLink, {
        to: item.to,
        class: ({ isActive }) => [
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
          isActive
            ? 'bg-adm-600/20 text-adm-400 border border-adm-700/40'
            : 'text-surface-400 hover:text-white hover:bg-surface-800',
          collapsed ? 'justify-center' : '',
        ].join(' '),
      }, () => [
        h('svg', { class: 'w-5 h-5 flex-shrink-0', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.8' },
          [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: item.icon })]
        ),
        !collapsed && h('span', { class: 'whitespace-nowrap' }, item.name),
      ])
    }
  }
})
import { h } from 'vue'
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-x-enter-active, .fade-x-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-x-enter-from, .fade-x-leave-to { opacity: 0; transform: translateX(-6px); }
</style>
