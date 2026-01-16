import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { 
  FaCreditCard, FaFileInvoice, FaTruck, FaCheck, 
  FaLock, FaCalendar, FaUser, FaBuilding, FaMapMarkerAlt 
} from 'react-icons/fa'
import orderService from '../api/orders'
import cartService from '../api/cart'
import toast from 'react-hot-toast'

const Checkout = () => {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [deliveryCountry, setDeliveryCountry] = useState('FR')
  const [isProcessing, setIsProcessing] = useState(false)
  const { cart, total, clearCart } = useCart()
  const { user, clientId } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const steps = [
    { number: 1, title: 'Livraison', icon: <FaTruck /> },
    { number: 2, title: 'Paiement', icon: <FaCreditCard /> },
    { number: 3, title: 'Confirmation', icon: <FaCheck /> }
  ]

  const countries = [
    { code: 'FR', name: 'France', tax: 20 },
    { code: 'BE', name: 'Belgique', tax: 21 },
    { code: 'LU', name: 'Luxembourg', tax: 17 },
    { code: 'CH', name: 'Suisse', tax: 7.7 },
    { code: 'DE', name: 'Allemagne', tax: 19 }
  ]

  const paymentMethods = [
    {
      id: 'cash',
      title: 'Paiement comptant',
      description: 'Virement bancaire ou espèces',
      backendType: 'COMPTANT'
    },
    {
      id: 'credit',
      title: 'Demande de crédit',
      description: 'Financement sur 12-60 mois',
      backendType: 'CREDIT'
    },
    {
      id: 'lease',
      title: 'Location longue durée',
      description: 'LLD pour entreprises',
      backendType: 'LOCATION'
    }
  ]

  const calculateTaxes = () => {
    const country = countries.find(c => c.code === deliveryCountry)
    return total * (country?.tax || 20) / 100
  }

  const calculateTotal = () => {
    return total + calculateTaxes()
  }

  const handleDeliverySubmit = (data) => {
    console.log('Delivery data:', data)
    setStep(2)
  }

  const handlePaymentSubmit = async (data) => {
    try {
      setIsProcessing(true)

      // Trouver la méthode de paiement sélectionnée
      const selectedPayment = paymentMethods.find(m => m.id === paymentMethod)
      
      // Préparer les données pour le backend
      const orderData = {
        clientId: clientId || user?.id,
        typePaiement: selectedPayment?.backendType || 'COMPTANT',
        paysLivraison: deliveryCountry,
        vehiculeIds: cart.map(item => item.vehicle?.id || item.vehicleId),
        // Format avancé avec lignes détaillées
        lignes: cart.map(item => ({
          vehiculeId: item.vehicle?.id || item.vehicleId,
          quantite: item.quantity || 1,
          optionIds: item.options?.map(opt => opt.id) || item.selectedOptions?.map(opt => opt.id) || []
        }))
      }

      console.log('Envoi de la commande au backend:', orderData)

      // Utiliser le service API adapté
      const createdOrder = await orderService.createOrder(orderData)

      toast.success('Commande créée avec succès !')
      
      // Vider le panier du backend
      if (clientId) {
        try {
          await cartService.clearCart(clientId)
        } catch (error) {
          console.warn('Erreur lors de la suppression du panier:', error)
        }
      }
      
      // Vider le panier local
      clearCart()
      setStep(3)

      // Sauvegarder l'ID de commande pour la confirmation
      const orderId = createdOrder.id || createdOrder.orderId
      localStorage.setItem('lastOrderId', orderId)
      
      // Sauvegarder les détails de commande
      localStorage.setItem('lastOrderDetails', JSON.stringify({
        orderId: orderId,
        orderNumber: createdOrder.orderNumber || `CMD-${new Date().getFullYear()}-${String(orderId).padStart(5, '0')}`,
        date: new Date().toISOString(),
        total: calculateTotal(),
        status: 'EN_COURS'
      }))

    } catch (error) {
      console.error('Erreur détaillée lors de la création de commande:', error)
      toast.error(error.message || 'Erreur lors de la création de la commande')
    } finally {
      setIsProcessing(false)
    }
  }

  const getOrderSummary = () => {
    const savedOrder = localStorage.getItem('lastOrderDetails')
    if (savedOrder) {
      return JSON.parse(savedOrder)
    }
    
    // Fallback si pas de commande sauvegardée
    return {
      orderNumber: `CMD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      date: new Date().toLocaleDateString('fr-FR'),
      total: calculateTotal(),
      status: 'EN_COURS'
    }
  }

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="section bg-white">
        <div className="container">
          <div className="card p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
            <p className="text-primary-gray mb-8">
              Ajoutez des véhicules à votre panier avant de passer commande.
            </p>
            <button
              onClick={() => navigate('/catalogue')}
              className="btn btn-primary"
            >
              Parcourir le catalogue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section bg-white">
      <div className="container max-w-6xl">
        {/* Steps */}
        <div className="mb-12">
          <div className="flex justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex flex-col items-center relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  step >= s.number 
                    ? 'bg-primary-orange text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {s.icon}
                </div>
                <span className={`font-medium ${
                  step >= s.number ? 'text-primary-dark' : 'text-gray-400'
                }`}>
                  {s.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`absolute h-1 w-32 top-8 left-24 ${step > s.number ? 'bg-primary-orange' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold">Adresse de livraison</h2>
                  <p className="text-primary-gray mt-2">
                    Où souhaitez-vous recevoir votre véhicule ?
                  </p>
                </div>
                
                <form onSubmit={handleSubmit(handleDeliverySubmit)} className="p-6 space-y-6">
                  {/* Country Selection */}
                  <div>
                    <label className="block text-sm font-medium text-primary-gray mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Pays de livraison
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {countries.map(country => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => setDeliveryCountry(country.code)}
                          className={`p-4 border-2 rounded-lg text-center ${
                            deliveryCountry === country.code
                              ? 'border-primary-orange bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium">{country.code}</div>
                          <div className="text-sm text-primary-gray">{country.name}</div>
                          <div className="text-xs text-primary-gray">TVA: {country.tax}%</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Address Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        {...register("firstName", { required: "Le prénom est requis" })}
                        className="form-input"
                        defaultValue={user?.name?.split(' ')[0]}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        {...register("lastName", { required: "Le nom est requis" })}
                        className="form-input"
                        defaultValue={user?.name?.split(' ')[1]}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        {...register("phone", { 
                          required: "Le téléphone est requis",
                          pattern: {
                            value: /^[+]?[0-9\s\-\(\)]{10,}$/,
                            message: "Numéro de téléphone invalide"
                          }
                        })}
                        className="form-input"
                        placeholder="+33 1 23 45 67 89"
                        defaultValue={user?.phone}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email", { 
                          required: "L'email est requis",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Adresse email invalide"
                          }
                        })}
                        className="form-input"
                        defaultValue={user?.email}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        {...register("address", { required: "L'adresse est requise" })}
                        className="form-input"
                        placeholder="123 Avenue des Champs-Élysées"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        {...register("city", { required: "La ville est requise" })}
                        className="form-input"
                        placeholder="Paris"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        {...register("zipCode", { 
                          required: "Le code postal est requis",
                          pattern: {
                            value: /^[0-9]{5}$/,
                            message: "Code postal invalide (5 chiffres requis)"
                          }
                        })}
                        className="form-input"
                        placeholder="75008"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Options de livraison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 border-2 rounded-lg cursor-pointer ${deliveryCountry === 'FR' ? 'border-primary-orange bg-orange-50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Livraison standard</span>
                          <span className="font-bold">Gratuite</span>
                        </div>
                        <p className="text-sm text-primary-gray">
                          7-10 jours ouvrables • Suivi inclus
                        </p>
                      </div>
                      
                      <div className="p-4 border-2 border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Livraison express</span>
                          <span className="font-bold">500 €</span>
                        </div>
                        <p className="text-sm text-primary-gray">
                          2-3 jours ouvrables • Prioritaire
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={() => navigate('/panier')}
                      className="btn bg-gray-100 text-primary-dark hover:bg-gray-200"
                    >
                      ← Retour au panier
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Continuer vers le paiement →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold">Mode de paiement</h2>
                  <p className="text-primary-gray mt-2">
                    Choisissez comment vous souhaitez régler votre commande
                  </p>
                </div>
                
                <form onSubmit={handleSubmit(handlePaymentSubmit)} className="p-6">
                  {/* Payment Methods */}
                  <div className="space-y-4 mb-8">
                    {paymentMethods.map(method => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-primary-orange bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            paymentMethod === method.id
                              ? 'bg-primary-orange text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {method.id === 'cash' && <FaCreditCard />}
                            {method.id === 'credit' && <FaFileInvoice />}
                            {method.id === 'lease' && <FaCalendar />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold">{method.title}</h3>
                                <p className="text-primary-gray mt-1">{method.description}</p>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === method.id
                                  ? 'border-primary-orange bg-primary-orange'
                                  : 'border-gray-300'
                              }`}>
                                {paymentMethod === method.id && (
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                )}
                              </div>
                            </div>
                            
                            {/* Credit form */}
                            {method.id === 'credit' && paymentMethod === 'credit' && (
                              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-primary-gray mb-2">
                                      Durée (mois)
                                    </label>
                                    <select className="form-select">
                                      <option value="12">12 mois</option>
                                      <option value="24">24 mois</option>
                                      <option value="36">36 mois</option>
                                      <option value="48">48 mois</option>
                                      <option value="60">60 mois</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-primary-gray mb-2">
                                      Apport initial (%)
                                    </label>
                                    <input
                                      type="number"
                                      className="form-input"
                                      placeholder="30"
                                      min="10"
                                      max="80"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Terms */}
                  <div className="mb-8">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        {...register("terms", { required: "Vous devez accepter les conditions" })}
                        className="h-5 w-5 mt-1 text-primary-orange focus:ring-primary-orange border-gray-300 rounded"
                      />
                      <label htmlFor="terms" className="ml-3 text-sm text-primary-gray">
                        J'accepte les conditions générales de vente et confirme que j'ai pris 
                        connaissance des informations relatives à mon droit de rétractation.
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="mt-2 text-sm text-red-600">{errors.terms.message}</p>
                    )}
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn bg-gray-100 text-primary-dark hover:bg-gray-200"
                    >
                      ← Retour à la livraison
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <FaLock />
                      {isProcessing ? 'Traitement...' : 'Confirmer et payer'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold">Commande confirmée !</h2>
                  <p className="text-primary-gray mt-2">
                    Votre commande a été enregistrée avec succès
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheck className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Merci pour votre commande !</h3>
                    <p className="text-primary-gray max-w-2xl mx-auto">
                      Votre commande a été enregistrée sous la référence <strong>{getOrderSummary().orderNumber}</strong>.
                      Vous recevrez un email de confirmation sous peu avec tous les détails.
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h4 className="text-lg font-bold mb-4">Récapitulatif de commande</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-primary-gray">Numéro de commande</span>
                        <span className="font-medium">{getOrderSummary().orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-gray">Date</span>
                        <span className="font-medium">{getOrderSummary().date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-gray">Total</span>
                        <span className="text-xl font-bold text-primary-orange">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(getOrderSummary().total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-gray">Statut</span>
                        <span className="font-medium text-green-600">
                          {getOrderSummary().status === 'EN_COURS' ? 'En cours' : 
                           getOrderSummary().status === 'VALIDEE' ? 'Validée' :
                           getOrderSummary().status === 'PAYEE' ? 'Payée' :
                           getOrderSummary().status === 'LIVREE' ? 'Livrée' : 'Annulée'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold mb-4">Prochaines étapes :</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaFileInvoice className="w-6 h-6 text-blue-600" />
                        </div>
                        <h5 className="font-bold mb-2">Documents</h5>
                        <p className="text-sm text-primary-gray">
                          Téléchargez vos documents dans votre espace client
                        </p>
                      </div>
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                          <FaTruck className="w-6 h-6 text-green-600" />
                        </div>
                        <h5 className="font-bold mb-2">Suivi livraison</h5>
                        <p className="text-sm text-primary-gray">
                          Suivez votre colis en temps réel
                        </p>
                      </div>
                      <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                          <FaUser className="w-6 h-6 text-orange-600" />
                        </div>
                        <h5 className="font-bold mb-2">Contact</h5>
                        <p className="text-sm text-primary-gray">
                          Votre conseiller vous contactera sous 24h
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate('/compte/commandes')}
                      className="btn btn-primary flex-1"
                    >
                      Voir mes commandes
                    </button>
                    <button
                      onClick={() => navigate('/catalogue')}
                      className="btn bg-gray-100 text-primary-dark hover:bg-gray-200 flex-1"
                    >
                      Continuer mes achats
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">Récapitulatif</h2>
              </div>
              
              <div className="p-6">
                {/* Items List */}
                <div className="mb-6">
                  <h3 className="font-bold mb-4">Vos articles</h3>
                  <div className="space-y-4">
                    {cart.map(item => {
                      const vehicleName = item.vehicle?.name || item.vehicle?.marque + ' ' + item.vehicle?.modele || 'Véhicule'
                      const unitPrice = item.unitPrice || item.vehicle?.prix || 0
                      const quantity = item.quantity || 1
                      const totalPrice = unitPrice * quantity
                      
                      return (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <div className="font-medium">{vehicleName}</div>
                            <div className="text-sm text-primary-gray">
                              {quantity} × {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(unitPrice)}
                            </div>
                          </div>
                          <div className="font-bold">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(totalPrice)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex justify-between">
                    <span className="text-primary-gray">Sous-total</span>
                    <span>{new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(total)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-primary-gray">Livraison</span>
                    <span>Gratuite</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-primary-gray">
                      TVA ({countries.find(c => c.code === deliveryCountry)?.tax || 20}%)
                    </span>
                    <span>{new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(calculateTaxes())}</span>
                  </div>
                  
                  {user?.customerType === 'company' && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction flotte (-15%)</span>
                      <span>-{new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(total * 0.15)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-2xl text-primary-orange">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-bold mb-4">Client</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-primary-gray" />
                      <span>{user?.name || 'Non connecté'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-primary-gray" />
                      <span>
                        {user?.customerType === 'individual' ? 'Particulier' :
                         user?.customerType === 'company' ? 'Entreprise' : 'Filiale'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaLock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Paiement sécurisé</div>
                      <div className="text-sm text-primary-gray">
                        Vos données sont protégées par chiffrement SSL
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

export default Checkout