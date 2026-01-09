import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCar, FaBuilding, FaPhone, FaArrowRight, FaEye } from 'react-icons/fa'

const CTAButtons = () => {
  const navigate = useNavigate()

  const ctas = [
    {
      title: "Voir les voitures",
      description: "Parcourez notre large sélection de véhicules",
      icon: <FaCar className="w-6 h-6" />,
      color: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      textColor: "text-white",
      onClick: () => navigate('/catalogue')
    },
    {
      title: "Achat flotte",
      description: "Solution complète pour votre entreprise",
      icon: <FaBuilding className="w-6 h-6" />,
      color: "bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700",
      textColor: "text-white",
      onClick: () => navigate('/achat-flotte')
    },
    {
      title: "Contactez-nous",
      description: "Un conseiller vous répond sous 24h",
      icon: <FaPhone className="w-6 h-6" />,
      color: "bg-white hover:bg-gray-50",
      textColor: "text-blue-900",
      border: "border border-gray-200 hover:border-blue-300",
      onClick: () => navigate('/contact')
    }
  ]

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Prêt à trouver votre véhicule idéal ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quelle que soit votre situation, nous avons la solution adaptée à vos besoins.
            </p>
          </div>

          {/* Cartes CTA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {ctas.map((cta, index) => (
              <button
                key={index}
                onClick={cta.onClick}
                className={`${cta.color} ${cta.textColor} ${cta.border || ''} rounded-2xl p-8 text-left group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  cta.title === "Contactez-nous" 
                    ? "bg-blue-100" 
                    : "bg-white/20"
                }`}>
                  <div className={cta.title === "Contactez-nous" ? "text-blue-600" : "text-white"}>
                    {cta.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{cta.title}</h3>
                <p className={`mb-6 ${cta.title === "Contactez-nous" ? "text-gray-600" : "text-white/90"}`}>
                  {cta.description}
                </p>
                
                <div className={`flex items-center gap-2 font-medium ${
                  cta.title === "Contactez-nous" ? "text-blue-900" : "text-white"
                }`}>
                  <span>En savoir plus</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Bouton "Voir tout le catalogue" modernisé */}
          <div className="text-center">
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Explorez notre collection complète
              </p>
              <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mb-2">
                <FaEye className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/catalogue')}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-900 font-bold text-lg rounded-xl border-2 border-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <span>Voir tout le catalogue</span>
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              
              {/* Effet de bordure animée */}
              <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-orange-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"></span>
            </button>
            
            <p className="mt-4 text-sm text-gray-500">
              Plus de 500 véhicules disponibles • Mise à jour quotidienne
            </p>
          </div>

          {/* Séparateur minimaliste */}
          <div className="mt-16 pt-8 border-t border-gray-100"></div>
        </div>
      </div>
    </section>
    )
  }
  
  export default CTAButtons