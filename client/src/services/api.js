import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Optionally redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// --- Auth ---
export const login = (credentials) => api.post('/auth/login', credentials)
export const signup = (credentials) => api.post('/auth/signup', credentials)
export const getMe = () => api.get('/auth/me')

// --- Notes ---
export const getNotes = () => api.get('/notes')
export const searchNotes = (query) => api.get(`/notes/search?q=${encodeURIComponent(query)}`)
export const getNote = (id) => api.get(`/notes/${id}`)
export const createNote = (data) => api.post('/notes', data)
export const updateNote = (id, data) => api.put(`/notes/${id}`, data)
export const deleteNote = (id) => api.delete(`/notes/${id}`)
export const togglePin = (id) => api.patch(`/notes/${id}/pin`)

// --- PDF Upload ---
export const uploadPdf = (formData) =>
  api.post('/pdf/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// --- AI Features ---
export const summarizeNote = (noteId) => api.post('/ai/summarize-and-save', { noteId })
export const generateTags = (noteId) => api.post('/ai/tags-and-save', { noteId })
export const summarizeText = (content) => api.post('/ai/summarize', { content })
export const generateTagsFromText = (content) => api.post('/ai/tags', { content })

export default api
