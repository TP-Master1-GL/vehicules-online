import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaTag, FaCar } from 'react-icons/fa'

const BestOffersSection = () => {
  const navigate = useNavigate()

  const bestOffers = [
    {
      id: 1,
      name: "Toyota RAV4",
      type: "SUV",
      price: 28000,
      oldPrice: 30000,
      clearance: false,
      image: "/toyota-rav4.jpeg",
      year: 2023,
      location: "Douala",
      badge: "SUV"
    },
    {
      id: 2,
      name: "Renault Clio",
      type: "Citadine",
      price: 16500,
      oldPrice: null,
      clearance: false,
      image: "/renault-clio.jpeg",
      year: 2022,
      location: "Yaoundé",
      badge: "Reeds, A. Zona"
    },
    {
      id: 3,
      name: "Yamaha Scooter",
      type: "Scooter",
      price: 3500,
      oldPrice: null,
      clearance: false,
      image: "/yamaha-scooter.jpeg",
      year: 2023,
      location: "Douala",
      badge: "City Salatt"
    },
    {
      id: 4,
      name: "Ford Transit",
      type: "Utilitaire",
      price: 25000,
      oldPrice: 28000,
      clearance: true,
      image: "/ford-transit.jpeg",
      year: 2021,
      location: "Bafoussam",
      badge: "Cargo Ohnt"
    }
  ]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header - Centré comme dans la maquette */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Découvrez Nos Meilleures Offres
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
        </div>

        {/* Grid des offres - 2x2 comme sur la maquette */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Toyota RAV4 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="md:flex">
              <div className="md:w-2/5 h-64 md:h-auto">
                <img 
                  src="/toyota-rav4.jpeg" 
                  alt="Toyota RAV4"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Toyota RAV4</h3>
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                  SUV
                </div>
                <div className="text-3xl font-bold text-orange-500 mb-6">€ 28,000</div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaStar className="w-4 h-4 text-amber-500 mr-2" />
                    <span>Véhicule vérifié & garanti</span>
                  </div>
                  <div className="text-gray-600">📍 Disponible à Douala</div>
                </div>
                <button 
                  onClick={() => navigate('/catalogue')}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Voir les voitures
                </button>
              </div>
            </div>
          </div>

          {/* Renault Clio */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="md:flex">
              <div className="md:w-2/5 h-64 md:h-auto">
                <img 
                  src="/renault-clio.jpeg" 
                  alt="Renault Clio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Renault Clio</h3>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                  Reeds, A. Zona
                </div>
                <div className="text-3xl font-bold text-orange-500 mb-6">€ 16,500</div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaStar className="w-4 h-4 text-amber-500 mr-2" />
                    <span>Idéale pour la ville</span>
                  </div>
                  <div className="text-gray-600">📍 Disponible à Yaoundé</div>
                </div>
                <button 
                  onClick={() => navigate('/achat-flotte')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Achat Flotte
                </button>
              </div>
            </div>
          </div>

          {/* Yamaha Scooter */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="md:flex">
              <div className="md:w-2/5 h-64 md:h-auto">
                <img 
                  src="/yamaha-scooter.jpeg" 
                  alt="Yamaha Scooter"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Yamaha Scooter</h3>
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full mb-4">
                  City Salatt
                </div>
                <div className="text-3xl font-bold text-orange-500 mb-6">€ 3,500</div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaStar className="w-4 h-4 text-amber-500 mr-2" />
                    <span>Économique & maniable</span>
                  </div>
                  <div className="text-gray-600">📍 Disponible à Douala</div>
                </div>
                <button 
                  onClick={() => navigate('/vehicules/motos')}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Voir détails
                </button>
              </div>
            </div>
          </div>

          {/* Ford Transit */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="md:flex">
              <div className="md:w-2/5 h-64 md:h-auto relative">
                <img 
                  src="/ford-transit.jpeg" 
                  alt="Ford Transit"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <FaTag className="mr-1" />
                  Clearance
                </div>
              </div>
              <div className="md:w-3/5 p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Ford Transit</h3>
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full mb-4">
                  Cargo Ohnt
                </div>
                <div className="text-3xl font-bold text-orange-500 mb-6">€ 25,000</div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaStar className="w-4 h-4 text-amber-500 mr-2" />
                    <span>Idéal pour entreprise</span>
                  </div>
                  <div className="text-gray-600">📍 Disponible à Bafoussam</div>
                </div>
                <button 
                  onClick={() => navigate('/vehicules/utilitaires')}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Button Voir tout le catalogue */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/catalogue')}
            className="inline-flex items-center gap-3 border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-bold py-3 px-10 rounded-lg text-lg transition-colors"
          >
            <FaCar className="w-5 h-5" />
            Voir tout le catalogue
          </button>
        </div>
      </div>
    </section>
  )
}

export default BestOffersSection