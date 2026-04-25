import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/api/admin'

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = ref(localStorage.getItem('admin_token') || null)
  const admin = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const res = await adminApi.post('/auth/admin/login', { email, password })
    token.value = res.data.token
    admin.value = res.data.admin
    localStorage.setItem('admin_token', token.value)
    localStorage.setItem('admin_user', JSON.stringify(admin.value))
    return res.data
  }

  function logout() {
    token.value = null
    admin.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  return { token, admin, isAuthenticated, login, logout }
})
