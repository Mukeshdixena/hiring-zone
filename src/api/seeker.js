import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'https://hiring-zone-backend.onrender.com/api'
const APP_BASE = import.meta.env.BASE_URL

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
      window.location.href = `${APP_BASE}login`
    }
    return Promise.reject(err)
  }
)
