import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { employerApi } from '@/api/employer'

export const useEmployerAuthStore = defineStore('employerAuth', () => {
  const token   = ref(localStorage.getItem('employer_token') || null)
  const employer = ref(JSON.parse(localStorage.getItem('employer_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const res = await employerApi.post('/employer/auth/login', { email, password })
    token.value   = res.data.token
    employer.value = res.data.employer
    localStorage.setItem('employer_token', token.value)
    localStorage.setItem('employer_user', JSON.stringify(employer.value))
    return res.data
  }

  async function register(payload) {
    const res = await employerApi.post('/employer/auth/register', payload)
    token.value   = res.data.token
    employer.value = res.data.employer
    localStorage.setItem('employer_token', token.value)
    localStorage.setItem('employer_user', JSON.stringify(employer.value))
    return res.data
  }

  function logout() {
    token.value   = null
    employer.value = null
    localStorage.removeItem('employer_token')
    localStorage.removeItem('employer_user')
  }

  return { token, employer, isAuthenticated, login, register, logout }
})
