import React, { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FaEnvelope, FaLock, FaGoogle, FaCheck, FaCar } from 'react-icons/fa'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(formData.email, formData.password)
      const user = response?.user || JSON.parse(localStorage.getItem('user'))
      
      // Rediriger selon le rôle de l'utilisateur
      const userRole = user?.role?.toUpperCase?.() || user?.role
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (userRole === 'MANAGER') {
        navigate('/manager/dashboard')
      } else if (user?.customerType === 'company' || user?.customerType === 'professional') {
        navigate('/entreprise/dashboard')
      } else {
        // Récupérer la route de redirection depuis l'état de navigation
        const from = location.state?.from || '/'
        navigate(from)
      }
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Implémentation Google Auth
    console.log('Google login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header et Footer seront gérés par le Layout principal */}
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
        

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Carte de connexion */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <FaCar className="w-8 h-8 text-blue-900" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                    Connexion à ZAMBA Auto
                  </h1>
                  <p className="text-gray-600">
                    Connectez-vous pour accéder à votre compte
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Votre mot de passe"
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="remember"
                        checked={formData.remember}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700 text-sm">Se souvenir de moi</span>
                    </label>
                    <Link 
                      to="/mot-de-passe-oublie" 
                      className="text-blue-900 hover:text-blue-700 text-sm font-medium"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  {/* Bouton connexion */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-lg transition-all hover:shadow-lg disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connexion en cours...
                      </span>
                    ) : 'Se Connecter'}
                  </button>
                </form>

                {/* Séparateur */}
                <div className="my-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">ou continuez avec</span>
                    </div>
                  </div>
                </div>

                {/* Connexion Google */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full  flex bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 items-center  justify-center gap-3 border-3 border-gray-300 hover:border-gray-400 rounded-lg py-3 px-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <FaGoogle className="w-5 h-5 text-red-500" />
                  <span className="text-white-500 font-medium">
                    Continuer avec Google
                  </span>
                </button>

                {/* Lien inscription */}
                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                  <p className="text-gray-600">
                    Pas encore de compte ?{' '}
                    <Link 
                      to="/register" 
                      className="text-blue-900 hover:text-blue-700 font-bold hover:underline"
                    >
                      Créer un compte gratuitement
                    </Link>
                  </p>
                </div>
              </div>

              {/* Section Avantages */}
              <div className="lg:mt-0">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 md:p-8 text-white h-full">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    Pourquoi créer un compte ?
                  </h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">Sauvegarder vos recherches</h3>
                        <p className="text-blue-100 opacity-90">Gardez une trace des véhicules qui vous intéressent</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">Notifications personnalisées</h3>
                        <p className="text-blue-100 opacity-90">Soyez alerté des nouvelles offres correspondant à vos critères</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">Gestion simplifiée</h3>
                        <p className="text-blue-100 opacity-90">Suivez facilement vos demandes et transactions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">Offres exclusives</h3>
                        <p className="text-blue-100 opacity-90">Accédez à des promotions réservées aux membres</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-3">Vous avez des questions ?</h3>
                    <p className="text-blue-100 mb-4">
                      Notre équipe support est disponible pour vous aider
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href="tel:+222606000809" 
                        className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg text-center transition-colors"
                      >
                        +237 600 000 086
                      </a>
                      <a 
                        href="mailto:support@zamba-auto.com" 
                        className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-6 rounded-lg text-center transition-colors"
                      >
                        Nous contacter
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </main>
    </div>
  )
}

export default Login