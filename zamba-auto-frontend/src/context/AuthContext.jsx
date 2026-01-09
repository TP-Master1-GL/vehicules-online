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
      // Simulation - À remplacer par l'appel API
      const mockUser = {
        id: 1,
        email: email,
        name: email.split('@')[0],
        customer_type: email.includes('entreprise') ? 'company' : 
                      email.includes('filiale') ? 'subsidiary' : 'individual',
        company_id: email.includes('entreprise') ? 1 : null,
        first_name: 'John',
        last_name: 'Doe',
        phone: '+237 6 77 88 99 00'
      }
      
      const mockToken = 'mock-jwt-token-123456'
      
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      setUser(mockUser)
      setIsAuthenticated(true)
      
      toast.success('Connexion réussie !')
      return { user: mockUser, token: mockToken }
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
      // Simulation d'inscription
      const mockUser = {
        id: Date.now(),
        ...userData,
        customer_type: userData.email.includes('entreprise') ? 'company' : 
                      userData.email.includes('filiale') ? 'subsidiary' : 'individual',
        company_id: userData.email.includes('entreprise') ? Date.now() : null
      }
      
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      return { user: mockUser }
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