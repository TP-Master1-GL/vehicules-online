import React from 'react'
import { FaShieldAlt, FaTruck, FaUsers, FaAward, FaCheck } from 'react-icons/fa'

const About = () => {
  const features = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Garantie Incluse",
      description: "12 mois de garantie tous risques sur tous nos véhicules"
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Livraison Rapide",
      description: "Livraison dans tout le Cameroun sous 7 jours"
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Support Client",
      description: "Équipe dédiée disponible 7j/7 pour vous accompagner"
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: "Qualité Certifiée",
      description: "Tous nos véhicules passent 150 points de contrôle"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Pattern africain en haut - aligné comme sur maquette */}
      <div className="w-full h-6 bg-repeat-x" style={{
        backgroundImage: 'url(/african-pattern-border.png)',
        backgroundSize: 'auto 60px',
        backgroundPosition: 'center'
      }}></div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            À propos de <span className="text-orange-500">ZAMBA</span> Auto
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Votre marketplace de référence pour l'achat de véhicules particuliers 
            et de flottes d'entreprise au Cameroun.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
              <p className="text-lg opacity-90 mb-6">
                Révolutionner l'expérience d'achat automobile au Cameroun en offrant 
                une plateforme transparente, sécurisée et complète pour tous.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaCheck className="w-5 h-5 text-green-300 mr-3" />
                  <span>Transparence totale sur les prix</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="w-5 h-5 text-green-300 mr-3" />
                  <span>Véhicules vérifiés et certifiés</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="w-5 h-5 text-green-300 mr-3" />
                  <span>Support client personnalisé</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center">
                <div className="text-6xl"> <img 
              src="/logo-zamba.png" 
              alt="ZAMBA Auto" 
              className="h-full w-full"
            /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Nous Choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
              <div className="text-gray-600">Véhicules vendus</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">98%</div>
              <div className="text-gray-600">Clients satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">15</div>
              <div className="text-gray-600">Années d'expérience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">24h</div>
              <div className="text-gray-600">Délai de réponse</div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Contactez-nous</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Téléphone</div>
                <div className="text-lg opacity-90">+222 6 06 00 08 09</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Email</div>
                <div className="text-lg opacity-90">contact@zamba-auto.com</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Horaires</div>
                <div className="text-lg opacity-90">Lun - Ven, 8h - 18h</div>
              </div>
            </div>
            <div className="mt-8">
              <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                Contactez-nous maintenant
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default About