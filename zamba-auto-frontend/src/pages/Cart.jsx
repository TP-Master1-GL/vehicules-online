import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { 
  FaTrash, FaUndo, FaPlus, FaMinus, FaShoppingCart, 
  FaCreditCard, FaTruck, FaShieldAlt, FaArrowLeft 
} from 'react-icons/fa'
import VehicleCard from '../components/ui/VehiculeCard'
import toast from 'react-hot-toast'

const Cart = () => {
  const { cart, total, loading, removeFromCart, updateQuantity, clearCart, undoLastAction, getCartCount } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/panier' } })
    }
  }, [isAuthenticated, navigate])

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Votre panier est vide')
      return
    }
    
    setIsCheckingOut(true)
    // Simulation de préparation de commande
    setTimeout(() => {
      navigate('/checkout')
      setIsCheckingOut(false)
    }, 1000)
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  }

  const calculateTaxes = () => {
    const subtotal = calculateSubtotal()
    return subtotal * 0.20 // 20% de TVA
  }

  const calculateShipping = () => {
    return cart.length > 0 ? 500 : 0 // 500€ de frais de livraison
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mon panier</h1>
              <p className="text-primary-gray">
                {cart.length} article{cart.length > 1 ? 's' : ''} dans votre panier
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {cart.length > 0 && (
                <button
                  onClick={undoLastAction}
                  className="flex items-center gap-2 text-primary-orange hover:text-primary-orange-hover"
                >
                  <FaUndo />
                  Annuler
                </button>
              )}
              
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <FaTrash />
                  Vider le panier
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
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Vos véhicules sélectionnés</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Vehicle Image */}
                        <div className="md:w-1/3">
                          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-6xl">🚗</div>
                          </div>
                        </div>
                        
                        {/* Vehicle Details */}
                        <div className="md:w-2/3">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold mb-2">{item.vehicle.name}</h3>
                              <p className="text-primary-gray mb-2">{item.vehicle.type}</p>
                              <div className="flex items-center gap-4 text-sm text-primary-gray">
                                <span>Année: {item.vehicle.year || '2023'}</span>
                                <span>Carburant: {item.vehicle.fuel || 'Diesel'}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary-orange">
                                {formatPrice(item.unitPrice)}
                              </div>
                              <div className="text-sm text-primary-gray">Prix unitaire</div>
                            </div>
                          </div>
                          
                          {/* Options */}
                          {item.options && item.options.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-primary-gray mb-2">Options sélectionnées:</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.options.map((option, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                  >
                                    {option}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Quantity Controls */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="px-3 py-2 hover:bg-gray-100"
                                >
                                  <FaMinus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 min-w-[60px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="px-3 py-2 hover:bg-gray-100"
                                >
                                  <FaPlus className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                              >
                                <FaTrash className="w-4 h-4" />
                                Supprimer
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xl font-bold">
                                {formatPrice(item.totalPrice)}
                              </div>
                              <div className="text-sm text-primary-gray">
                                Total pour {item.quantity} unité{item.quantity > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Customer Info */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Informations client</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-primary-gray mb-1">Nom</p>
                      <p className="font-medium">{user?.name || 'Non connecté'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-gray mb-1">Type de compte</p>
                      <p className="font-medium">
                        {user?.customer_type === 'individual' ? 'Particulier' :
                         user?.customer_type === 'company' ? 'Entreprise' : 'Filiale'}
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
                      <span className="font-medium">{formatPrice(calculateShipping())}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-primary-gray">TVA (20%)</span>
                      <span className="font-medium">{formatPrice(calculateTaxes())}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-2xl text-primary-orange">
                          {formatPrice(calculateSubtotal() + calculateShipping() + calculateTaxes())}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || cart.length === 0}
                    className="w-full btn btn-primary mb-6 py-4 text-lg font-bold flex items-center justify-center gap-2"
                  >
                    <FaCreditCard />
                    {isCheckingOut ? 'Préparation...' : 'Procéder au paiement'}
                  </button>
                  
                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaTruck className="w-5 h-5 text-primary-orange mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Livraison gratuite</h4>
                        <p className="text-sm text-primary-gray">
                          Pour les commandes supérieures à 50 000 €
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FaShieldAlt className="w-5 h-5 text-primary-orange mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Garantie incluse</h4>
                        <p className="text-sm text-primary-gray">
                          12 mois de garantie sur tous les véhicules
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FaUndo className="w-5 h-5 text-primary-orange mt=1" />
                      <div>
                        <h4 className="font-medium mb-1">Retour facile</h4>
                        <p className="text-sm text-primary-gray">
                          30 jours pour changer d'avis
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Continue Shopping */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <Link
                      to="/catalogue"
                      className="block text-center text-primary-orange hover:text-primary-orange-hover font-medium"
                    >
                      ← Continuer mes achats
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Fleet Discount */}
              {user?.customer_type === 'company' && (
                <div className="card mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Réduction flotte</h3>
                    <p className="mb-4 opacity-90">
                      En tant qu'entreprise, bénéficiez de -15% sur votre commande
                    </p>
                    <button className="w-full btn bg-white text-blue-700 hover:bg-gray-100">
                      Activer la réduction
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart