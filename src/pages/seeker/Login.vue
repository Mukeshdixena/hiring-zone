<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-surface-50 to-brand-50 dark:from-surface-950 dark:to-surface-900">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="card p-8 shadow-2xl">
        <!-- Logo -->
        <div class="text-center mb-8">
          <RouterLink to="/" class="inline-flex items-center gap-2 mb-6">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30">H</div>
            <span class="font-bold text-xl text-surface-900 dark:text-white">Hiring<span class="text-brand-500">Zone</span></span>
          </RouterLink>
          <h1 class="text-2xl font-black text-surface-900 dark:text-white">Welcome back</h1>
          <p class="text-surface-500 text-sm mt-1">Sign in to your account to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <Input id="login-email" v-model="form.email" label="Email address" type="email" placeholder="you@example.com" :error="errors.email" required/>
          <div>
            <Input id="login-password" v-model="form.password" label="Password" :type="showPw ? 'text' : 'password'" placeholder="••••••••" :error="errors.password" required>
              <template #suffix>
                <button type="button" @click="showPw=!showPw" class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors">
                  <svg v-if="showPw" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
              </template>
            </Input>
          </div>

          <div v-if="errors.general" class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">{{ errors.general }}</div>

          <Button type="submit" accent="blue" size="lg" full :loading="loading" id="seeker-login-submit">Sign In</Button>
        </form>

        <p class="text-center text-sm text-surface-500 mt-6">
          Don't have an account?
          <RouterLink to="/register" class="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Create one free</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useSeekerAuthStore } from '@/stores/seekerAuth'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/shared/Button.vue'
import Input from '@/components/shared/Input.vue'

const router     = useRouter()
const seekerAuth = useSeekerAuthStore()
const toast      = useToastStore()

const loading = ref(false)
const showPw  = ref(false)
const form    = ref({ email: '', password: '' })
const errors  = ref({})

async function handleLogin() {
  errors.value = {}
  if (!form.value.email)    { errors.value.email    = 'Email is required'; return }
  if (!form.value.password) { errors.value.password = 'Password is required'; return }

  loading.value = true
  try {
    await seekerAuth.login(form.value.email, form.value.password)
    toast.success('Welcome back! 👋')
    const redirect = new URLSearchParams(window.location.search).get('redirect')
    router.push(redirect || '/dashboard')
  } catch (e) {
    errors.value.general = e.response?.data?.message || 'Invalid email or password'
  } finally { loading.value = false }
}
</script>
