import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:9090/api'

export const seekerApi = axios.create({ baseURL: BASE })

seekerApi.interceptors.request.use(cfg => {
  const token = localStorage.getItem('seeker_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

seekerApi.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('seeker_token')
      localStorage.removeItem('seeker_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
