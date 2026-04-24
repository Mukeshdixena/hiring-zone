import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { seekerApi } from '@/api/seeker'

export const useSeekerAuthStore = defineStore('seekerAuth', () => {
  const token = ref(localStorage.getItem('seeker_token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('seeker_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const res = await seekerApi.post('/auth/login', { email, password })
    token.value = res.data.token
    user.value  = res.data.user
    localStorage.setItem('seeker_token', token.value)
    localStorage.setItem('seeker_user', JSON.stringify(user.value))
    return res.data
  }

  async function register(payload) {
    const res = await seekerApi.post('/auth/register', payload)
    token.value = res.data.token
    user.value  = res.data.user
    localStorage.setItem('seeker_token', token.value)
    localStorage.setItem('seeker_user', JSON.stringify(user.value))
    return res.data
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('seeker_token')
    localStorage.removeItem('seeker_user')
  }

  return { token, user, isAuthenticated, login, register, logout }
})
