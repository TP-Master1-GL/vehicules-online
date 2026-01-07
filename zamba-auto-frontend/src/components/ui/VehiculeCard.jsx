import React from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt, FaGasPump, FaCog, FaTachometerAlt, FaCalendar } from 'react-icons/fa'

const VehicleCard = ({ vehicle, layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
        <div className="flex gap-6">
          {/* Image */}
          <div className="w-64 h-48 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-6xl">{vehicle.image}</div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {vehicle.clearance && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      CLEARANCE
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{vehicle.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{vehicle.brand} • {vehicle.type} • {vehicle.year}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaTachometerAlt className="w-4 h-4" />
                    <span>{vehicle.km?.toLocaleString() || '0'} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaGasPump className="w-4 h-4" />
                    <span>{vehicle.fuel || 'Diesel'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCog className="w-4 h-4" />
                    <span>{vehicle.transmission || 'Automatique'}</span>
                  </div>
                </div>
              </div>
              
              {/* Price */}
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {vehicle.price.toLocaleString()} €
                </div>
                {vehicle.oldPrice && (
                  <div className="text-gray-400 line-through">
                    {vehicle.oldPrice.toLocaleString()} €
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                  <FaMapMarkerAlt className="w-3 h-3" />
                  <span>{vehicle.location}</span>
                </div>
              </div>
            </div>
            
            {/* Features & Actions */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <FaStar className="w-4 h-4 text-yellow-500" />
                  <span className="ml-1 font-medium">{vehicle.rating}</span>
                </div>
                <span className="text-gray-500">(24 avis)</span>
              </div>
              
              <div className="flex gap-3">
                <Link 
                  to={`/vehicule/${vehicle.id}`}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Voir détails
                </Link>
                <button className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Badge */}
      {vehicle.clearance && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            CLEARANCE
          </span>
        </div>
      )}
      
      {/* Image */}
      <div className="h-56 bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center relative">
        <div className="text-8xl">{vehicle.image}</div>
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Title & Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">{vehicle.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{vehicle.brand} • {vehicle.type}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FaCalendar className="w-4 h-4" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>{vehicle.location}</span>
            </div>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <FaStar className="w-4 h-4 text-yellow-500" />
            <span className="ml-1 font-medium">{vehicle.rating}</span>
          </div>
          <span className="text-gray-500 text-sm">(24 avis)</span>
        </div>
        
        {/* Price */}
        <div className="mb-6">
          <div className="text-2xl font-bold text-orange-500">
            {vehicle.price.toLocaleString()} €
          </div>
          {vehicle.oldPrice && (
            <div className="text-gray-400 line-through text-sm">
              {vehicle.oldPrice.toLocaleString()} €
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <Link 
            to={`/vehicule/${vehicle.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Voir détails
          </Link>
          <button className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Panier
          </button>
        </div>
      </div>
    </div>
  )
}

export default VehicleCard