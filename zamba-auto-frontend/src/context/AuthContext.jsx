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
        setUser(userData)
        setIsAuthenticated(true)
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

      const userData = {
        id: response.user?.id || response.id,
        email: response.user?.email || response.email,
        nom: response.user?.nom || response.nom,
        prenom: response.user?.prenom || response.prenom,
        customer_type: response.user?.type || response.customer_type || 'individual',
        role: response.user?.role || response.role,
        company_id: response.company_id,
        telephone: response.user?.telephone || response.telephone
      }

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)
      setIsAuthenticated(true)

      toast.success('Connexion réussie !')
      return response
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