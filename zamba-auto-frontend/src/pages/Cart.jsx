import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import {
  FaTrash, FaUndo, FaPlus, FaMinus, FaShoppingCart,
  FaCreditCard, FaTruck, FaShieldAlt, FaArrowLeft,
  FaCog, FaTag, FaSyncAlt, FaImage, FaCar, FaGasPump,
  FaCalendarAlt, FaBolt, FaIndustry
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import vehiculesService from '../api/vehicules'

const Cart = () => {
  const {
    cart,
    total,
    loading,
    removeFromCart,
    updateQuantity,
    clearCart,
    undoLastAction,
    fetchCart,
    syncCart,
    getCartCount,
    isEmpty,
    itemCount
  } = useCart()
  
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [syncStatus, setSyncStatus] = useState('idle')
  const [vehicleDetails, setVehicleDetails] = useState({}) // Cache pour les détails des véhicules

  // Charger le panier au chargement de la page
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour accéder à votre panier')
      navigate('/login', { state: { from: '/panier' } })
    } else {
      loadCart()
    }
  }, [isAuthenticated, navigate])

  const loadCart = async () => {
    try {
      if (isAuthenticated) {
        await fetchCart()
        setSyncStatus('synced')
        // Charger les détails complets des véhicules
        await loadVehicleDetails()
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
      setSyncStatus('error')
    }
  }

  // Fonction pour charger les détails complets des véhicules depuis le backend
  const loadVehicleDetails = async () => {
    try {
      const details = {}
      
      for (const item of cart) {
        const vehicle = item.vehicle || item.vehicule
        if (vehicle && vehicle.id) {
          try {
            // Récupérer les détails complets du véhicule depuis le backend
            const vehicleDetail = await vehiculesService.getVehiculeById(vehicle.id)
            if (vehicleDetail) {
              details[vehicle.id] = formatVehicleForDisplay(vehicleDetail)
            }
          } catch (error) {
            console.warn(`Impossible de charger les détails du véhicule ${vehicle.id}:`, error)
            // Utiliser les données de base si la requête échoue
            details[vehicle.id] = formatVehicleForDisplay(vehicle)
          }
        }
      }
      
      setVehicleDetails(details)
    } catch (error) {
      console.error('Erreur lors du chargement des détails des véhicules:', error)
    }
  }

  // Formater les données du véhicule pour l'affichage
  const formatVehicleForDisplay = (vehicle) => {
    if (!vehicle) return null

    // Récupérer l'image principale
    const getMainImage = (v) => {
      if (v.imageUrl) return v.imageUrl
      if (v.image) return v.image
      if (v.images && Array.isArray(v.images) && v.images.length > 0) {
        const mainImage = v.images.find(img => img.isMain) || v.images[0]
        return mainImage.fileUrl || mainImage.url || mainImage.displayUrl
      }
      return "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop"
    }

    // Récupérer toutes les images
    const getAllImages = (v) => {
      if (v.allImageUrls && Array.isArray(v.allImageUrls) && v.allImageUrls.length > 0) {
        return v.allImageUrls
      }
      if (v.images && Array.isArray(v.images) && v.images.length > 0) {
        return v.images.map(img => img.fileUrl || img.url || img.displayUrl).filter(url => url)
      }
      return [getMainImage(v)]
    }

    // Déterminer les caractéristiques spécifiques selon le type
    const getSpecificFeatures = (v) => {
      const features = []
      
      // Caractéristiques communes
      if (v.couleur) features.push({ label: 'Couleur', value: v.couleur, icon: '🎨' })
      if (v.annee) features.push({ label: 'Année', value: v.annee, icon: '📅' })
      if (v.kilometrage) features.push({ label: 'Kilométrage', value: `${v.kilometrage.toLocaleString()} km`, icon: '📊' })
      
      // Caractéristiques spécifiques
      if (v.type === 'SCOOTER' || v.typeVehicule === 'SCOOTER') {
        if (v.cylindree) features.push({ label: 'Cylindrée', value: `${v.cylindree} cc`, icon: '⚙️' })
        if (v.categoriePermis) features.push({ label: 'Catégorie permis', value: v.categoriePermis, icon: '📋' })
      } else {
        if (v.nombrePlaces) features.push({ label: 'Places', value: v.nombrePlaces, icon: '👥' })
        if (v.nombrePortes) features.push({ label: 'Portes', value: v.nombrePortes, icon: '🚪' })
        if (v.transmission) features.push({ label: 'Transmission', value: v.transmission, icon: '⚙️' })
        if (v.puissance) features.push({ label: 'Puissance', value: `${v.puissance} ch`, icon: '💪' })
      }
      
      // Caractéristiques énergie
      if (v.energie === 'ELECTRIQUE' || v.fuel === 'ELECTRIQUE') {
        if (v.autonomie) features.push({ label: 'Autonomie', value: `${v.autonomie} km`, icon: '🔋' })
        if (v.tempsCharge) features.push({ label: 'Temps de charge', value: v.tempsCharge, icon: '⏱️' })
        if (v.typeBatterie) features.push({ label: 'Type batterie', value: v.typeBatterie, icon: '🔋' })
        if (v.tempsChargeRapide) features.push({ label: 'Charge rapide', value: v.tempsChargeRapide, icon: '⚡' })
        if (v.typeChargeur) features.push({ label: 'Type chargeur', value: v.typeChargeur, icon: '🔌' })
      } else {
        if (v.consommation) features.push({ label: 'Consommation', value: `${v.consommation} L/100km`, icon: '⛽' })
        if (v.carburant) features.push({ label: 'Carburant', value: v.carburant, icon: '⛽' })
      }
      
      return features
    }

    // Déterminer le nom complet
    const getName = (v) => {
      if (v.nomComplet) return v.nomComplet
      if (v.nom) return v.nom
      if (v.name) return v.name
      const marque = v.marque || v.brand || ''
      const modele = v.modele || v.model || ''
      return `${marque} ${modele}`.trim() || 'Véhicule'
    }

    return {
      id: vehicle.id,
      name: getName(vehicle),
      marque: vehicle.marque || vehicle.brand,
      modele: vehicle.modele || vehicle.model,
      type: vehicle.type || vehicle.typeVehicule,
      energie: vehicle.energie || vehicle.fuel || vehicle.typeCarburant,
      annee: vehicle.annee,
      prix: vehicle.prix || vehicle.price || vehicle.prixFinal || 0,
      prixBase: vehicle.prixBase,
      prixFinal: vehicle.prixFinal,
      image: getMainImage(vehicle),
      allImages: getAllImages(vehicle),
      features: getSpecificFeatures(vehicle),
      enSolde: vehicle.enSolde,
      pourcentageSolde: vehicle.pourcentageSolde,
      description: vehicle.description || vehicle.descriptionComplete,
      options: vehicle.options || [],
      quantiteStock: vehicle.quantite,
      dateStock: vehicle.dateStock
    }
  }

  const handleCheckout = async () => {
    if (isEmpty) {
      toast.error('Votre panier est vide')
      return
    }
    
    setIsCheckingOut(true)
    try {
      // Synchroniser le panier avant le checkout
      if (isAuthenticated && syncCart) {
        try {
          await syncCart()
        } catch (syncError) {
          console.warn('⚠️ Synchronisation non critique:', syncError)
        }
      }
      
      navigate('/checkout')
    } catch (error) {
      console.error('Erreur lors de la préparation de la commande:', error)
      toast.error('Erreur lors de la préparation de la commande')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId)
      toast.success('Article retiré du panier')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await handleRemoveFromCart(itemId)
      } else {
        await updateQuantity(itemId, newQuantity)
        toast.success('Quantité mise à jour')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error)
      toast.error('Erreur lors de la mise à jour de la quantité')
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      try {
        await clearCart()
        setDiscountApplied(false)
        setPromoCode('')
        setVehicleDetails({})
        toast.success('Panier vidé avec succès')
      } catch (error) {
        console.error('Erreur lors de la suppression du panier:', error)
        toast.error('Erreur lors de la suppression du panier')
      }
    }
  }

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Veuillez entrer un code promo')
      return
    }

    setIsApplyingPromo(true)
    try {
      // Simulation de code promo
      if (promoCode === 'ZAMBA10') {
        setDiscountApplied(true)
        toast.success('Code promo appliqué ! Réduction de 10%')
      } else if (promoCode === 'FLOTTE15' && (user?.type === 'SOCIETE' || user?.customerType === 'company')) {
        setDiscountApplied(true)
        toast.success('Réduction flotte de 15% appliquée !')
      } else {
        toast.error('Code promo invalide ou non applicable')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'application du code promo')
    } finally {
      setIsApplyingPromo(false)
      setPromoCode('')
    }
  }

  const handleRemovePromoCode = () => {
    setDiscountApplied(false)
    setPromoCode('')
    toast.success('Code promo retiré')
  }

  const handleApplyFleetDiscount = () => {
    if ((user?.type === 'SOCIETE' || user?.customerType === 'company') && !discountApplied) {
      setDiscountApplied(true)
      toast.success('Réduction flotte de 15% appliquée !')
    } else if (!(user?.type === 'SOCIETE' || user?.customerType === 'company')) {
      toast.error('Cette réduction est réservée aux entreprises')
    }
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0 FCFA'
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const calculateSubtotal = () => {
    if (!cart || cart.length === 0) return 0
    
    return cart.reduce((sum, item) => {
      if (!item) return sum
      
      // Priorité: totalPrice > prixTotal > (vehicule.prix * quantite)
      const totalPrice = item.totalPrice || item.prixTotal
      if (totalPrice !== undefined) return sum + totalPrice
      
      // Calcul basé sur le véhicule
      const vehicle = item.vehicle || item.vehicule
      const vehiclePrice = vehicle?.prix || vehicle?.price || 0
      const quantity = item.quantite || item.quantity || 1
      
      return sum + (vehiclePrice * quantity)
    }, 0)
  }

  const calculateTaxes = () => {
    const subtotal = calculateSubtotal()
    return subtotal * 0.20 // 20% de TVA
  }

  const calculateShipping = () => {
    // Frais de livraison gratuits au-dessus de 50 000 FCFA
    const subtotal = calculateSubtotal()
    return subtotal > 50000 ? 0 : 5000 // 5000 FCFA de frais de livraison
  }

  const calculateDiscount = () => {
    if (discountApplied) {
      const subtotal = calculateSubtotal()
      // 10% pour ZAMBA10, 15% pour FLOTTE15
      if (promoCode === 'ZAMBA10') {
        return subtotal * 0.10
      } else if (promoCode === 'FLOTTE15' || user?.type === 'SOCIETE' || user?.customerType === 'company') {
        return subtotal * 0.15
      }
    }
    return 0
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = calculateShipping()
    const taxes = calculateTaxes()
    const discount = calculateDiscount()
    
    return subtotal + shipping + taxes - discount
  }

  const handleManualSync = async () => {
    try {
      setSyncStatus('syncing')
      await fetchCart()
      await loadVehicleDetails()
      setSyncStatus('synced')
      toast.success('Panier synchronisé avec le serveur')
    } catch (error) {
      setSyncStatus('error')
      toast.error('Erreur lors de la synchronisation')
    }
  }

  // Obtenir les données formatées du véhicule
  const getFormattedVehicle = (item) => {
    const vehicle = item.vehicle || item.vehicule
    if (!vehicle || !vehicle.id) return null
    
    // Utiliser les détails chargés ou formater à la volée
    const formatted = vehicleDetails[vehicle.id] || formatVehicleForDisplay(vehicle)
    
    // Ajouter les informations spécifiques à l'item
    const quantity = item.quantite || item.quantity || 1
    const options = item.selectedOptions || item.options || []
    const totalPrice = item.totalPrice || item.prixTotal || 
                      (formatted?.prix * quantity)
    
    return {
      ...formatted,
      quantity,
      options,
      totalPrice,
      cartItemId: item.id
    }
  }

  if (loading && (!cart || cart.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du panier...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <FaArrowLeft />
            Retour
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Mon panier</h1>
              <p className="text-gray-600">
                {itemCount || 0} article{(itemCount || 0) !== 1 ? 's' : ''} dans votre panier
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Statut de synchronisation */}
              <div className={`text-sm px-3 py-1 rounded-full ${
                syncStatus === 'synced' ? 'bg-green-100 text-green-800' :
                syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' :
                syncStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {syncStatus === 'synced' && '✓ Synchronisé'}
                {syncStatus === 'syncing' && '⏳ Synchronisation...'}
                {syncStatus === 'error' && '⚠️ Erreur de sync'}
                {syncStatus === 'idle' && '⚪ Non synchronisé'}
              </div>
              
              {!isEmpty && (
                <button
                  onClick={undoLastAction}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 px-4 py-2 rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors"
                >
                  <FaUndo />
                  Annuler
                </button>
              )}
              
              {!isEmpty && (
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <FaTrash />
                  Vider le panier
                </button>
              )}
              
              {isAuthenticated && !isEmpty && (
                <button
                  onClick={handleManualSync}
                  disabled={syncStatus === 'syncing'}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <FaSyncAlt className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                  {syncStatus === 'syncing' ? 'Synchronisation...' : 'Synchroniser'}
                </button>
              )}
            </div>
          </div>
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaShoppingCart className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Commencez par ajouter des véhicules à votre panier pour les acheter ou les louer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/catalogue" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Parcourir le catalogue
              </Link>
              <Link 
                to="/achat-flotte" 
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Solution flotte entreprise
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Vos véhicules sélectionnés</h2>
                    {isAuthenticated && syncStatus === 'synced' && (
                      <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        ✓ Sauvegardé sur le serveur
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => {
                    const vehicleData = getFormattedVehicle(item)
                    if (!vehicleData) return null
                    
                    return (
                      <div key={vehicleData.cartItemId} className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Vehicle Image */}
                          <div className="md:w-1/3">
                            <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={vehicleData.image}
                                alt={vehicleData.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop"
                                  e.target.className = "w-full h-full object-cover"
                                }}
                              />
                              {vehicleData.allImages && vehicleData.allImages.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                  +{vehicleData.allImages.length - 1} images
                                </div>
                              )}
                              {vehicleData.enSolde && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                                  -{vehicleData.pourcentageSolde || 10}%
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Vehicle Details */}
                          <div className="md:w-2/3">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{vehicleData.name}</h3>
                                <div className="flex items-center gap-4 mb-2">
                                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    <FaCar className="w-3 h-3" />
                                    {vehicleData.type}
                                  </span>
                                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    <FaGasPump className="w-3 h-3" />
                                    {vehicleData.energie}
                                  </span>
                                  {vehicleData.annee && (
                                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                      <FaCalendarAlt className="w-3 h-3" />
                                      {vehicleData.annee}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Caractéristiques */}
                                {vehicleData.features && vehicleData.features.length > 0 && (
                                  <div className="mb-3">
                                    <div className="flex flex-wrap gap-1">
                                      {vehicleData.features.slice(0, 4).map((feature, idx) => (
                                        <span 
                                          key={idx} 
                                          className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                        >
                                          {feature.icon} {feature.label}: {feature.value}
                                        </span>
                                      ))}
                                      {vehicleData.features.length > 4 && (
                                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                          +{vehicleData.features.length - 4} autres
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-right">
                                <div className="text-2xl font-bold text-orange-600">
                                  {formatPrice(vehicleData.prix)}
                                </div>
                                {vehicleData.prixBase && vehicleData.prixBase > vehicleData.prix && (
                                  <div className="text-sm text-gray-500 line-through">
                                    {formatPrice(vehicleData.prixBase)}
                                  </div>
                                )}
                                <div className="text-sm text-gray-500">Prix unitaire</div>
                              </div>
                            </div>
                            
                            {/* Options */}
                            {vehicleData.options && vehicleData.options.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                  <FaCog />
                                  Options sélectionnées:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {vehicleData.options.map((option, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                    >
                                      <FaTag className="w-3 h-3" />
                                      {option.nom || option.name || `Option ${idx + 1}`}
                                      {option.prix && (
                                        <span className="font-medium"> (+{formatPrice(option.prix)})</span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Quantity Controls */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() => handleUpdateQuantity(vehicleData.cartItemId, vehicleData.quantity - 1)}
                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    aria-label="Réduire la quantité"
                                  >
                                    <FaMinus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 py-2 min-w-[60px] text-center font-medium text-gray-800">
                                    {vehicleData.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQuantity(vehicleData.cartItemId, vehicleData.quantity + 1)}
                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    aria-label="Augmenter la quantité"
                                  >
                                    <FaPlus className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => handleRemoveFromCart(vehicleData.cartItemId)}
                                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                                >
                                  <FaTrash className="w-4 h-4" />
                                  Supprimer
                                </button>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-800">
                                  {formatPrice(vehicleData.totalPrice)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Total pour {vehicleData.quantity} unité{vehicleData.quantity > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Customer Info & Promo Code */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Informations client</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Nom</p>
                          <p className="font-medium text-gray-800">{user?.name || user?.nom || user?.prenom || 'Non connecté'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Type de compte</p>
                          <p className="font-medium text-gray-800 flex items-center gap-2">
                            {user?.type === 'SOCIETE' ? (
                              <>
                                <FaIndustry className="w-4 h-4" />
                                Entreprise
                              </>
                            ) : (
                              'Particulier'
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <p className="font-medium text-gray-800">{user?.email || 'Non disponible'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Statut</p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {isAuthenticated ? '✓ Connecté' : 'Non connecté'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Promo Code */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Code promo</h3>
                      <div className="space-y-3">
                        {!discountApplied ? (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Entrez votre code promo"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                onClick={handleApplyPromoCode}
                                disabled={isApplyingPromo}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {isApplyingPromo ? 'Application...' : 'Appliquer'}
                              </button>
                            </div>
                            {user?.type === 'SOCIETE' && (
                              <button
                                onClick={handleApplyFleetDiscount}
                                className="w-full px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg font-medium hover:from-blue-800 hover:to-blue-900 transition-colors flex items-center justify-center gap-2"
                              >
                                <FaIndustry />
                                Appliquer la réduction flotte (-15%)
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-green-800">Réduction appliquée</p>
                                <p className="text-sm text-green-600">
                                  {promoCode ? `Code: ${promoCode}` : 'Réduction flotte (15%)'}
                                </p>
                              </div>
                              <button
                                onClick={handleRemovePromoCode}
                                className="text-red-600 hover:text-red-700"
                              >
                                <FaTrash className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-gray-500">
                          Codes promo disponibles: <span className="font-medium">ZAMBA10</span> (-10%)
                          {user?.type === 'SOCIETE' && ', <span className="font-medium">FLOTTE15</span> (-15%)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Récapitulatif de commande</h2>
                </div>
                
                <div className="p-6">
                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium text-gray-800">{formatPrice(calculateSubtotal())}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de livraison</span>
                      <span className="font-medium text-gray-800">
                        {calculateShipping() === 0 ? 'Gratuite' : formatPrice(calculateShipping())}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVA (20%)</span>
                      <span className="font-medium text-gray-800">{formatPrice(calculateTaxes())}</span>
                    </div>
                    
                    {discountApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Réduction</span>
                        <span className="font-medium">-{formatPrice(calculateDiscount())}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-800">Total</span>
                        <span className="text-2xl text-orange-600">
                          {formatPrice(calculateTotal())}
                        </span>
                      </div>
                      {calculateShipping() === 0 && calculateSubtotal() > 50000 && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Livraison gratuite offerte
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || isEmpty}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FaCreditCard />
                    {isCheckingOut ? 'Préparation...' : 'Procéder au paiement'}
                  </button>
                  
                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaTruck className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Livraison gratuite</h4>
                        <p className="text-sm text-gray-600">
                          Pour les commandes supérieures à 50 000 FCFA
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FaShieldAlt className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Garantie incluse</h4>
                        <p className="text-sm text-gray-600">
                          12 mois de garantie sur tous les véhicules
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FaUndo className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Retour facile</h4>
                        <p className="text-sm text-gray-600">
                          30 jours pour changer d'avis
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FaSyncAlt className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Panier sauvegardé</h4>
                        <p className="text-sm text-gray-600">
                          Votre panier est automatiquement sauvegardé
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Continue Shopping */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <Link
                      to="/catalogue"
                      className="block text-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      ← Continuer mes achats
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Fleet Discount */}
              {user?.type === 'SOCIETE' && !discountApplied && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md mt-6">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Réduction flotte</h3>
                    <p className="mb-4 opacity-90">
                      En tant qu'entreprise, bénéficiez de -15% sur votre commande
                    </p>
                    <button 
                      onClick={handleApplyFleetDiscount}
                      className="w-full px-4 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaIndustry />
                      Activer la réduction
                    </button>
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md mt-6">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Actions rapides</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/catalogue?promo=true"
                      className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-orange-600 font-medium">Promotions</div>
                      <div className="text-xs text-gray-500">Véhicules en solde</div>
                    </Link>
                    <Link
                      to="/configuration"
                      className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-orange-600 font-medium">Configurer</div>
                      <div className="text-xs text-gray-500">Véhicule sur mesure</div>
                    </Link>
                    <Link
                      to="/devis"
                      className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-orange-600 font-medium">Devis</div>
                      <div className="text-xs text-gray-500">Demande de devis</div>
                    </Link>
                    <Link
                      to="/contact"
                      className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-orange-600 font-medium">Aide</div>
                      <div className="text-xs text-gray-500">Contactez-nous</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart