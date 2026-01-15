import React, { useState, useEffect, useRef } from 'react'
import { FaCar, FaUsers, FaStar, FaClock } from 'react-icons/fa'
import './StatsSection.css'

const StatsSection = () => {
  const [countedValues, setCountedValues] = useState([0, 0, 0, 0])
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)

  const stats = [
    {
      icon: <FaCar className="w-8 h-8" />,
      value: 500,
      suffix: "+",
      label: "Véhicules en stock",
      description: "Large choix neufs et occasions",
      duration: 2000
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      value: 98,
      suffix: "%",
      label: "Clients satisfaits",
      description: "Notre priorité absolue",
      duration: 1500
    },
    {
      icon: <FaStar className="w-8 h-8" />,
      value: 15,
      suffix: "+",
      label: "Marques disponibles",
      description: "Les meilleures marques",
      duration: 1800
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      value: 24,
      suffix: "h",
      label: "Réponse garantie",
      description: "Support réactif",
      duration: 1000
    }
  ]

  // Intersection Observer pour détecter quand la section est visible
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
      
      // Easing function for smooth animation
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
    <section ref={ref} className="py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-blue-900 mr-2">ZAMBA Auto</span>
              <span className="text-3xl font-bold text-orange-500">en Chiffres</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Notre Impact en Temps Réel
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des résultats qui témoignent de notre engagement quotidien pour vous offrir la meilleure expérience
            </p>
          </div>

          {/* Stats Grid with animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="relative group"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Card with glass effect */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Glowing border effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500 group-hover:duration-200"></div>
                  
                  <div className="relative z-10">
                    {/* Icon with animation */}
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    
                    {/* Animated Counter */}
                    <div className="mb-2">
                      <div className="text-4xl md:text-5xl font-bold text-blue-900 mb-1">
                        <span className="inline-block min-w-[60px] text-center">
                          {hasAnimated ? countedValues[index] : 0}
                        </span>
                        <span className="text-orange-500">{stat.suffix}</span>
                      </div>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-900 to-orange-500 rounded-full mx-auto mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {stat.label}
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base">
                      {stat.description}
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-900 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: hasAnimated ? '100%' : '0%',
                          transitionDelay: `${index * 150}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative elements */}
          <div className="mt-12 md:mt-16 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm text-gray-500 ml-2">Chiffres mis à jour quotidiennement</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default StatsSection