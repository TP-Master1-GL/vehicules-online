import axios from 'axios'

// Créer l'instance axios avec le proxy Vite
const api = axios.create({
  baseURL: '/api', // Le proxy Vite redirigera vers http://localhost:8080
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token ET LOGGER LES REQUÊTES
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // LOGS DE DÉBUG - Très important pour voir ce qui se passe
    console.log('🚀 [AXIOS REQUEST] Envoi requête:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      hasToken: !!token,
      data: config.data ? JSON.parse(JSON.stringify(config.data)) : null
    })
    
    return config
  },
  (error) => {
    console.error('❌ [AXIOS REQUEST] Erreur lors de la préparation de la requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les réponses AVEC LOGS
api.interceptors.response.use(
  (response) => {
    console.log('✅ [AXIOS RESPONSE] Réponse reçue:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      baseURL: response.config.baseURL,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ [AXIOS RESPONSE] Erreur de réponse:', {
      url: error.config?.url,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        baseURL: error.config?.baseURL,
        url: error.config?.url
      }
    })
    
    if (error.response?.status === 401) {
      console.log('🔐 [AUTH] Token expiré ou invalide, déconnexion...')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('refreshToken')
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
      console.log('🔐 [AUTH] Tentative de connexion avec email:', email)
      const response = await api.post('/auth/login', { email, password })
      
      console.log('✅ [AUTH] Connexion réussie:', response.data)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        
        // Stocker les données utilisateur
        const userData = {
          id: response.data.id,
          email: response.data.email,
          nom: response.data.nom,
          prenom: response.data.prenom,
          role: response.data.role || 'USER',
          customerType: response.data.customerType || 'individual',
          telephone: response.data.telephone
        }
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('💾 [AUTH] Utilisateur stocké:', userData)
      }
      
      return response.data
    } catch (error) {
      console.error('❌ [AUTH] Erreur de connexion:', error)
      throw {
        message: error.response?.data?.message || 'Erreur de connexion au serveur',
        status: error.response?.status,
        details: error.response?.data
      }
    }
  },

  register: async (userData) => {
    try {
      console.log('📝 [AUTH] Tentative d\'inscription:', userData.email)
      const response = await api.post('/auth/register', userData)
      console.log('✅ [AUTH] Inscription réussie:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [AUTH] Erreur d\'inscription:', error)
      throw {
        message: error.response?.data?.message || "Erreur lors de l'inscription",
        status: error.response?.status,
        details: error.response?.data
      }
    }
  },

  logout: () => {
    console.log('👋 [AUTH] Déconnexion')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        console.log('👤 [AUTH] Utilisateur courant récupéré:', user)
        return user
      } catch (e) {
        console.error('❌ [AUTH] Erreur parsing user:', e)
        return null
      }
    }
    console.log('👤 [AUTH] Aucun utilisateur connecté')
    return null
  },

  updateProfile: async (userData) => {
    try {
      console.log('✏️ [AUTH] Mise à jour profil:', userData)
      const response = await api.put('/auth/profile', userData)
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        console.log('✅ [AUTH] Profil mis à jour:', response.data.user)
      }
      
      return response.data
    } catch (error) {
      console.error('❌ [AUTH] Erreur mise à jour profil:', error)
      throw {
        message: error.response?.data?.message || 'Erreur lors de la mise à jour du profil',
        status: error.response?.status,
        details: error.response?.data
      }
    }
  },

  verifyToken: async () => {
    try {
      console.log('🔍 [AUTH] Vérification du token...')
      const response = await api.get('/auth/verify')
      console.log('✅ [AUTH] Token valide:', response.data.valid)
      return response.data.valid
    } catch (error) {
      console.error('❌ [AUTH] Token invalide:', error)
      return false
    }
  },

  // Fonction utilitaire pour tester la connexion au backend
  testConnection: async () => {
    try {
      console.log('🔗 [TEST] Test de connexion au backend...')
      const response = await api.get('/auth/test') // Vous devez créer cet endpoint dans votre backend
      console.log('✅ [TEST] Connexion réussie:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [TEST] Échec de connexion:', error)
      throw {
        message: 'Impossible de se connecter au serveur',
        status: error.response?.status,
        details: error
      }
    }
  },

  // Fonction pour rafraîchir le token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible')
      }
      
      console.log('🔄 [AUTH] Rafraîchissement du token...')
      const response = await api.post('/auth/refresh', { refreshToken })
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        console.log('✅ [AUTH] Token rafraîchi avec succès')
        return response.data.token
      }
    } catch (error) {
      console.error('❌ [AUTH] Erreur rafraîchissement token:', error)
      authService.logout()
      throw error
    }
  }
}

// Fonction utilitaire pour vérifier si l'utilisateur a un rôle spécifique
export const hasRole = (requiredRole) => {
  const user = authService.getCurrentUser()
  if (!user || !user.role) return false
  
  // Hiérarchie des rôles
  const roleHierarchy = {
    'USER': 1,
    'MANAGER': 2,
    'ADMIN': 3
  }
  
  const userRoleLevel = roleHierarchy[user.role.toUpperCase()] || 0
  const requiredRoleLevel = roleHierarchy[requiredRole.toUpperCase()] || 0
  
  return userRoleLevel >= requiredRoleLevel
}

// Fonction utilitaire pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  const user = authService.getCurrentUser()
  
  const authenticated = !!(token && user)
  console.log('🔐 [AUTH] Authentifié?', authenticated, { hasToken: !!token, hasUser: !!user })
  return authenticated
}

// Fonction pour nettoyer le localStorage (utile pour le développement)
export const clearStorage = () => {
  console.log('🧹 [UTIL] Nettoyage du localStorage')
  localStorage.clear()
  sessionStorage.clear()
}