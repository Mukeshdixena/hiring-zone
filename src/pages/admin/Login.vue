<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-surface-950">
    <div class="w-full max-w-md">
      <div class="bg-surface-900 border border-surface-700 rounded-3xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-adm-500 to-adm-700 flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-xl shadow-adm-500/30">H</div>
          <h1 class="text-2xl font-black text-white">Admin Access</h1>
          <p class="text-surface-400 text-sm mt-1">Internal control center — authorized personnel only</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-surface-300 mb-1.5 block">Admin Email</label>
            <input id="admin-login-email" v-model="form.email" type="email" placeholder="admin@hiringzone.com" class="w-full rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-adm-500/40 focus:border-adm-500 transition-all" required/>
          </div>
          <div>
            <label class="text-sm font-medium text-surface-300 mb-1.5 block">Password</label>
            <input id="admin-login-password" v-model="form.password" :type="showPw ? 'text' : 'password'" placeholder="••••••••" class="w-full rounded-xl border border-surface-700 bg-surface-800 text-white placeholder-surface-500 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-adm-500/40 focus:border-adm-500 transition-all" required/>
          </div>

          <div v-if="error" class="rounded-xl bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-400">{{ error }}</div>

          <button type="submit" id="admin-login-submit" :disabled="loading" class="w-full inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-3 text-sm bg-adm-600 hover:bg-adm-700 text-white shadow-lg shadow-adm-600/30 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
            <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            {{ loading ? 'Authenticating…' : 'Access Admin Panel' }}
          </button>
        </form>

        <p class="text-center text-xs text-surface-600 mt-8">This portal is for authorized administrators only. Unauthorized access attempts are logged.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuthStore } from '@/stores/adminAuth'
import { useToastStore } from '@/stores/toast'

const router    = useRouter()
const adminAuth = useAdminAuthStore()
const toast     = useToastStore()

const loading = ref(false); const showPw = ref(false)
const form    = ref({ email: '', password: '' })
const error   = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await adminAuth.login(form.value.email, form.value.password)
    toast.success('Admin access granted')
    router.push('/admin')
  } catch (e) { error.value = e.response?.data?.message || 'Invalid admin credentials' }
  finally      { loading.value = false }
}
</script>
