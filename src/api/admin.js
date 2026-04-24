import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:9090/api'

export const adminApi = axios.create({ baseURL: BASE })

adminApi.interceptors.request.use(cfg => {
  const token = localStorage.getItem('admin_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

adminApi.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)
