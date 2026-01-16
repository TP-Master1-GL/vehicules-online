import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FaCar, FaCog, FaGasPump, FaCalendar, 
  FaTachometerAlt, FaUsers, FaShieldAlt,
  FaTag, FaStar, FaMapMarkerAlt, FaShoppingCart,
  FaHeart, FaShareAlt, FaExchangeAlt, FaCreditCard,
  FaCheck, FaBolt, FaFire, FaNewspaper, FaPercent,
  FaImage, FaSync, FaPhone, FaWhatsapp, FaEnvelope,
  FaStarHalfAlt, FaStar as FaStarSolid
} from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import vehiculesService from '../api/vehicules'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Tabs from '../components/ui/Tabs'
import toast from 'react-hot-toast'
import VehicleAnimation from '../components/ui/VehicleAnimation'

const VehicleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [similarVehicles, setSimilarVehicles] = useState([])
  const [showAllImages, setShowAllImages] = useState(false)
  const [decoratedText, setDecoratedText] = useState('')
  
  useEffect(() => {
    fetchVehicle()
    fetchSimilarVehicles()
  }, [id])
  
  const fetchVehicle = async () => {
    try {
      setLoading(true)
      
      // Récupérer le véhicule avec tous les décorateurs
      let vehicleData
      try {
        // Essayer d'abord la version avec tous les décorateurs
        vehicleData = await vehiculesService.getVehiculeAvecDecorateurs(id)
        setDecoratedText(vehicleData.descriptionComplete)
      } catch (error) {
        console.log('Fallback: récupération véhicule simple', error)
        vehicleData = await vehiculesService.getVehiculeById(id)
      }

      // Formater le véhicule pour le frontend
      const formattedVehicle = {
        // Informations de base
        id: vehicleData.id,
        name: vehicleData.nom || `${vehicleData.marque} ${vehicleData.modele}`,
        brand: vehicleData.marque,
        model: vehicleData.modele,
        type: vehicleData.typeVehicule,
        typeVehicule: vehicleData.typeVehicule,
        energie: vehicleData.energie || vehicleData.typeCarburant,
        
        // Année et caractéristiques
        year: vehicleData.annee || new Date().getFullYear() - (vehicleData.id % 5),
        km: vehicleData.kilometrage || 10000 + (vehicleData.id % 10) * 5000,
        transmission: vehicleData.transmission || "Automatique",
        seats: vehicleData.nbPlaces || 5,
        
        // Prix et promotions
        price: vehicleData.prixFinal || vehicleData.prix || 0,
        oldPrice: vehicleData.prixBase,
        prixBase: vehicleData.prixBase,
        prixFinal: vehicleData.prixFinal,
        enSolde: vehicleData.enSolde || false,
        nouveau: vehicleData.nouveau || false,
        populaire: vehicleData.populaire || false,
        electrique: vehicleData.electrique || false,
        avecOptions: vehicleData.avecOptions || false,
        pourcentageSolde: vehicleData.pourcentageSolde,
        
        // Description
        description: vehicleData.description || `Véhicule ${vehicleData.marque} ${vehicleData.modele} en excellent état.`,
        descriptionComplete: vehicleData.descriptionComplete || '',
        
        // Caractéristiques et options
        features: vehicleData.options?.map(opt => opt.nom) || [
          'Climatisation automatique',
          'Système audio premium',
          'Caméra de recul',
          'Régulateur de vitesse',
          'Vitres électriques',
          'Toit ouvrant'
        ].slice(0, 6 - (vehicleData.id % 3)),
        
        options: vehicleData.options || [
          { id: 1, name: 'Pack sécurité plus', category: 'Sécurité', price: 1200000 },
          { id: 2, name: 'Système audio haut de gamme', category: 'Confort', price: 800000 },
          { id: 3, name: 'Jantes alliage 18"', category: 'Esthétique', price: 1500000 },
          { id: 4, name: 'Toit panoramique', category: 'Confort', price: 2000000 },
          { id: 5, name: 'Siège chauffant', category: 'Confort', price: 700000 },
          { id: 6, name: 'Peinture métallisée', category: 'Esthétique', price: 900000 }
        ],
        
        // Images
        images: vehicleData.images || [],
        imageUrl: vehicleData.imageUrl || vehicleData.mainImageUrl,
        mainImageUrl: vehicleData.mainImageUrl,
        thumbnailUrl: vehicleData.thumbnailUrl,
        additionalImages: vehicleData.additionalImages || [],
        
        // Informations vendeur
        seller: {
          name: "AutoCenter Douala",
          rating: 4.8,
          sales: 150,
          memberSince: "2018",
          phone: "+237 6XX XX XX XX",
          email: "contact@autocenter-cm.com",
          location: "Douala, Bonapriso",
          responseTime: "Moins de 2h"
        },
        
        // Garanties et services
        warranty: vehicleData.garantie || "2 ans",
        financing: true,
        tradeIn: true,
        assurance: true,
        
        // Localisation
        location: vehicleData.localisation || "Douala, Cameroun",
        
        // Animation
        hasAnimation: vehicleData.hasAnimation !== false,
        animationType: vehicleData.electrique ? "electric" : 
                      vehicleData.typeVehicule === 'SCOOTER' ? "scooter" : "gas"
      }

      // Si pas d'images, ajouter des images par défaut
      if (!formattedVehicle.images || formattedVehicle.images.length === 0) {
        formattedVehicle.images = [
          {
            id: 1,
            fileUrl: `https://images.unsplash.com/photo-${1553440569 + (id % 100)}-bcc63803a83d?w=1200&h=800&fit=crop`,
            thumbnailUrl: `https://images.unsplash.com/photo-${1553440569 + (id % 100)}-bcc63803a83d?w=400&h=300&fit=crop`,
            isMain: true,
            alt: `Véhicule ${formattedVehicle.name} - Vue principale`
          },
          {
            id: 2,
            fileUrl: `https://images.unsplash.com/photo-${1549399542 + (id % 100)}-7e3f8b79c341?w=1200&h=800&fit=crop`,
            thumbnailUrl: `https://images.unsplash.com/photo-${1549399542 + (id % 100)}-7e3f8b79c341?w=400&h=300&fit=crop`,
            isMain: false,
            alt: `Véhicule ${formattedVehicle.name} - Intérieur`
          },
          {
            id: 3,
            fileUrl: `https://images.unsplash.com/photo-${1563720223 + (id % 100)}-1ae5f6c7b2d1?w=1200&h=800&fit=crop`,
            thumbnailUrl: `https://images.unsplash.com/photo-${1563720223 + (id % 100)}-1ae5f6c7b2d1?w=400&h=300&fit=crop`,
            isMain: false,
            alt: `Véhicule ${formattedVehicle.name} - Moteur`
          }
        ]
      }

      setVehicle(formattedVehicle)
      
    } catch (error) {
      console.error('❌ Erreur récupération véhicule:', error)
      toast.error('Erreur lors du chargement du véhicule')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchSimilarVehicles = async () => {
    try {
      // Récupérer des véhicules similaires (nouveautés ou en solde)
      let similarData = []
      try {
        similarData = await vehiculesService.getNouveautes()
      } catch (error) {
        similarData = await vehiculesService.getCatalogueUneLigne()
      }
      
      // Filtrer pour exclure le véhicule actuel et limiter à 3
      const filteredSimilar = similarData
        .filter(v => v.id != id)
        .slice(0, 3)
        .map(v => ({
          id: v.id,
          name: v.nom || `${v.marque} ${v.modele}`,
          type: v.typeVehicule,
          price: v.prixFinal || v.prix,
          image: v.imageUrl || v.images?.[0]?.fileUrl,
          brand: v.marque,
          enSolde: v.enSolde,
          nouveau: v.nouveau
        }))
      
      setSimilarVehicles(filteredSimilar)
    } catch (error) {
      console.error('Erreur récupération véhicules similaires:', error)
    }
  }
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/vehicule/${id}` } })
      return
    }
    
    addToCart({
      ...vehicle,
      options: selectedOptions,
      totalPrice: calculateTotalPrice()
    })
    
    toast.success('Véhicule ajouté au panier !', {
      icon: '🛒',
      duration: 3000
    })
  }
  
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/vehicule/${id}` } })
      return
    }
    
    addToCart({
      ...vehicle,
      options: selectedOptions,
      totalPrice: calculateTotalPrice()
    })
    
    navigate('/checkout')
  }
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(
      isFavorite ? 'Retiré des favoris ❤️' : 'Ajouté aux favoris 💝',
      {
        duration: 2000
      }
    )
    
    // Simuler un appel API
    if (!isFavorite) {
      // Enregistrer dans localStorage
      const favorites = JSON.parse(localStorage.getItem('vehicle_favorites') || '[]')
      favorites.push(vehicle.id)
      localStorage.setItem('vehicle_favorites', JSON.stringify(favorites))
    } else {
      // Retirer du localStorage
      const favorites = JSON.parse(localStorage.getItem('vehicle_favorites') || '[]')
      localStorage.setItem('vehicle_favorites', 
        JSON.stringify(favorites.filter(favId => favId !== vehicle.id))
      )
    }
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle.name,
        text: `Découvrez ce véhicule: ${vehicle.name}`,
        url: window.location.href,
      })
      .then(() => toast.success('Partagé avec succès! 📤'))
      .catch(error => console.log('Erreur partage:', error))
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié dans le presse-papier! 📋')
    }
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
    return selectedOptions.reduce((total, option) => total + (option.price || 0), 0)
  }
  
  const calculateTotalPrice = () => {
    return (vehicle?.price || 0) + calculateOptionsTotal()
  }
  
  const formatPrice = (price) => {
    if (!price) return '0 FCFA'
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }
  
  const getBadgeInfo = () => {
    if (vehicle.nouveau) return { text: "Nouveau", icon: <FaNewspaper />, color: 'bg-blue-500' }
    if (vehicle.enSolde) return { 
      text: `-${vehicle.pourcentageSolde || 10}%`, 
      icon: <FaPercent />, 
      color: 'bg-red-500' 
    }
    if (vehicle.populaire) return { text: "Populaire", icon: <FaFire />, color: 'bg-orange-500' }
    if (vehicle.electrique) return { text: "Électrique", icon: <FaBolt />, color: 'bg-green-500' }
    return null
  }
  
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStarSolid key={`full-${i}`} className="w-4 h-4 text-yellow-500" />)
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="w-4 h-4 text-yellow-500" />)
    }
    
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }
    
    return stars
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500 mb-6"></div>
            <p className="text-gray-600 text-lg font-medium">Chargement du véhicule...</p>
            <p className="text-gray-500 text-sm mt-2">
              Application des décorateurs et chargement des images
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <Alert 
            variant="error" 
            title="Véhicule non trouvé"
            className="max-w-2xl mx-auto"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Le véhicule que vous cherchez n'existe pas ou a été supprimé.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate('/catalogue')}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  Retour au catalogue
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                >
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          </Alert>
        </div>
      </div>
    )
  }
  
  const badgeInfo = getBadgeInfo()
  const tabs = [
    {
      label: 'Description détaillée',
      icon: <FaCar className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Description décorée */}
          {decoratedText && (
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎨</span>
                <h4 className="font-bold text-gray-800">Affichage avec décorateurs</h4>
              </div>
              <p className="text-gray-700 font-medium">
                {decoratedText}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <span className="font-medium">Pattern utilisé:</span> Decorator
              </div>
            </div>
          )}
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">Description</h4>
            <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">Caractéristiques principales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaCheck className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {vehicle.avecOptions && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚙️</span>
                <h4 className="font-bold text-gray-800">Options incluses</h4>
              </div>
              <p className="text-gray-600">
                Ce véhicule inclut des options supplémentaires. Consultez l'onglet "Options" pour plus de détails.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Options & Accessoires',
      icon: <FaCog className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">Personnalisez votre véhicule</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {vehicle.options?.map(option => {
                const isSelected = selectedOptions.find(o => o.id === option.id)
                
                return (
                  <div
                    key={option.id}
                    onClick={() => handleOptionToggle(option)}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`p-2 rounded-full ${isSelected ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <FaCog className="w-4 h-4" />
                          </span>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {option.category}
                          </span>
                        </div>
                        <h5 className="font-bold text-gray-800 mb-1">{option.name}</h5>
                        <p className="text-sm text-gray-500 mb-4">
                          Améliorez votre expérience de conduite avec cette option exclusive.
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-orange-500 text-lg">
                          +{formatPrice(option.price)}
                        </span>
                        <div className={`mt-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {selectedOptions.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-lg mb-4 text-gray-800">Options sélectionnées</h4>
              <div className="space-y-3">
                {selectedOptions.map(option => (
                  <div key={option.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <span className="font-medium text-gray-700">{option.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({option.category})</span>
                    </div>
                    <span className="font-bold text-orange-500">+{formatPrice(option.price)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-4 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total options</span>
                    <span className="text-orange-600">+{formatPrice(calculateOptionsTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Vendeur & Garantie',
      icon: <FaShieldAlt className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Informations vendeur */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <FaCar className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{vehicle.seller.name}</h4>
                <div className="flex items-center gap-4 mb-3 flex-wrap">
                  <div className="flex items-center">
                    {renderStars(vehicle.seller.rating)}
                    <span className="ml-2 font-bold text-gray-700">{vehicle.seller.rating}</span>
                    <span className="ml-1 text-gray-500">({vehicle.seller.sales} ventes)</span>
                  </div>
                  <span className="text-primary-gray">
                    Membre depuis {vehicle.seller.memberSince}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{vehicle.seller.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaSync className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Réponse: {vehicle.seller.responseTime}</span>
                  </div>
                </div>
                
                {/* Boutons contact */}
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <FaWhatsapp className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FaPhone className="w-4 h-4" />
                    Appeler
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <FaEnvelope className="w-4 h-4" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Statistiques vendeur */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-2">24h</div>
              <div className="text-sm text-gray-600">Réponse</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-2">{vehicle.seller.sales}+</div>
              <div className="text-sm text-gray-600">Véhicules vendus</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
              <div className="text-2xl font-bold text-purple-600 mb-2">{vehicle.warranty}</div>
              <div className="text-sm text-gray-600">Garantie</div>
            </div>
          </div>
          
          {/* Garanties */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-lg mb-4 text-gray-800">Nos garanties incluses</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaShieldAlt className="w-6 h-6 text-green-600" />
                  </div>
                  <h5 className="font-bold text-gray-800">Garantie véhicule</h5>
                </div>
                <p className="text-sm text-gray-600">
                  {vehicle.warranty} garantie pièces et main d'œuvre
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h5 className="font-bold text-gray-800">Contrôle qualité</h5>
                </div>
                <p className="text-sm text-gray-600">
                  152 points de contrôle avant livraison
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FaExchangeAlt className="w-6 h-6 text-orange-600" />
                  </div>
                  <h5 className="font-bold text-gray-800">Reprise facilitée</h5>
                </div>
                <p className="text-sm text-gray-600">
                  Reprise de votre ancien véhicule possible
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]
  
  const displayedImages = showAllImages 
    ? vehicle.images 
    : vehicle.images.slice(0, 5)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm text-gray-600 flex-wrap">
            <li>
              <button 
                onClick={() => navigate('/')} 
                className="hover:text-orange-600 transition-colors"
              >
                Accueil
              </button>
            </li>
            <li className="mx-2">›</li>
            <li>
              <button 
                onClick={() => navigate('/catalogue')} 
                className="hover:text-orange-600 transition-colors"
              >
                Catalogue
              </button>
            </li>
            <li className="mx-2">›</li>
            <li className="text-gray-800 font-medium truncate max-w-xs">
              {vehicle.name}
            </li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Contenu */}
          <div className="lg:col-span-2">
            {/* Header avec badge et animation */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{vehicle.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-gray-600">{vehicle.brand} • {vehicle.typeVehicule}</span>
                  {badgeInfo && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${badgeInfo.color} text-white flex items-center gap-1`}>
                      {badgeInfo.icon}
                      {badgeInfo.text}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{vehicle.location}</span>
                  </span>
                </div>
              </div>
              
              {/* Animation du véhicule */}
              {vehicle.hasAnimation && (
                <div className="hidden lg:block">
                  <VehicleAnimation
                    vehicle={vehicle}
                    type={vehicle.animationType}
                    isVisible={true}
                    size="medium"
                  />
                </div>
              )}
            </div>
            
            {/* Main Image */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden h-[400px] mb-6 group">
              {vehicle.images[activeImage] ? (
                <img
                  src={vehicle.images[activeImage].fileUrl || vehicle.images[activeImage]}
                  alt={vehicle.images[activeImage].alt || vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&h=800&fit=crop"
                    e.target.className = "w-full h-full object-cover"
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <FaImage className="text-gray-400 text-6xl mb-4" />
                  <p className="text-gray-500">Image non disponible</p>
                </div>
              )}
              
              {/* Boutons sur l'image */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                    isFavorite
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <FaHeart className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-all"
                >
                  <FaShareAlt className="w-5 h-5" />
                </button>
              </div>
              
              {badgeInfo && (
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full font-bold ${badgeInfo.color} text-white flex items-center gap-2 shadow-lg`}>
                    {badgeInfo.icon}
                    {badgeInfo.text}
                  </span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
              {displayedImages.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={() => setActiveImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all ${
                    activeImage === index
                      ? 'ring-3 ring-orange-500 ring-offset-2 scale-105'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={image.thumbnailUrl || image.fileUrl || image}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              
              {!showAllImages && vehicle.images.length > 5 && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="flex-shrink-0 w-24 h-24 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-all"
                >
                  <span className="text-2xl">+{vehicle.images.length - 5}</span>
                  <span className="text-xs mt-1 text-gray-600">Voir plus</span>
                </button>
              )}
            </div>
            
            {/* Tabs */}
            <div className="mb-8">
              <Tabs tabs={tabs} />
            </div>
            
            {/* Véhicules similaires */}
            {similarVehicles.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-800">🚗 Véhicules similaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {similarVehicles.map(similar => (
                    <div
                      key={similar.id}
                      onClick={() => navigate(`/vehicule/${similar.id}`)}
                      className="bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-orange-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          {similar.image ? (
                            <img 
                              src={similar.image} 
                              alt={similar.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <FaCar className="w-10 h-10 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                            {similar.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">{similar.brand} • {similar.type}</p>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-orange-500">
                              {formatPrice(similar.price)}
                            </p>
                            {(similar.enSolde || similar.nouveau) && (
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                similar.nouveau ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                              }`}>
                                {similar.nouveau ? 'Nouveau' : 'Promo'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Informations & Actions */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* En-tête avec prix */}
              <div className="p-6 border-b border-gray-200">
                <div className="mb-4">
                  <div className="flex items-end gap-3 mb-2">
                    <div className="text-3xl font-bold text-orange-600">
                      {formatPrice(calculateTotalPrice())}
                    </div>
                    {vehicle.oldPrice && vehicle.oldPrice > vehicle.price && (
                      <div className="text-lg text-gray-400 line-through">
                        {formatPrice(vehicle.oldPrice)}
                      </div>
                    )}
                  </div>
                  
                  {vehicle.enSolde && (
                    <div className="flex items-center gap-2">
                      <FaTag className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 font-bold">
                        Économisez {formatPrice(vehicle.oldPrice - vehicle.price)} !
                      </span>
                    </div>
                  )}
                  
                  {selectedOptions.length > 0 && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Inclut {selectedOptions.length} option(s)</span>
                    </div>
                  )}
                </div>
                
                {/* Financement */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-800">Financement disponible</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Simuler
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    À partir de {formatPrice(Math.round(calculateTotalPrice() / 60))}/mois sur 60 mois
                  </p>
                </div>
              </div>
              
              {/* Spécifications */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold mb-4 text-gray-800">📋 Spécifications techniques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaTachometerAlt className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Kilométrage</div>
                      <div className="font-medium">{vehicle.km.toLocaleString()} km</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaGasPump className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Carburant</div>
                      <div className="font-medium">{vehicle.energie}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaCog className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Transmission</div>
                      <div className="font-medium">{vehicle.transmission}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaUsers className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Places</div>
                      <div className="font-medium">{vehicle.seats} places</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaCalendar className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Année</div>
                      <div className="font-medium">{vehicle.year}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaShieldAlt className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Garantie</div>
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
                    className="text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                  >
                    <FaShoppingCart className="mr-3" />
                    Acheter maintenant
                  </Button>
                  
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    fullWidth
                    size="lg"
                    className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    Ajouter au panier
                  </Button>
                  
                  <Button
                    variant="ghost"
                    fullWidth
                    icon={FaExchangeAlt}
                    iconPosition="left"
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    Comparer avec d'autres
                  </Button>
                </div>
                
                {/* Garantie ZAMBA+ */}
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaShieldAlt className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">Garantie ZAMBA+ incluse</div>
                      <div className="text-sm text-gray-600">
                        {vehicle.warranty} tous risques + assistance 24h/24
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Options sélectionnées (mini récap) */}
                {selectedOptions.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Options ajoutées ({selectedOptions.length})
                    </div>
                    <div className="space-y-1">
                      {selectedOptions.map(option => (
                        <div key={option.id} className="flex justify-between text-sm">
                          <span className="text-gray-600 truncate">{option.name}</span>
                          <span className="font-medium text-orange-500">
                            +{formatPrice(option.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Information patterns */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <span className="font-bold text-gray-800">Patterns utilisés</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• <span className="font-medium">Decorator</span>: Affichage enrichi</div>
                <div>• <span className="font-medium">Observer</span>: Mises à jour temps réel</div>
                <div>• <span className="font-medium">Strategy</span>: Calcul des prix</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action final */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Intéressé par ce véhicule ?</h3>
              <p className="opacity-90">
                Contactez-nous pour une visite d'essai ou une offre personnalisée
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/contact')}
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                Prendre rendez-vous
              </Button>
              <Button 
                onClick={() => window.location.href = `tel:${vehicle.seller.phone}`}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <FaPhone className="mr-2" />
                Nous appeler
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetail