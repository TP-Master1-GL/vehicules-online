import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaMapMarkerAlt, FaGasPump, FaCog, FaTachometerAlt, FaCalendar, FaTag, FaBolt, FaFire, FaPercent, FaNewspaper } from 'react-icons/fa'

const VehicleCard = ({ vehicle, layout = 'grid', onAddToCart }) => {
  const [imageError, setImageError] = useState(false)
  
  // Gérer l'erreur d'image
  const handleImageError = (e) => {
    console.error('❌ VehicleCard: Erreur image', vehicle?.image || vehicle?.imageUrl)
    setImageError(true)
    e.target.src = 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop'
  }
  
  // Obtenir la source de l'image
  const getImageSrc = () => {
    if (imageError) {
      return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop'
    }
    return vehicle?.image || vehicle?.imageUrl || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop'
  }
  
  // Obtenir le badge selon les propriétés
  const getBadge = () => {
    if (vehicle?.clearance) return { text: "CLEARANCE", color: "bg-red-500", icon: <FaTag /> }
    if (vehicle?.nouveau) return { text: "NOUVEAU", color: "bg-blue-500", icon: <FaNewspaper /> }
    if (vehicle?.enSolde) return { text: `-${vehicle.pourcentageSolde || 10}%`, color: "bg-red-500", icon: <FaPercent /> }
    if (vehicle?.populaire) return { text: "POPULAIRE", color: "bg-orange-500", icon: <FaFire /> }
    if (vehicle?.electrique) return { text: "ÉLECTRIQUE", color: "bg-green-500", icon: <FaBolt /> }
    return null
  }
  
  // Formater le prix
  const formatPrice = (price) => {
    if (!price) return '0 €'
    return new Intl.NumberFormat('fr-FR').format(price) + ' €'
  }
  
  // DEBUG
  console.log('🎴 VehicleCard reçu:', {
    id: vehicle?.id,
    name: vehicle?.name,
    image: vehicle?.image,
    imageUrl: vehicle?.imageUrl,
    hasImage: !!vehicle?.image || !!vehicle?.imageUrl
  })
  
  if (layout === 'list') {
    const badge = getBadge()
    
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
        <div className="flex gap-6">
          {/* Image CORRIGÉE */}
          <div className="w-64 h-48 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg overflow-hidden relative">
            <img 
              src={getImageSrc()}
              alt={vehicle?.name || 'Véhicule'}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
              onLoad={() => console.log('✅ VehicleCard list: Image chargée', getImageSrc())}
            />
            
            {badge && (
              <div className="absolute top-3 left-3 z-10">
                <span className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
                  {badge.icon}
                  {badge.text}
                </span>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{vehicle?.name || 'Nom non disponible'}</h3>
                </div>
                <p className="text-gray-600 mb-4">{vehicle?.brand || ''} • {vehicle?.type || ''} • {vehicle?.year || ''}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {vehicle?.km && (
                    <div className="flex items-center gap-1">
                      <FaTachometerAlt className="w-4 h-4" />
                      <span>{vehicle.km.toLocaleString()} km</span>
                    </div>
                  )}
                  {vehicle?.fuel && (
                    <div className="flex items-center gap-1">
                      <FaGasPump className="w-4 h-4" />
                      <span>{vehicle.fuel}</span>
                    </div>
                  )}
                  {vehicle?.transmission && (
                    <div className="flex items-center gap-1">
                      <FaCog className="w-4 h-4" />
                      <span>{vehicle.transmission}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Price */}
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {formatPrice(vehicle?.price || vehicle?.prix)}
                </div>
                {vehicle?.oldPrice && (
                  <div className="text-gray-400 line-through">
                    {formatPrice(vehicle.oldPrice)}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                  <FaMapMarkerAlt className="w-3 h-3" />
                  <span>{vehicle?.location || 'Douala'}</span>
                </div>
              </div>
            </div>
            
            {/* Features & Actions */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {vehicle?.rating && (
                  <>
                    <div className="flex items-center">
                      <FaStar className="w-4 h-4 text-yellow-500" />
                      <span className="ml-1 font-medium">{vehicle.rating}</span>
                    </div>
                    <span className="text-gray-500">(24 avis)</span>
                  </>
                )}
              </div>
              
              <div className="flex gap-3">
                <Link 
                  to={`/vehicule/${vehicle?.id}`}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Voir détails
                </Link>
                <button
                  onClick={() => onAddToCart?.(vehicle)}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Layout grid (par défaut)
  const badge = getBadge()
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
            {badge.icon}
            {badge.text}
          </span>
        </div>
      )}
      
      {/* Image CORRIGÉE */}
      <div className="h-56 bg-gradient-to-br from-blue-50 to-gray-100 relative overflow-hidden">
        <img 
          src={getImageSrc()}
          alt={vehicle?.name || 'Véhicule'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
          onLoad={() => console.log('✅ VehicleCard grid: Image chargée', getImageSrc())}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Title & Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2 line-clamp-1">{vehicle?.name || 'Nom non disponible'}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-1">
            {vehicle?.brand || ''} • {vehicle?.type || ''}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            {vehicle?.year && (
              <div className="flex items-center gap-1">
                <FaCalendar className="w-4 h-4" />
                <span>{vehicle.year}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>{vehicle?.location || 'Douala'}</span>
            </div>
          </div>
        </div>
        
        {/* Rating */}
        {vehicle?.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <FaStar className="w-4 h-4 text-yellow-500" />
              <span className="ml-1 font-medium">{vehicle.rating}</span>
            </div>
            <span className="text-gray-500 text-sm">(24 avis)</span>
          </div>
        )}
        
        {/* Price */}
        <div className="mb-6">
          <div className="text-2xl font-bold text-orange-500">
            {formatPrice(vehicle?.price || vehicle?.prix)}
          </div>
          {vehicle?.oldPrice && (
            <div className="text-gray-400 line-through text-sm">
              {formatPrice(vehicle.oldPrice)}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <Link 
            to={`/vehicule/${vehicle?.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Voir détails
          </Link>
          <button
            onClick={() => onAddToCart?.(vehicle)}
            className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Panier
          </button>
        </div>
      </div>
    </div>
  )
}

export default VehicleCard