import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { 
  FaTrash, FaUndo, FaPlus, FaMinus, FaShoppingCart, 
  FaCreditCard, FaTruck, FaShieldAlt, FaArrowLeft,
  FaCog, FaTag, FaSyncAlt
} from 'react-icons/fa'
import cartService from '../api/cart'
import orderService from '../api/orders'
import toast from 'react-hot-toast'

const Cart = () => {
  const { 
    cart, 
    total, 
    loading, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    undoLastAction, 
    getCartCount,
    addDiscount,
    removeDiscount
  } = useCart()
  
  const { user, isAuthenticated, clientId } = useAuth()
  const navigate = useNavigate()
  
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [cartFromBackend, setCartFromBackend] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/panier' } })
    } else if (clientId) {
      // Charger le panier depuis le backend
      loadCartFromBackend()
    }
  }, [isAuthenticated, navigate, clientId])

  const loadCartFromBackend = async () => {
    try {
      if (clientId) {
        const backendCart = await cartService.getCart(clientId)
        setCartFromBackend(backendCart)
        
        // Synchroniser avec le panier local si nécessaire
        if (backendCart && backendCart.lignes && backendCart.lignes.length > 0) {
          // Ici vous pourriez synchroniser les données du backend avec le panier local
          console.log('Panier backend chargé:', backendCart)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
      // Si le panier n'existe pas encore, ce n'est pas une erreur
      if (error.status !== 404) {
        toast.error('Erreur lors du chargement du panier')
      }
    }
  }

  const syncCartWithBackend = async () => {
    try {
      setIsSyncing(true)
      if (clientId && cart.length > 0) {
        // Pour chaque article du panier local, l'ajouter au backend
        for (const item of cart) {
          await cartService.addToCart({
            clientId: clientId,
            vehiculeId: item.vehicle?.id || item.vehicleId,
            optionsIds: item.options?.map(opt => opt.id) || []
          })
        }
        toast.success('Panier synchronisé avec le serveur')
        await loadCartFromBackend()
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error)
      toast.error('Erreur lors de la synchronisation du panier')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Votre panier est vide')
      return
    }
    
    setIsCheckingOut(true)
    try {
      // Vérifier la disponibilité avant le checkout
      if (clientId) {
        try {
          const availability = await cartService.checkAvailability(clientId)
          if (!availability.available) {
            toast.error('Certains articles ne sont plus disponibles')
            return
          }
        } catch (error) {
          console.warn('Vérification de disponibilité non disponible:', error)
        }
      }
      
      // Synchroniser le panier avec le backend
      await syncCartWithBackend()
      
      navigate('/checkout')
    } catch (error) {
      toast.error('Erreur lors de la préparation de la commande')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleRemoveFromCart = async (itemId) => {
    try {
      if (clientId) {
        // Supprimer du backend aussi
        const backendItemId = cartFromBackend?.lignes?.find(
          item => item.vehicule?.id === itemId || item.id === itemId
        )?.id
        
        if (backendItemId) {
          await cartService.removeFromCart(clientId, backendItemId)
        }
      }
      removeFromCart(itemId)
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
        if (clientId) {
          // Trouver l'ID de la ligne dans le backend
          const backendItemId = cartFromBackend?.lignes?.find(
            item => item.vehicule?.id === itemId || item.id === itemId
          )?.id
          
          if (backendItemId) {
            // Mettre à jour dans le backend
            await cartService.updateCartItemQuantity({
              clientId: clientId,
              lignePanierId: backendItemId,
              nouvelleQuantite: newQuantity
            })
          }
        }
        updateQuantity(itemId, newQuantity)
        toast.success('Quantité mise à jour')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error)
      toast.error('Erreur lors de la mise à jour de la quantité')
    }
  }

  const handleClearCart = async () => {
    try {
      if (clientId) {
        await cartService.clearCart(clientId)
      }
      clearCart()
      setDiscountApplied(false)
      removeDiscount()
      toast.success('Panier vidé')
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error)
      toast.error('Erreur lors de la suppression du panier')
    }
  }

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Veuillez entrer un code promo')
      return
    }

    setIsApplyingPromo(true)
    try {
      const result = await cartService.applyPromoCode(promoCode)
      if (result.success) {
        setDiscountApplied(true)
        addDiscount(result.discountAmount || 0)
        toast.success('Code promo appliqué avec succès !')
      } else {
        toast.error(result.message || 'Code promo invalide')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'application du code promo')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleRemovePromoCode = async () => {
    try {
      await cartService.removePromoCode()
      setDiscountApplied(false)
      removeDiscount()
      setPromoCode('')
      toast.success('Code promo retiré')
    } catch (error) {
      toast.error('Erreur lors du retrait du code promo')
    }
  }

  const handleApplyFleetDiscount = async () => {
    if (user?.customerType === 'company') {
      try {
        // Appliquer une réduction flotte de 15%
        const fleetDiscount = total * 0.15
        addDiscount(fleetDiscount)
        setDiscountApplied(true)
        toast.success('Réduction flotte de 15% appliquée !')
      } catch (error) {
        toast.error('Erreur lors de l\'application de la réduction flotte')
      }
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0)
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const unitPrice = item.unitPrice || item.vehicle?.prix || 0
      const quantity = item.quantity || 1
      return sum + (unitPrice * quantity)
    }, 0)
  }

  const calculateTaxes = () => {
    const subtotal = calculateSubtotal()
    return subtotal * 0.20 // 20% de TVA (France)
  }

  const calculateShipping = () => {
    // Frais de livraison gratuits au-dessus de 50 000€
    const subtotal = calculateSubtotal()
    return subtotal > 50000 ? 0 : 500
  }

  const calculateDiscount = () => {
    // Si une réduction est appliquée via le contexte
    return discountApplied ? (calculateSubtotal() * 0.15) : 0
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = calculateShipping()
    const taxes = calculateTaxes()
    const discount = calculateDiscount()
    
    return subtotal + shipping + taxes - discount
  }

  const getVehicleImage = (vehicle) => {
    if (vehicle?.imageUrl) {
      return vehicle.imageUrl
    } else if (vehicle?.imageThumbnailUrl) {
      return vehicle.imageThumbnailUrl
    } else if (vehicle?.additionalImages && vehicle.additionalImages.length > 0) {
      return vehicle.additionalImages[0]
    }
    return null
  }

  if (loading) {
    return (
      <div className="section bg-white">
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
            <span className="ml-4 text-primary-gray">Chargement du panier...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section bg-white">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-gray hover:text-primary-dark mb-6"
          >
            <FaArrowLeft />
            Retour
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mon panier</h1>
              <p className="text-primary-gray">
                {cart.length} article{cart.length !== 1 ? 's' : ''} dans votre panier
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {isSyncing && (
                <div className="flex items-center gap-2 text-blue-600">
                  <FaSyncAlt className="animate-spin" />
                  <span className="text-sm">Synchronisation...</span>
                </div>
              )}
              
              {cart.length > 0 && (
                <button
                  onClick={undoLastAction}
                  className="flex items-center gap-2 text-primary-orange hover:text-primary-orange-hover px-4 py-2 rounded-lg border border-primary-orange hover:bg-orange-50 transition-colors"
                >
                  <FaUndo />
                  Annuler
                </button>
              )}
              
              {cart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <FaTrash />
                  Vider le panier
                </button>
              )}
              
              {clientId && cart.length > 0 && (
                <button
                  onClick={syncCartWithBackend}
                  disabled={isSyncing}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <FaSyncAlt className={isSyncing ? 'animate-spin' : ''} />
                  Synchroniser
                </button>
              )}
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="card p-12 text-center">
            <FaShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Votre panier est vide</h3>
            <p className="text-primary-gray mb-8 max-w-md mx-auto">
              Commencez par ajouter des véhicules à votre panier pour les acheter ou les louer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalogue" className="btn btn-primary">
                Parcourir le catalogue
              </Link>
              <Link to="/achat-flotte" className="btn btn-outline">
                Solution flotte entreprise
              </Link>
            </div>
            
            {/* Afficher le panier du backend s'il existe */}
            {cartFromBackend && cartFromBackend.lignes && cartFromBackend.lignes.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-lg font-bold mb-4">Panier sauvegardé sur le serveur</h4>
                <p className="text-primary-gray mb-4">
                  Vous avez {cartFromBackend.nombreArticles} article{cartFromBackend.nombreArticles !== 1 ? 's' : ''} dans votre panier enregistré
                </p>
                <button
                  onClick={syncCartWithBackend}
                  className="btn btn-outline"
                >
                  Charger mon panier sauvegardé
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Vos véhicules sélectionnés</h2>
                    {cartFromBackend && (
                      <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        Synchronisé avec le serveur
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => {
                    const vehicle = item.vehicle || {}
                    const vehicleName = vehicle.name || `${vehicle.marque || ''} ${vehicle.modele || ''}`.trim() || 'Véhicule'
                    const vehicleType = vehicle.type || vehicle.categorie || 'Non spécifié'
                    const vehicleYear = vehicle.year || vehicle.annee || '2024'
                    const vehicleFuel = vehicle.fuel || vehicle.carburant || 'Essence'
                    const unitPrice = item.unitPrice || vehicle.prix || 0
                    const quantity = item.quantity || 1
                    const totalPrice = item.totalPrice || unitPrice * quantity
                    const vehicleImage = getVehicleImage(vehicle)
                    const options = item.options || item.selectedOptions || []
                    
                    return (
                      <div key={item.id} className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Vehicle Image */}
                          <div className="md:w-1/3">
                            {vehicleImage ? (
                              <img
                                src={vehicleImage}
                                alt={vehicleName}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-6xl">🚗</div>
                              </div>
                            )}
                          </div>
                          
                          {/* Vehicle Details */}
                          <div className="md:w-2/3">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-2">{vehicleName}</h3>
                                <p className="text-primary-gray mb-2">{vehicleType}</p>
                                <div className="flex items-center gap-4 text-sm text-primary-gray">
                                  <span>Année: {vehicleYear}</span>
                                  <span>Carburant: {vehicleFuel}</span>
                                  {vehicle.kilometrage && (
                                    <span>Kilométrage: {vehicle.kilometrage.toLocaleString()} km</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary-orange">
                                  {formatPrice(unitPrice)}
                                </div>
                                <div className="text-sm text-primary-gray">Prix unitaire</div>
                              </div>
                            </div>
                            
                            {/* Options */}
                            {options.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-primary-gray mb-2 flex items-center gap-2">
                                  <FaCog />
                                  Options sélectionnées:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {options.map((option, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                    >
                                      <FaTag className="w-3 h-3" />
                                      {option.name || option.nom || `Option ${idx + 1}`}
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
                                    onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    aria-label="Réduire la quantité"
                                  >
                                    <FaMinus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    aria-label="Augmenter la quantité"
                                  >
                                    <FaPlus className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                                >
                                  <FaTrash className="w-4 h-4" />
                                  Supprimer
                                </button>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-xl font-bold">
                                  {formatPrice(totalPrice)}
                                </div>
                                <div className="text-sm text-primary-gray">
                                  Total pour {quantity} unité{quantity > 1 ? 's' : ''}
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
              <div className="card">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Informations client</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-primary-gray mb-1">Nom</p>
                          <p className="font-medium">{user?.name || 'Non connecté'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-primary-gray mb-1">Type de compte</p>
                          <p className="font-medium">
                            {user?.customerType === 'individual' ? 'Particulier' :
                             user?.customerType === 'company' ? 'Entreprise' : 'Filiale'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-primary-gray mb-1">Email</p>
                          <p className="font-medium">{user?.email || 'Non disponible'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-primary-gray mb-1">Statut</p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Prêt à commander
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Promo Code */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Code promo</h3>
                      <div className="space-y-3">
                        {!discountApplied ? (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Entrez votre code promo"
                                className="form-input flex-1"
                              />
                              <button
                                onClick={handleApplyPromoCode}
                                disabled={isApplyingPromo}
                                className="btn btn-primary whitespace-nowrap"
                              >
                                {isApplyingPromo ? 'Application...' : 'Appliquer'}
                              </button>
                            </div>
                            {user?.customerType === 'company' && (
                              <button
                                onClick={handleApplyFleetDiscount}
                                className="w-full btn bg-blue-600 text-white hover:bg-blue-700"
                              >
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
                                  {promoCode ? `Code: ${promoCode}` : 'Réduction flotte'}
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
                        <p className="text-sm text-primary-gray">
                          Codes promo disponibles: Été2024, Flotte15, Premium10
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Récapitulatif de commande</h2>
                </div>
                
                <div className="p-6">
                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-primary-gray">Sous-total</span>
                      <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-primary-gray">Frais de livraison</span>
                      <span className="font-medium">
                        {calculateShipping() === 0 ? 'Gratuite' : formatPrice(calculateShipping())}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-primary-gray">TVA (20%)</span>
                      <span className="font-medium">{formatPrice(calculateTaxes())}</span>
                    </div>
                    
                    {discountApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Réduction appliquée</span>
                        <span className="font-medium">-{formatPrice(calculateDiscount())}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-2xl text-primary-orange">
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
                    disabled={isCheckingOut || cart.length === 0}
                    className="w-full btn btn-primary mb-6 py-4 text-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <FaCreditCard />
                    {isCheckingOut ? 'Préparation...' : 'Procéder au paiement'}
                  </button>
                  
                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaTruck className="w-5 h-5 text-primary-orange mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Livraison gratuite</h4>
                        <p className="text-sm text-primary-gray">
                          Pour les commandes supérieures à 50 000 €
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FaShieldAlt className="w-5 h-5 text-primary-orange mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Garantie incluse</h4>
                        <p className="text-sm text-primary-gray">
                          12 mois de garantie sur tous les véhicules
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FaUndo className="w-5 h-5 text-primary-orange mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Retour facile</h4>
                        <p className="text-sm text-primary-gray">
                          30 jours pour changer d'avis
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FaSyncAlt className="w-5 h-5 text-primary-orange mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Panier sauvegardé</h4>
                        <p className="text-sm text-primary-gray">
                          Votre panier est automatiquement sauvegardé
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Continue Shopping */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <Link
                      to="/catalogue"
                      className="block text-center text-primary-orange hover:text-primary-orange-hover font-medium transition-colors"
                    >
                      ← Continuer mes achats
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Fleet Discount */}
              {user?.customerType === 'company' && !discountApplied && (
                <div className="card mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Réduction flotte</h3>
                    <p className="mb-4 opacity-90">
                      En tant qu'entreprise, bénéficiez de -15% sur votre commande
                    </p>
                    <button 
                      onClick={handleApplyFleetDiscount}
                      className="w-full btn bg-white text-blue-700 hover:bg-gray-100 font-medium"
                    >
                      Activer la réduction
                    </button>
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="card mt-6">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">Actions rapides</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate('/catalogue?promo=true')}
                      className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-primary-orange font-medium">Promotions</div>
                      <div className="text-xs text-primary-gray">Véhicules en solde</div>
                    </button>
                    <button
                      onClick={() => navigate('/configuration')}
                      className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-primary-orange font-medium">Configurer</div>
                      <div className="text-xs text-primary-gray">Véhicule sur mesure</div>
                    </button>
                    <button
                      onClick={() => navigate('/devis')}
                      className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-primary-orange font-medium">Devis</div>
                      <div className="text-xs text-primary-gray">Demande de devis</div>
                    </button>
                    <button
                      onClick={() => navigate('/contact')}
                      className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-primary-orange font-medium">Aide</div>
                      <div className="text-xs text-primary-gray">Contactez-nous</div>
                    </button>
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