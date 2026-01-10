import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaCar, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const Register = () => {
  const [accountType, setAccountType] = useState('individual')
  const [step, setStep] = useState(1)
  const { register: registerUser, loading } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch("password")

  const onSubmit = async (data) => {
    try {
      // Mapper les champs du formulaire vers les champs attendus par le backend
      const userData = {
        nom: data.lastName, // lastName -> nom
        prenom: data.firstName, // firstName -> prenom
        email: data.email,
        password: data.password,
        telephone: data.phone, // phone -> telephone
        numeroPermis: data.firstName + data.lastName + Math.random().toString(36).substring(2, 8).toUpperCase(), // Générer un numéro de permis temporaire
        customer_type: accountType
      }

      await registerUser(userData)
      navigate('/login', { 
        state: { 
          message: 'Inscription réussie ! Veuillez vérifier votre email avant de vous connecter.',
          type: 'success'
        } 
      })
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  const accountTypes = [
    {
      id: 'individual',
      title: 'Particulier',
      icon: <FaUser className="w-7 h-7" />,
      description: 'Pour vos besoins personnels',
      color: 'border-blue-900 hover:border-blue-700',
      selectedColor: 'border-blue-900 bg-blue-50',
      iconColor: 'text-blue-900'
    },
    {
      id: 'company',
      title: 'Entreprise',
      icon: <FaBuilding className="w-7 h-7" />,
      description: 'Gestion de flotte complète',
      color: 'border-orange-500 hover:border-orange-600',
      selectedColor: 'border-orange-500 bg-orange-50',
      iconColor: 'text-orange-500'
    },
    {
      id: 'professional',
      title: 'Professionnel',
      icon: <FaCar className="w-7 h-7" />,
      description: 'Concessionnaire ou garage',
      color: 'border-green-500 hover:border-green-600',
      selectedColor: 'border-green-500 bg-green-50',
      iconColor: 'text-green-500'
    }
  ]

  const steps = [
    { number: 1, title: 'Type de compte' },
    { number: 2, title: 'Informations' },
    { number: 3, title: 'Sécurité' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
                Créer votre compte ZAMBA Auto
              </h1>
              <p className="text-gray-600 text-lg">
                Rejoignez la première marketplace automobile du Cameroun
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                {steps.map((s, index) => (
                  <div key={s.number} className="flex flex-col items-center relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-4 ${
                      step >= s.number 
                        ? 'bg-white border-blue-900 text-blue-900' 
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    } font-bold`}>
                      {step > s.number ? <FaCheck className="w-5 h-5" /> : s.number}
                    </div>
                    <span className={`text-sm font-medium ${
                      step >= s.number ? 'text-blue-900' : 'text-gray-500'
                    }`}>
                      {s.title}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">Étape {s.number}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Étape 1: Type de compte */}
              {step === 1 && (
                <div className="p-6 md:p-8">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
                      Choisissez votre profil
                    </h2>
                    <p className="text-gray-600">
                      Sélectionnez le type de compte qui correspond le mieux à vos besoins
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {accountTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setAccountType(type.id)
                          setStep(2)
                        }}
                        className={`p-6 rounded-xl border-2 flex flex-col items-center transition-all duration-300 ${
                          accountType === type.id 
                            ? type.selectedColor + ' shadow-lg scale-[1.02]' 
                            : type.color + ' hover:shadow-md'
                        }`}
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                          accountType === type.id 
                            ? 'bg-white shadow' 
                            : 'bg-gray-50'
                        }`}>
                          <div className={type.iconColor}>
                            {type.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                        <p className="text-gray-600 text-center text-sm mb-4">{type.description}</p>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          accountType === type.id 
                            ? 'bg-blue-100 text-blue-900' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          Recommandé
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 text-center text-sm text-gray-500">
                    <p>Vous pourrez modifier ces informations dans vos paramètres de compte.</p>
                  </div>
                </div>
              )}

              {/* Étape 2: Informations */}
              {step === 2 && (
                <div className="p-6 md:p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
                      Informations {accountType === 'individual' ? 'personnelles' : 'professionnelles'}
                    </h2>
                    <p className="text-gray-600">
                      Remplissez les informations nécessaires pour créer votre compte
                    </p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault()
                    setStep(3)
                  }}>
                    <div className="space-y-6">
                      {accountType === 'individual' ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prénom *
                              </label>
                              <input
                                type="text"
                                {...register("firstName", { required: "Le prénom est requis" })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                                placeholder="John"
                              />
                              {errors.firstName && (
                                <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom *
                              </label>
                              <input
                                type="text"
                                {...register("lastName", { required: "Le nom est requis" })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                                placeholder="Doe"
                              />
                              {errors.lastName && (
                                <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nom de {accountType === 'company' ? 'l\'entreprise' : 'votre structure'} *
                            </label>
                            <input
                              type="text"
                              {...register("companyName", { required: "Le nom est requis" })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                              placeholder={accountType === 'company' ? "Entreprise XYZ SARL" : "Mon Garage"}
                            />
                            {errors.companyName && (
                              <p className="mt-2 text-sm text-red-600">{errors.companyName.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Numéro d'identification
                            </label>
                            <input
                              type="text"
                              {...register("taxNumber")}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                              placeholder={accountType === 'company' ? "NINEA ou RCCM" : "Numéro professionnel"}
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse email *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            {...register("email", {
                              required: "L'email est requis",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Adresse email invalide"
                              }
                            })}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                            placeholder="votre@email.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            {...register("phone", { 
                              required: "Le téléphone est requis",
                              pattern: {
                                value: /^[0-9+\-\s]+$/,
                                message: "Numéro de téléphone invalide"
                              }
                            })}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                            placeholder="+222 6 06 00 08 09"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10 pt-8 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                      >
                        <FaArrowLeft className="w-4 h-4" />
                        Retour
                      </button>
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-lg transition-all hover:shadow-lg"
                      >
                        Continuer
                        <FaArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Étape 3: Sécurité */}
              {step === 3 && (
                <div className="p-6 md:p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
                      Sécurisez votre compte
                    </h2>
                    <p className="text-gray-600">
                      Choisissez un mot de passe fort pour protéger votre compte
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            {...register("password", {
                              required: "Le mot de passe est requis",
                              minLength: {
                                value: 8,
                                message: "Minimum 8 caractères"
                              },
                              pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message: "Doit contenir majuscule, minuscule et chiffre"
                              }
                            })}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                            placeholder="••••••••"
                          />
                        </div>
                        {errors.password && (
                          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                        )}
                        <div className="mt-2 text-sm text-gray-500">
                          Votre mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule et chiffre.
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmer le mot de passe *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            {...register("confirmPassword", {
                              required: "Veuillez confirmer le mot de passe",
                              validate: value => value === password || "Les mots de passe ne correspondent pas"
                            })}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                            placeholder="••••••••"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                      </div>

                      <div className="pt-4">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            {...register("terms", { required: "Vous devez accepter les conditions" })}
                            id="terms"
                            className="h-4 w-4 mt-1 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                          />
                          <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                            J'accepte les{' '}
                            <Link to="/conditions" className="text-blue-900 hover:text-blue-700 font-medium">
                              conditions d'utilisation
                            </Link>{' '}
                            et la{' '}
                            <Link to="/confidentialite" className="text-blue-900 hover:text-blue-700 font-medium">
                              politique de confidentialité
                            </Link>{' '}
                            de ZAMBA Auto *
                          </label>
                        </div>
                        {errors.terms && (
                          <p className="mt-2 text-sm text-red-600">{errors.terms.message}</p>
                        )}
                        
                        <div className="mt-4 flex items-start">
                          <input
                            type="checkbox"
                            {...register("newsletter")}
                            id="newsletter"
                            className="h-4 w-4 mt-1 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                          />
                          <label htmlFor="newsletter" className="ml-3 block text-sm text-gray-700">
                            Je souhaite recevoir les offres exclusives et actualités de ZAMBA Auto par email
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10 pt-8 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                      >
                        <FaArrowLeft className="w-4 h-4" />
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all hover:shadow-lg disabled:opacity-70"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Création en cours...
                          </>
                        ) : (
                          <>
                            Créer mon compte
                            <FaCheck className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-900 hover:text-blue-700 font-bold hover:underline"
                >
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </div>

          
        </div>
      </main>
    </div>
  )
}

export default Register