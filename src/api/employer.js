import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'https://hiring-zone-backend.onrender.com/api'
const APP_BASE = import.meta.env.BASE_URL

export const employerApi = axios.create({ baseURL: BASE })

employerApi.interceptors.request.use(cfg => {
  const token = localStorage.getItem('employer_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

employerApi.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('employer_token')
      localStorage.removeItem('employer_user')
      window.location.href = `${APP_BASE}employers/login`
    }
    return Promise.reject(err)
  }
)
