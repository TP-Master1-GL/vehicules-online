import React, { useState, useRef, useEffect } from 'react'
import { 
  FaUser, 
  FaBuilding, 
  FaAward, 
  FaCar, 
  FaTruck, 
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaHandshake,
  FaHeadset
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const ServicesSection = () => {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  const services = [
    {
      icon: <FaUser className="w-10 h-10" />,
      title: "Pour Particuliers",
      description: "Découvrez une large sélection de voitures pour vos besoins personnels.",
      color: "bg-gradient-to-br from-blue-900 to-blue-700",
      textColor: "text-white",
      features: ["Véhicules vérifiés", "Financement flexible", "Garantie 12 mois", "Livraison gratuite"],
      cta: "Voir les véhicules",
      onClick: () => navigate('/catalogue'),
      badge: "Populaire"
    },
    {
      icon: <FaBuilding className="w-10 h-10" />,
      title: "Pour Entreprises",
      description: "Achetez ou louez des flottes de véhicules adaptés à votre activité.",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      textColor: "text-white",
      features: ["Gestion flotte", "Maintenance incluse", "Reporting détaillé", "Location longue durée"],
      cta: "Solution flotte",
      onClick: () => navigate('/achat-flotte'),
      badge: "Professionnel"
    },
    {
      icon: <FaAward className="w-10 h-10" />,
      title: "Service Premium",
      description: "Service client dédié, transactions transparentes, qualité garantie.",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-white",
      features: ["Support 7j/7", "Expertise technique", "Satisfaction garantie", "Transparence totale"],
      cta: "Nos engagements",
      onClick: () => navigate('/a-propos'),
      badge: "Excellence"
    }
  ]

  const features = [
    {
      icon: <FaCar className="w-8 h-8" />,
      title: "500+ Véhicules",
      description: "Large choix neufs et occasions vérifiés",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Livraison Express",
      description: "Dans tout le Cameroun sous 7 jours",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Garantie Incluse",
      description: "Tous nos véhicules vérifiés et garantis",
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ]

  // Intersection Observer pour animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
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
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with animation */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="text-sm font-semibold text-orange-500 bg-orange-50 px-4 py-2 rounded-full inline-block mb-3">
              Solutions Sur Mesure
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Services <span className="text-orange-500">Personnalisés</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Que vous soyez particulier ou professionnel, nous avons la solution automobile 
            parfaitement adaptée à vos besoins spécifiques.
          </p>
        </div>

        {/* Services Cards with advanced animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {services.map((service, index) => (
            <div 
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: 'both'
              }}
            >
              {/* Card with glass effect */}
              <div className={`
                relative bg-white rounded-2xl overflow-hidden
                border border-gray-200 shadow-xl hover:shadow-2xl
                transition-all duration-500
                ${hoveredCard === index ? 'scale-105 z-10' : 'hover:scale-105'}
                transform-gpu
              `}>
                {/* Service header with gradient */}
                <div className={`relative ${service.color} p-8 ${service.textColor} overflow-hidden`}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-white/20"></div>
                  </div>
                  
                  {/* Badge */}
                  {service.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                        {service.badge}
                      </span>
                    </div>
                  )}
                  
                  {/* Icon with animation */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                    {/* Floating dots */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/30 rounded-full"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white/30 rounded-full"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="opacity-90">{service.description}</p>
                </div>
                
                {/* Features list */}
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <FaCheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button with animation */}
                  <button 
                    onClick={service.onClick}
                    className={`
                      w-full py-3.5 px-6 rounded-xl font-bold
                      flex items-center justify-center gap-3
                      transition-all duration-300
                      ${service.title === "Pour Particuliers" 
                        ? 'bg-blue-900 hover:bg-blue-800 text-white' 
                        : service.title === "Pour Entreprises"
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      }
                      group-hover:shadow-lg group-hover:-translate-y-1
                    `}
                  >
                    <span>{service.cta}</span>
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                  
                  {/* Animated progress line */}
                  <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`
                        h-full rounded-full transition-all duration-1000 ease-out
                        ${service.title === "Pour Particuliers" 
                          ? 'bg-blue-900' 
                          : service.title === "Pour Entreprises"
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                        }
                      `}
                      style={{ 
                        width: hoveredCard === index ? '100%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500 group-hover:duration-200 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Features Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
              Pourquoi Nous Faire Confiance ?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre engagement se traduit par des services concrets et des résultats mesurables
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`${feature.bgColor} ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-700">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
                
                {/* Animated indicator */}
                <div className="mt-4 flex justify-center">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((dot) => (
                      <div 
                        key={dot}
                        className={`w-2 h-2 rounded-full ${feature.bgColor} group-hover:scale-125 transition-transform`}
                        style={{ animationDelay: `${dot * 100}ms` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full mb-4">
              <FaHandshake className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
              Prêt à Trouver Votre Solution Idéale ?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre équipe d'experts est à votre écoute pour vous accompagner dans votre projet automobile
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/catalogue')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold rounded-xl hover:from-blue-800 hover:to-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explorer le catalogue
                <FaArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button 
              onClick={() => navigate('/contact')}
              className="group relative px-8 py-4 border-2 border-blue-900 text-blue-900 font-bold rounded-xl hover:bg-blue-900 hover:text-white transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                <FaHeadset className="w-5 h-5" />
                Parler à un expert
              </span>
            </button>
          </div>
          
          <p className="mt-6 text-gray-500 text-sm">
            Réponse garantie sous 24h • Service gratuit et sans engagement
          </p>
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
        
        .animate-blob {
          animation: blob 10s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .bg-grid-white\/20 {
          background-image: linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}

export default ServicesSection