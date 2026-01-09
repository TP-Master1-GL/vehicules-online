import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa'

const Header = () => {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    { path: '/', label: 'Accueil' },
    { path: '/catalogue', label: 'Catalogue' },
    { path: '/achat-flotte', label: 'Achat flotte' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/contact', label: 'Contact' }
  ]

  const authenticatedMenuItems = [
    { path: '/documents', label: 'Mes Documents' }
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/logo-zamba.png" 
              alt="ZAMBA Auto" 
              className="h-25 w-20"
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium text-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-blue-900 hover:text-orange-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Menu pour utilisateurs connectés */}
            {user && authenticatedMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium text-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-blue-900 hover:text-orange-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center space-x-6">
            {/* Panier */}
            <Link to="/panier" className="relative">
              <div className="p-2 rounded-lg hover:bg-gray-100">
                <FaShoppingCart className="w-6 h-6 text-blue-900 hover:text-orange-500" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>

            {/* Auth Desktop */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-blue-900 hover:text-orange-500">
                    <FaUser className="w-5 h-5" />
                    <span className="font-medium">
                      {user.first_name || user.email.split('@')[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block z-50 border">
                    <Link
                      to="/documents"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    >
                      Mes Documents
                    </Link>
                    {user?.customer_type === 'company' && (
                      <Link
                        to="/entreprise/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                      >
                        Tableau de bord entreprise
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-blue-900 hover:text-orange-500 font-medium"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FaTimes className="w-6 h-6 text-blue-900" />
              ) : (
                <FaBars className="w-6 h-6 text-blue-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 bg-white">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 font-medium text-lg ${
                    isActive(item.path)
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-blue-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              {user ? (
                <div className="mt-4 pt-4 border-t">
                  <Link
                    to="/documents"
                    className="block px-4 py-3 text-blue-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mes Documents
                  </Link>
                  {user?.customer_type === 'company' && (
                    <Link
                      to="/entreprise/dashboard"
                      className="block px-4 py-3 text-blue-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tableau de bord entreprise
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-blue-900 hover:bg-gray-50"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    to="/login" 
                    className="block bg-blue-700   text-white px-6 py-3  rounded-lg  font-medium text-center hover:bg-blue-600  mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-orange-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header