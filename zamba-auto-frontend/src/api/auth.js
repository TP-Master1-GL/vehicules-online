import axios from 'axios'

// Créer l'instance axios avec le proxy Vite
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
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

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Export par défaut de l'instance api
export default api

// Export nommé des fonctions d'auth
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur de connexion',
        status: error.response?.status
      }
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || "Erreur d'inscription",
        status: error.response?.status
      }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur de mise à jour',
        status: error.response?.status
      }
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify')
      return response.data.valid
    } catch (error) {
      return false
    }
  }
}