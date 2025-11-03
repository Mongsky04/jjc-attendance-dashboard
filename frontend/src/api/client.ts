import axios from 'axios'
import { mockApi } from './mockApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const DEMO_MODE = import.meta.env.VITE_API_URL === 'DEMO_MODE' || import.meta.env.VITE_DEMO_MODE === 'true'

// Use mock API if in demo mode
export const apiClient = DEMO_MODE ? mockApi : {
  async post(endpoint: string, data: any) {
    const response = await api.post(endpoint, data)
    return response.data
  },
  async get(endpoint: string) {
    const response = await api.get(endpoint)
    return response.data
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    console.error('API Error:', message)
    return Promise.reject(new Error(message))
  }
)