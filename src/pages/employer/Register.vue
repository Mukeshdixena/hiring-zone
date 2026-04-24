<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-surface-50 to-emp-50 dark:from-surface-950 dark:to-surface-900">
    <div class="w-full max-w-lg">
      <div class="card p-8 shadow-2xl">
        <div class="text-center mb-8">
          <RouterLink to="/employers" class="inline-flex items-center gap-2 mb-6">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emp-500 to-emp-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emp-500/30">H</div>
            <span class="font-bold text-xl text-surface-900 dark:text-white">Hiring<span class="text-emp-600 dark:text-emp-400">Zone</span> <span class="text-sm font-normal text-surface-500">for Employers</span></span>
          </RouterLink>
          <h1 class="text-2xl font-black text-surface-900 dark:text-white">Create Employer Account</h1>
          <p class="text-surface-500 text-sm mt-1">Free forever — start posting jobs in minutes</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="emp-reg-firstname" v-model="form.firstName" label="First Name" placeholder="Jane" :error="errors.firstName" required/>
            <Input id="emp-reg-lastname" v-model="form.lastName" label="Last Name" placeholder="Smith" :error="errors.lastName" required/>
          </div>
          <Input id="emp-reg-company" v-model="form.companyName" label="Company Name" placeholder="Acme Corp" :error="errors.companyName" required/>
          <Input id="emp-reg-email" v-model="form.email" label="Work Email" type="email" placeholder="hr@company.com" :error="errors.email" required/>
          <Input id="emp-reg-password" v-model="form.password" label="Password" :type="showPw ? 'text' : 'password'" placeholder="Min 8 characters" :error="errors.password" required/>
          <Input id="emp-reg-confirm" v-model="form.confirmPassword" label="Confirm Password" :type="showPw ? 'text' : 'password'" placeholder="Re-enter password" :error="errors.confirmPassword" required/>

          <div>
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Industry</label>
            <select id="emp-reg-industry" v-model="form.industry" class="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm px-4 py-2.5 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-emp-500/40">
              <option value="">Select industry</option>
              <option v-for="ind in industries" :key="ind">{{ ind }}</option>
            </select>
          </div>

          <div v-if="errors.general" class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">{{ errors.general }}</div>
          <Button type="submit" accent="green" size="lg" full :loading="loading" id="emp-register-submit">Create Account — Free</Button>
        </form>

        <p class="text-center text-sm text-surface-500 mt-6">
          Already have an account?
          <RouterLink to="/employers/login" class="text-emp-600 dark:text-emp-400 font-semibold hover:underline">Sign in</RouterLink>
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
const form    = ref({ firstName:'', lastName:'', companyName:'', email:'', password:'', confirmPassword:'', industry:'' })
const errors  = ref({})

const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Education', 'Manufacturing', 'Marketing', 'Consulting', 'Media', 'Other']

async function handleRegister() {
  errors.value = {}
  if (!form.value.firstName)   { errors.value.firstName = 'Required'; return }
  if (!form.value.lastName)    { errors.value.lastName  = 'Required'; return }
  if (!form.value.companyName) { errors.value.companyName = 'Required'; return }
  if (!form.value.email)       { errors.value.email     = 'Required'; return }
  if (form.value.password.length < 8) { errors.value.password = 'Min 8 characters'; return }
  if (form.value.password !== form.value.confirmPassword) { errors.value.confirmPassword = 'Passwords do not match'; return }

  loading.value = true
  try {
    await employerAuth.register({
      name: `${form.value.firstName} ${form.value.lastName}`,
      companyName: form.value.companyName,
      email: form.value.email,
      password: form.value.password,
      industry: form.value.industry,
    })
    toast.success('Account created! Welcome to HiringZone for Employers 🎉')
    router.push('/employers/dashboard')
  } catch (e) { errors.value.general = e.response?.data?.message || 'Registration failed' }
  finally      { loading.value = false }
}
</script>
