import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API methods
export const api = {
  // Exercises
  exercises: {
    getAll: (params) => apiClient.get('/exercises', { params }),
    getOne: (id) => apiClient.get(`/exercises/${id}`),
    create: (data) => apiClient.post('/exercises', data),
    update: (id, data) => apiClient.put(`/exercises/${id}`, data),
    delete: (id) => apiClient.delete(`/exercises/${id}`)
  },

  // Sessions
  sessions: {
    getAll: (params) => apiClient.get('/sessions', { params }),
    getOne: (id) => apiClient.get(`/sessions/${id}`),
    create: (data) => apiClient.post('/sessions', data),
    update: (id, data) => apiClient.put(`/sessions/${id}`, data),
    delete: (id) => apiClient.delete(`/sessions/${id}`),
    duplicate: (id, data) => apiClient.post(`/sessions/${id}/duplicate`, data)
  },

  // Training
  training: {
    start: (sessionId) => apiClient.post(`/training/start/${sessionId}`),
    completeExercise: (exerciseId, data) => apiClient.post(`/training/exercise/${exerciseId}/complete`, data),
    complete: (sessionId) => apiClient.post(`/training/complete/${sessionId}`),
    history: (sessionId) => apiClient.get(`/training/history/${sessionId}`)
  },

  // Stats
  stats: {
    getAll: () => apiClient.get('/stats'),
    getByPeriod: (params) => apiClient.get('/stats/period', { params })
  },

  // Health check
  health: () => apiClient.get('/health')
}

export default apiClient