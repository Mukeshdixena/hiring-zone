import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { employerApi } from '@/api/employer'

export const useEmployerAuthStore = defineStore('employerAuth', () => {
  const token   = ref(localStorage.getItem('employer_token') || null)
  const employer = ref(null)
  try {
    const stored = localStorage.getItem('employer_user')
    if (stored && stored !== 'undefined') {
      employer.value = JSON.parse(stored)
    }
  } catch (e) {
    localStorage.removeItem('employer_user')
  }

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const res = await employerApi.post('/auth/employer/login', { email, password })
    token.value   = res.data.token
    employer.value = res.data.user
    localStorage.setItem('employer_token', token.value)
    localStorage.setItem('employer_user', JSON.stringify(employer.value || null))
    return res.data
  }

  async function register(payload) {
    const res = await employerApi.post('/auth/employer/register', payload)
    token.value   = res.data.token
    employer.value = res.data.user
    localStorage.setItem('employer_token', token.value)
    localStorage.setItem('employer_user', JSON.stringify(employer.value || null))
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
