import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFire, FaStar, FaTag, FaCar } from 'react-icons/fa'

const BestOffersSection = () => {
  const navigate = useNavigate()
  const [catalogueVehicles, setCatalogueVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulation de chargement des véhicules du catalogue
  useEffect(() => {
    // Ici, normalement vous feriez un appel API ou utiliseriez un contexte
    // Pour l'exemple, je simule un catalogue de véhicules
    const fetchCatalogueVehicles = async () => {
      try {
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Données simulées du catalogue (pourrait venir d'une API, contexte, etc.)
        const catalogueData = [
          {
            id: 101,
            name: "Toyota RAV4",
            brand: "Toyota",
            type: "SUV",
            year: 2023,
            price: 28000,
            oldPrice: 30000,
            discount: true,
            discountPercentage: 7,
            image: "/toyota-rav4.jpeg",
            features: ["Automatique", "Diesel", "4x4"],
            rating: 4.8,
            location: "Douala",
            isBestOffer: true,
            mileage: 15000
          },
          {
            id: 102,
            name: "Renault Clio",
            brand: "Renault",
            type: "Citadine",
            year: 2022,
            price: 16500,
            oldPrice: null,
            discount: false,
            image: "/renault-clio.jpeg",
            features: ["Manuelle", "Essence", "4 Places"],
            rating: 4.5,
            location: "Yaoundé",
            isBestOffer: true,
            mileage: 25000
          },
          {
            id: 103,
            name: "Mercedes Classe A",
            brand: "Mercedes",
            type: "Berline",
            year: 2023,
            price: 35000,
            oldPrice: 38000,
            discount: true,
            discountPercentage: 8,
            image: "/mercedes-classe-a.jpeg",
            features: ["Automatique", "Essence", "Full Options"],
            rating: 4.9,
            location: "Douala",
            isBestOffer: false,
            mileage: 8000
          },
          {
            id: 104,
            name: "Peugeot 208",
            brand: "Peugeot",
            type: "Citadine",
            year: 2023,
            price: 19500,
            oldPrice: null,
            discount: false,
            image: "/peugeot-208.jpeg",
            features: ["Automatique", "Essence", "Connectée"],
            rating: 4.6,
            location: "Yaoundé",
            isBestOffer: true,
            mileage: 12000
          },
          {
            id: 105,
            name: "Ford Ranger",
            brand: "Ford",
            type: "Pick-up",
            year: 2022,
            price: 32000,
            oldPrice: 35000,
            discount: true,
            discountPercentage: 9,
            image: "/ford-ranger.jpeg",
            features: ["Manuelle", "Diesel", "4x4", "Double Cabine"],
            rating: 4.7,
            location: "Bafoussam",
            isBestOffer: true,
            mileage: 30000
          },
          {
            id: 106,
            name: "Kia Sportage",
            brand: "Kia",
            type: "SUV",
            year: 2023,
            price: 27500,
            oldPrice: 29500,
            discount: true,
            discountPercentage: 7,
            image: "/kia-sportage.jpeg",
            features: ["Automatique", "Essence", "7 Places"],
            rating: 4.8,
            location: "Douala",
            isBestOffer: false,
            mileage: 10000
          },
          {
            id: 107,
            name: "Yamaha Scooter",
            brand: "Yamaha",
            type: "Scooter",
            year: 2023,
            price: 3500,
            oldPrice: null,
            discount: true,
            image: "/yamaha-scooter.jpeg",
            features: ["125cc", "Automatique", "City Smart"],
            rating: 4.7,
            location: "Douala",
            isBestOffer: true,
            mileage: 500
          },
          {
            id: 108,
            name: "Ford Transit",
            brand: "Ford",
            type: "Utilitaire",
            year: 2021,
            price: 25000,
            oldPrice: 28000,
            discount: true,
            discountPercentage: 11,
            image: "/ford-transit.jpeg",
            features: ["Diesel", "Cargo 9h", "Grand volume"],
            rating: 4.6,
            location: "Bafoussam",
            isBestOffer: true,
            mileage: 45000
          }
        ]
        
        // Filtrer pour n'afficher que les meilleures offres
        // Vous pouvez ajuster la logique selon vos besoins
        const bestOffers = catalogueData.filter(vehicle => 
          vehicle.isBestOffer || vehicle.discount || vehicle.rating >= 4.5
        ).slice(0, 4) // Limiter à 4 véhicules maximum
        
        setCatalogueVehicles(bestOffers)
      } catch (error) {
        console.error('Erreur lors du chargement du catalogue:', error)
        // En cas d'erreur, afficher des données par défaut
        setCatalogueVehicles([
          {
            id: 1,
            name: "Toyota RAV4",
            brand: "Toyota",
            type: "SUV",
            year: 2023,
            price: 28000,
            oldPrice: 30000,
            discount: true,
            image: "/toyota-rav4.jpeg",
            features: ["Automatique", "Diesel", "4x4"],
            rating: 4.8,
            location: "Douala"
          },
          {
            id: 2,
            name: "Renault Clio",
            brand: "Renault",
            type: "Citadine",
            year: 2022,
            price: 16500,
            oldPrice: null,
            discount: false,
            image: "/renault-clio.jpeg",
            features: ["Manuelle", "Essence", "4 Places"],
            rating: 4.5,
            location: "Yaoundé"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCatalogueVehicles()
  }, [])

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Découvrez Nos Meilleures Offres
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chargement des véhicules...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Découvrez Nos Meilleures Offres
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des véhicules vérifiés avec les meilleurs prix du marché
          </p>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {catalogueVehicles.map((vehicle) => (
            <div 
              key={vehicle.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {vehicle.discount && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <FaTag className="inline mr-1" />
                    {vehicle.discountPercentage ? `-${vehicle.discountPercentage}%` : 'Promo'}
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-blue-900 text-white px-3 py-1 rounded text-xs font-medium">
                  {vehicle.brand}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded text-xs">
                  {vehicle.year}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">{vehicle.name}</h3>
                    <p className="text-gray-500 text-sm">{vehicle.type}</p>
                  </div>
                  <div className="flex items-center text-amber-500">
                    <FaStar className="w-4 h-4" />
                    <span className="ml-1 text-sm">{vehicle.rating}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {vehicle.features.slice(0, 3).map((feature, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Kilométrage */}
                {vehicle.mileage && (
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-orange-500">
                    {formatPrice(vehicle.price)}
                  </div>
                  {vehicle.oldPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(vehicle.oldPrice)}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">📍 {vehicle.location}</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/vehicule/${vehicle.id}`)}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Voir détails
                  </button>
                  <button 
                    onClick={() => navigate(`/contact?vehicule=${vehicle.id}`)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Demande d'info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voir tout le catalogue Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/catalogue')}
            className="inline-flex items-center gap-2 border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            <FaCar className="w-5 h-5" />
            Voir tout le catalogue ({catalogueVehicles.length} offres sélectionnées)
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <div className="text-3xl font-bold mb-2">Notre Sélection</div>
              <p className="text-gray-200">
                {catalogueVehicles.length} véhicules rigoureusement sélectionnés pour leur qualité
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">500+</div>
                <div className="text-sm text-gray-200">Véhicules en catalogue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm text-gray-200">Clients satisfaits</div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <button 
                onClick={() => navigate('/contact')}
                className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BestOffersSection