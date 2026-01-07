import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaShieldAlt, 
  FaTruck, 
  FaMoneyBillWave, 
  FaHeadset, 
  FaLeaf, 
  FaAward,
  FaCheckCircle,
  FaCar,
  FaUsers,
  FaClock,
  FaChartLine,
  FaArrowRight,
  FaStar
} from 'react-icons/fa'

const WhyChooseUs = () => {
  const navigate = useNavigate()
  const [activeCard, setActiveCard] = useState(null)
  const [countedValues, setCountedValues] = useState([0, 0, 0, 0])
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)

  const features = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Garantie Premium",
      description: "12 mois de garantie tous risques incluse sur tous nos véhicules vérifiés",
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-500",
      iconColor: "text-blue-500"
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Livraison Express",
      description: "Livraison dans tout le Cameroun sous 7 jours ouvrables garantis",
      color: "from-orange-500 to-orange-600",
      borderColor: "border-orange-500",
      iconColor: "text-orange-500"
    },
    {
      icon: <FaMoneyBillWave className="w-8 h-8" />,
      title: "Financement Sur Mesure",
      description: "Solutions de financement adaptées à votre budget et profil",
      color: "from-green-500 to-green-600",
      borderColor: "border-green-500",
      iconColor: "text-green-500"
    },
    {
      icon: <FaHeadset className="w-8 h-8" />,
      title: "Support Premium 7j/7",
      description: "Équipe dédiée pour vous accompagner à chaque étape du processus",
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-500",
      iconColor: "text-purple-500"
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: "Qualité Certifiée",
      description: "150 points de contrôle rigoureux sur chaque véhicule",
      color: "from-teal-500 to-teal-600",
      borderColor: "border-teal-500",
      iconColor: "text-teal-500"
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: "Expertise Locale",
      description: "15 ans d'expérience au Cameroun, nous connaissons le marché",
      color: "from-yellow-500 to-yellow-600",
      borderColor: "border-yellow-500",
      iconColor: "text-yellow-500"
    }
  ]

  const stats = [
    { value: 500, suffix: "+", label: "Véhicules", description: "en stock", duration: 2000 },
    { value: 98, suffix: "%", label: "Clients", description: "satisfaits", duration: 1500 },
    { value: 24, suffix: "h", label: "Réponse", description: "garantie", duration: 1000 },
    { value: 15, suffix: "ans", label: "Expérience", description: "au Cameroun", duration: 1800 }
  ]

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            stats.forEach((stat, index) => {
              animateCounter(stat.value, index, stat.duration)
            })
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [hasAnimated])

  const animateCounter = (target, index, duration) => {
    const startTime = Date.now()
    const startValue = 0
    
    const updateCounter = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart)
      
      setCountedValues(prev => {
        const newValues = [...prev]
        newValues[index] = currentValue
        return newValues
      })
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      }
    }
    
    requestAnimationFrame(updateCounter)
  }

  return (
    <section ref={ref} className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section with animated entrance */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
                <span className="text-5xl text-white">🚗</span>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full opacity-20 blur-xl animate-ping-slow"></div>
            </div>
          </div>
          
          <div className="mb-6">
            <span className="text-sm font-semibold text-orange-500 bg-orange-50 px-4 py-2 rounded-full inline-block mb-3">
              L'excellence automobile
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-4">
              Pourquoi Choisir{' '}
              <span className="relative inline-block">
                <span className="relative z-10">ZAMBA Auto</span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-500/20 -skew-x-12"></span>
              </span>
              ?
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nous révolutionnons l'expérience d'achat automobile au Cameroun en combinant{' '}
            <span className="font-semibold text-blue-900">technologie moderne</span>,{' '}
            <span className="font-semibold text-orange-500">expertise locale</span> et{' '}
            <span className="font-semibold text-green-500">engagement total</span>.
          </p>
        </div>

        {/* Features Grid with 3D effects */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Card with glass morphism */}
                <div className={`
                  relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8
                  border border-white/40 shadow-xl hover:shadow-2xl
                  transition-all duration-500 group-hover:-translate-y-2
                  ${activeCard === index ? 'scale-105 z-10' : ''}
                `}>
                  {/* Animated gradient border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500`}></div>
                  
                  {/* Icon container with animated background */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <div className="text-white text-2xl">
                        {feature.icon}
                      </div>
                    </div>
                    {/* Floating effect */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <FaCheckCircle className="w-3 h-3 text-green-500" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Animated hover link */}
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                    <span>En savoir plus</span>
                    <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                  
                  {/* Progress line */}
                  <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${feature.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ 
                        width: activeCard === index ? '100%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section with animated counters */}
        <div className="mb-20 relative">
          {/* Floating elements */}
          <div className="absolute -top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
          
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-grid-white/10"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-center mb-10 md:mb-12">
                <div className="inline-flex items-center justify-center mb-4">
                  <FaStar className="w-6 h-6 text-orange-400 mr-3 animate-spin-slow" />
                  <h3 className="text-2xl md:text-4xl font-bold">
                    Impact Mesurable
                  </h3>
                  <FaStar className="w-6 h-6 text-orange-400 ml-3 animate-spin-slow" />
                </div>
                <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                  Notre succès se mesure à travers ces chiffres qui témoignent de notre engagement
                </p>
              </div>

              {/* Animated Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="group relative"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-1">
                      {/* Animated icon */}
                      <div className="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        {index === 0 && <FaCar className="w-7 h-7 text-white" />}
                        {index === 1 && <FaUsers className="w-7 h-7 text-white" />}
                        {index === 2 && <FaClock className="w-7 h-7 text-white" />}
                        {index === 3 && <FaChartLine className="w-7 h-7 text-white" />}
                      </div>
                      
                      {/* Animated Counter */}
                      <div className="mb-2">
                        <div className="text-4xl md:text-5xl font-bold">
                          <span className="inline-block min-w-[60px]">
                            {hasAnimated ? countedValues[index] : 0}
                          </span>
                          <span className="text-orange-300">{stat.suffix}</span>
                        </div>
                      </div>
                      
                      <div className="font-bold text-lg mb-1">{stat.label}</div>
                      <div className="text-blue-200 text-sm">{stat.description}</div>
                      
                      {/* Animated bar */}
                      <div className="mt-4 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-300 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: hasAnimated ? '100%' : '0%',
                            transitionDelay: `${index * 200}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center mt-12 pt-8 border-t border-white/20">
                <button 
                  onClick={() => navigate('/contact')}
                  className="group relative inline-flex items-center gap-3 bg-white text-blue-900 hover:text-blue-800 font-bold py-4 px-12 rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10">Parler à un conseiller expert</span>
                  <FaHeadset className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                </button>
                <p className="text-blue-200/80 text-sm mt-4">
                  Réponse personnalisée sous 24h ouvrées • Gratuit et sans engagement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="pt-12 border-t border-gray-200/50">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
              Une Communauté de Confiance
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits qui nous font confiance depuis des années
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "Particuliers", color: "bg-blue-500" },
              { value: "150+", label: "Entreprises", color: "bg-orange-500" },
              { value: "50+", label: "Partenaires", color: "bg-green-500" },
              { value: "10+", label: "Marques", color: "bg-purple-500" }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-3 group-hover:scale-150 transition-transform`}></div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform inline-block">
                  {item.value}
                </div>
                <div className="text-gray-700 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-blob {
          animation: blob 10s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .bg-grid-white\/10 {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </section>
  )
}

export default WhyChooseUs