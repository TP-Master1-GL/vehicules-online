import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FaCar, FaCog, FaGasPump, FaCalendar, 
  FaTachometerAlt, FaUsers, FaShieldAlt,
  FaTag, FaStar, FaMapMarkerAlt, FaShoppingCart,
  FaHeart, FaShareAlt, FaExchangeAlt, FaCreditCard
} from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import vehiculesService from '../api/vehicules'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Tabs from '../components/ui/Tabs'
import toast from 'react-hot-toast'

const VehicleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  
  useEffect(() => {
    fetchVehicle()
  }, [id])
  
  const fetchVehicle = async () => {
    try {
      setLoading(true)
      // Utiliser le vrai service API
      const vehicleData = await vehiculesService.getVehiculeById(id)

      // Adapter le format du backend au format frontend
      const formattedVehicle = {
        id: vehicleData.id,
        name: vehicleData.nom,
        brand: vehicleData.marque,
        model: vehicleData.nom.split(' ')[1] || vehicleData.nom, // Extraire le modèle
        type: vehicleData.typeVehicule,
        year: vehicleData.annee,
        price: vehicleData.prix,
        oldPrice: vehicleData.prixPromotion || null,
        clearance: vehicleData.enSoldes || false,
        rating: 4.5, // Valeur par défaut
        location: vehicleData.localisation || "Douala",
        fuel: vehicleData.typeCarburant,
        transmission: vehicleData.transmission || "Automatique",
        km: vehicleData.kilometrage || 0,
        promo: vehicleData.enPromotion || false,
        description: vehicleData.description || `Véhicule ${vehicleData.nom} en excellent état.`,
        features: vehicleData.options?.map(opt => opt.nom) || [],
        images: vehicleData.images || [`https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop`],
        warranty: "2 ans",
        financing: true,
        tradeIn: true
      }

      setVehicle(formattedVehicle)
    } catch (error) {
      toast.error('Erreur lors du chargement du véhicule')
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/vehicule/${id}` } })
      return
    }
    
    addToCart(vehicle, selectedOptions, 1)
    toast.success('Véhicule ajouté au panier')
  }
  
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/vehicule/${id}` } })
      return
    }
    
    addToCart(vehicle, selectedOptions, 1)
    navigate('/checkout')
  }
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris')
  }
  
  const handleOptionToggle = (option) => {
    setSelectedOptions(prev => {
      const isSelected = prev.find(o => o.id === option.id)
      if (isSelected) {
        return prev.filter(o => o.id !== option.id)
      } else {
        return [...prev, option]
      }
    })
  }
  
  const calculateOptionsTotal = () => {
    return selectedOptions.reduce((total, option) => total + option.price, 0)
  }
  
  const calculateTotalPrice = () => {
    return (vehicle?.price || 0) + calculateOptionsTotal()
  }
  
  if (loading) {
    return (
      <div className="section bg-white">
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!vehicle) {
    return (
      <div className="section bg-white">
        <div className="container">
          <Alert variant="error" title="Véhicule non trouvé">
            Le véhicule que vous cherchez n'existe pas ou a été supprimé.
          </Alert>
          <div className="mt-6">
            <Button onClick={() => navigate('/catalogue')}>
              Retour au catalogue
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  const tabs = [
    {
      label: 'Description',
      content: (
        <div className="space-y-6">
          <p className="text-primary-gray">{vehicle.description}</p>
          
          <div>
            <h4 className="font-bold mb-4">Caractéristiques principales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <FaCheck className="w-4 h-4 text-primary-orange mr-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Options',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicle.options?.map(option => {
              const isSelected = selectedOptions.find(o => o.id === option.id)
              
              return (
                <div
                  key={option.id}
                  onClick={() => handleOptionToggle(option)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-orange bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">{option.name}</h5>
                      <p className="text-sm text-primary-gray">{option.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary-orange">
                        +{option.price.toLocaleString()} €
                      </span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-primary-orange bg-primary-orange' : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {selectedOptions.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold mb-4">Options sélectionnées</h4>
              <div className="space-y-3">
                {selectedOptions.map(option => (
                  <div key={option.id} className="flex justify-between">
                    <span>{option.name}</span>
                    <span className="font-bold">+{option.price.toLocaleString()} €</span>
                  </div>
                ))}
                <div className="border-t pt-3 font-bold">
                  <div className="flex justify-between">
                    <span>Total options</span>
                    <span>+{calculateOptionsTotal().toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Vendeur',
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <FaCar className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">{vehicle.seller.name}</h4>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <FaStar className="w-5 h-5 text-yellow-500" />
                  <span className="ml-1 font-bold">{vehicle.seller.rating}</span>
                </div>
                <span className="text-primary-gray">({vehicle.seller.sales} ventes)</span>
              </div>
              <p className="text-primary-gray">
                Membre depuis {vehicle.seller.memberSince}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-orange mb-2">98%</div>
              <div className="text-sm text-primary-gray">Clients satisfaits</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-orange mb-2">24h</div>
              <div className="text-sm text-primary-gray">Réponse moyenne</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-orange mb-2">500+</div>
              <div className="text-sm text-primary-gray">Véhicules vendus</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-orange mb-2">5 ans</div>
              <div className="text-sm text-primary-gray">Garantie offerte</div>
            </div>
          </div>
        </div>
      )
    }
  ]
  
  return (
    <div className="section bg-white">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm text-primary-gray">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-primary-dark">
                Accueil
              </button>
            </li>
            <li className="mx-2">/</li>
            <li>
              <button onClick={() => navigate('/catalogue')} className="hover:text-primary-dark">
                Catalogue
              </button>
            </li>
            <li className="mx-2">/</li>
            <li className="text-primary-dark font-medium">
              {vehicle.name}
            </li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Actions */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl h-96 flex items-center justify-center mb-6">
              <div className="text-8xl">{vehicle.images[activeImage]}</div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 mb-8">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-lg flex items-center justify-center text-2xl ${
                    activeImage === index
                      ? 'ring-2 ring-primary-orange bg-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {image}
                </button>
              ))}
            </div>
            
            {/* Tabs */}
            <div className="mb-8">
              <Tabs tabs={tabs} />
            </div>
            
            {/* Similar Vehicles */}
            <div>
              <h3 className="text-xl font-bold mb-6">Véhicules similaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vehicle.similarVehicles.map(similar => (
                  <div
                    key={similar.id}
                    className="card p-4 hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => navigate(`/vehicule/${similar.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                        <div className="text-3xl">🚗</div>
                      </div>
                      <div>
                        <h4 className="font-bold">{similar.name}</h4>
                        <p className="text-sm text-primary-gray">{similar.type}</p>
                        <p className="font-bold text-primary-orange">
                          {similar.price.toLocaleString()} €
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Details & Actions */}
          <div>
            <div className="card sticky top-6">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{vehicle.name}</h1>
                    <p className="text-primary-gray">{vehicle.brand} {vehicle.model} • {vehicle.year}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-2 rounded-full ${
                        isFavorite
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaHeart className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                      <FaShareAlt className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Rating & Location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <FaStar className="w-5 h-5 text-yellow-500" />
                      <span className="ml-1 font-bold">{vehicle.rating}</span>
                    </div>
                    <span className="text-primary-gray">(24 avis)</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-gray">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    <span>{vehicle.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Price */}
              <div className="p-6 border-b border-gray-200">
                <div className="mb-4">
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-bold text-primary-orange">
                      {calculateTotalPrice().toLocaleString()} €
                    </div>
                    {vehicle.oldPrice && (
                      <div className="text-lg text-gray-400 line-through">
                        {vehicle.oldPrice.toLocaleString()} €
                      </div>
                    )}
                  </div>
                  
                  {vehicle.clearance && (
                    <div className="flex items-center gap-2 mt-2">
                      <FaTag className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 font-bold">
                        -{Math.round(((vehicle.oldPrice - vehicle.price) / vehicle.oldPrice) * 100)}% PROMOTION
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Financement */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Financement</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Simuler
                    </button>
                  </div>
                  <p className="text-sm text-primary-gray">
                    À partir de 450 €/mois sur 60 mois
                  </p>
                </div>
              </div>
              
              {/* Specifications */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold mb-4">Spécifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <FaTachometerAlt className="w-5 h-5 text-primary-gray" />
                    <div>
                      <div className="text-sm text-primary-gray">Kilométrage</div>
                      <div className="font-medium">{vehicle.km.toLocaleString()} km</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FaGasPump className="w-5 h-5 text-primary-gray" />
                    <div>
                      <div className="text-sm text-primary-gray">Carburant</div>
                      <div className="font-medium">{vehicle.fuel}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FaCog className="w-5 h-5 text-primary-gray" />
                    <div>
                      <div className="text-sm text-primary-gray">Transmission</div>
                      <div className="font-medium">{vehicle.transmission}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FaUsers className="w-5 h-5 text-primary-gray" />
                    <div>
                      <div className="text-sm text-primary-gray">Places</div>
                      <div className="font-medium">{vehicle.seats} places</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FaCalendar className="w-5 h-5 text-primary-gray" />
                    <div>
                      <div className="text-sm text-primary-gray">Année</div>
                      <div className="font-medium">{vehicle.year}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="w-5 h-5 text-primary-gray" />
                    <div>
                      <div className="text-sm text-primary-gray">Garantie</div>
                      <div className="font-medium">{vehicle.warranty}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="p-6">
                <div className="space-y-3">
                  <Button
                    onClick={handleBuyNow}
                    fullWidth
                    size="lg"
                    className="text-lg"
                  >
                    <FaShoppingCart className="mr-2" />
                    Acheter maintenant
                  </Button>
                  
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    fullWidth
                    size="lg"
                  >
                    Ajouter au panier
                  </Button>
                  
                  <Button
                    variant="ghost"
                    fullWidth
                    icon={FaExchangeAlt}
                    iconPosition="left"
                  >
                    Comparer
                  </Button>
                </div>
                
                {/* Assurance */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="w-6 h-6 text-primary-orange" />
                    <div>
                      <div className="font-medium">Garantie ZAMBA+ incluse</div>
                      <div className="text-sm text-primary-gray">
                        12 mois garantie tous risques
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetail