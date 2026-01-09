import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFire, FaStar, FaTag, FaCar } from 'react-icons/fa'
import VehicleCard from '../ui/VehiculeCard'

const BestOffersSection = () => {
  const navigate = useNavigate()

  const bestOffers = [
    {
      id: 1,
      name: "Toyota RAV4",
      brand: "Toyota",
      type: "SUV",
      year: 2023,
      price: 28000,
      oldPrice: 30000,
      clearance: false,
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
      clearance: false,
      image: "/renault-clio.jpeg",
      features: ["Manuelle", "Essence", "4 Zones"],
      rating: 4.5,
      location: "Yaoundé"
    },
    {
      id: 3,
      name: "Yamaha Scooter",
      brand: "Yamaha",
      type: "Scooter",
      year: 2023,
      price: 3500,
      oldPrice: null,
      clearance: true,
      image: "/yamaha-scooter.jpeg",
      features: ["125cc", "Automatique", "City Smart"],
      rating: 4.7,
      location: "Douala"
    },
    {
      id: 4,
      name: "Ford Transit",
      brand: "Ford",
      type: "Utilitaire",
      year: 2021,
      price: 25000,
      oldPrice: 28000,
      clearance: true,
      image: "/ford-transit.jpeg",
      features: ["Diesel", "Cargo 9h", "Grand volume"],
      rating: 4.6,
      location: "Bafoussam"
    }
  ]

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

        {/* Vehicles Grid - 2 colonnes sur desktop, 1 sur mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {bestOffers.map((vehicle) => (
            <div 
              key={vehicle.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {vehicle.clearance && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    <FaTag className="inline mr-1" />
                    Clearance
                  </div>
                )}
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
                <div className="flex flex-wrap gap-2 mb-4">
                  {vehicle.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-orange-500">
                    € {vehicle.price.toLocaleString()}
                  </div>
                  {vehicle.oldPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      € {vehicle.oldPrice.toLocaleString()}
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
                  {vehicle.type === "Scooter" ? (
                    <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium">
                      Achat Flotte
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium">
                      Voir les voitures
                    </button>
                  )}
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
            Voir tout le catalogue
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <div className="text-3xl font-bold mb-2">Notre Sélection</div>
              <p className="text-gray-200">Des véhicules rigoureusement sélectionnés pour leur qualité</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">500+</div>
                <div className="text-sm text-gray-200">Véhicules vérifiés</div>
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