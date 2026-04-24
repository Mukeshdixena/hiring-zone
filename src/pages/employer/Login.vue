<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-surface-50 to-emp-50 dark:from-surface-950 dark:to-surface-900">
    <div class="w-full max-w-md">
      <div class="card p-8 shadow-2xl">
        <div class="text-center mb-8">
          <RouterLink to="/employers" class="inline-flex items-center gap-2 mb-6">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emp-500 to-emp-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emp-500/30">H</div>
            <span class="font-bold text-xl text-surface-900 dark:text-white">Hiring<span class="text-emp-600 dark:text-emp-400">Zone</span> <span class="text-sm font-normal text-surface-500">for Employers</span></span>
          </RouterLink>
          <h1 class="text-2xl font-black text-surface-900 dark:text-white">Employer Sign In</h1>
          <p class="text-surface-500 text-sm mt-1">Access your hiring dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <Input id="emp-login-email" v-model="form.email" label="Company Email" type="email" placeholder="hr@company.com" :error="errors.email" required/>
          <Input id="emp-login-password" v-model="form.password" label="Password" :type="showPw ? 'text' : 'password'" placeholder="••••••••" :error="errors.password" required>
            <template #suffix>
              <button type="button" @click="showPw=!showPw" class="text-surface-400 hover:text-emp-600 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </template>
          </Input>
          <div v-if="errors.general" class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">{{ errors.general }}</div>
          <Button type="submit" accent="green" size="lg" full :loading="loading" id="emp-login-submit">Sign In</Button>
        </form>

        <p class="text-center text-sm text-surface-500 mt-6">
          Don't have an employer account?
          <RouterLink to="/employers/register" class="text-emp-600 dark:text-emp-400 font-semibold hover:underline">Register free</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useEmployerAuthStore } from '@/stores/employerAuth'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/shared/Button.vue'
import Input from '@/components/shared/Input.vue'

const router       = useRouter()
const employerAuth = useEmployerAuthStore()
const toast        = useToastStore()
const loading = ref(false); const showPw = ref(false)
const form    = ref({ email: '', password: '' })
const errors  = ref({})

async function handleLogin() {
  errors.value = {}
  if (!form.value.email)    { errors.value.email    = 'Required'; return }
  if (!form.value.password) { errors.value.password = 'Required'; return }
  loading.value = true
  try {
    await employerAuth.login(form.value.email, form.value.password)
    toast.success('Welcome back! 🎉')
    router.push('/employers/dashboard')
  } catch (e) { errors.value.general = e.response?.data?.message || 'Invalid credentials' }
  finally      { loading.value = false }
}
</script>
