import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../api/auth'
import toast from 'react-hot-toast'

// 1. Créer le contexte ET l'exporter
export const AuthContext = createContext()

// 2. Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

// 3. Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser)
        // Vérifier que les données utilisateur sont valides
        if (userData && userData.email) {
          // Debug: afficher le rôle pour vérification
          console.log('🔐 CheckAuth - User data:', userData)
          console.log('🔐 CheckAuth - Role:', userData.role, 'Type:', typeof userData.role)
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          // Données invalides, nettoyer
          logout()
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)

      // Le backend retourne directement les données dans response.data
      // Le rôle peut être une string ou un enum, on le normalise en string
      const userData = {
        id: response.id,
        email: response.email,
        nom: response.nom,
        prenom: response.prenom,
        customerType: response.customerType || 'individual',
        role: typeof response.role === 'string' ? response.role : (response.role?.name?.() || String(response.role)), // 'ADMIN', 'MANAGER', 'USER'
        company_id: response.company_id,
        telephone: response.telephone
      }

      // Debug: afficher le rôle pour vérification
      console.log('🔐 Login successful - User data:', userData)
      console.log('🔐 Role:', userData.role, 'Type:', typeof userData.role)

      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)
      setIsAuthenticated(true)

      toast.success('Connexion réussie !')
      return { ...response, user: userData }
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)

      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      return response
    } catch (error) {
      toast.error(error.message || "Erreur d'inscription")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Déconnexion réussie')
  }

  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      const updatedUser = { ...user, ...userData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      toast.success('Profil mis à jour avec succès')
      return { user: updatedUser }
    } catch (error) {
      toast.error(error.message || 'Erreur de mise à jour')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}