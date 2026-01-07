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
import toast from 'react-hot-toast'

const Checkout = () => {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [deliveryCountry, setDeliveryCountry] = useState('CM')
  const [isProcessing, setIsProcessing] = useState(false)
  const { cart, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const steps = [
    { number: 1, title: 'Livraison', icon: <FaTruck /> },
    { number: 2, title: 'Paiement', icon: <FaCreditCard /> },
    { number: 3, title: 'Confirmation', icon: <FaCheck /> }
  ]

  const countries = [
    { code: 'CM', name: 'Cameroun', tax: 20 },
    { code: 'FR', name: 'France', tax: 20 },
    { code: 'BE', name: 'Belgique', tax: 21 },
    { code: 'CH', name: 'Suisse', tax: 7.7 },
    { code: 'SN', name: 'Sénégal', tax: 18 }
  ]

  const paymentMethods = [
    {
      id: 'cash',
      title: 'Paiement comptant',
      description: 'Virement bancaire ou espèces',
      icon: <FaCreditCard />
    },
    {
      id: 'credit',
      title: 'Demande de crédit',
      description: 'Financement sur 12-60 mois',
      icon: <FaFileInvoice />
    },
    {
      id: 'lease',
      title: 'Location longue durée',
      description: 'LLD pour entreprises',
      icon: <FaCalendar />
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
      
      // Simulation de création de commande
      const orderData = {
        customerId: user?.id,
        deliveryAddress: data,
        paymentMethod,
        deliveryCountry,
        items: cart.map(item => ({
          vehicleId: item.vehicle.id,
          quantity: item.quantity,
          options: item.options,
          unitPrice: item.unitPrice
        })),
        subtotal: total,
        taxes: calculateTaxes(),
        total: calculateTotal()
      }

      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockOrder = {
        id: Date.now(),
        orderNumber: `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        ...orderData,
        status: paymentMethod === 'cash' ? 'confirmée' : 'en attente',
        createdAt: new Date().toISOString()
      }

      toast.success('Commande créée avec succès !')
      clearCart()
      setStep(3)
      
    } catch (error) {
      toast.error('Erreur lors de la création de la commande')
    } finally {
      setIsProcessing(false)
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
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        {...register("phone", { required: "Le téléphone est requis" })}
                        className="form-input"
                        placeholder="+237 6 XX XX XX XX"
                      />
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
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        {...register("address", { required: "L'adresse est requise" })}
                        className="form-input"
                        placeholder="123 Avenue des Champs"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        {...register("city", { required: "La ville est requise" })}
                        className="form-input"
                        placeholder="Douala"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary-gray mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        {...register("zipCode", { required: "Le code postal est requis" })}
                        className="form-input"
                        placeholder="00237"
                      />
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Options de livraison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 border-2 rounded-lg cursor-pointer ${deliveryCountry === 'CM' ? 'border-primary-orange bg-orange-50' : 'border-gray-200'}`}>
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
                            {method.icon}
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
                                      <option>12 mois</option>
                                      <option>24 mois</option>
                                      <option>36 mois</option>
                                      <option>48 mois</option>
                                      <option>60 mois</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-primary-gray mb-2">
                                      Apport initial
                                    </label>
                                    <input
                                      type="number"
                                      className="form-input"
                                      placeholder="30% minimum"
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
                      Votre commande a été enregistrée sous la référence <strong>CMD-2024-00123</strong>.
                      Vous recevrez un email de confirmation sous peu avec tous les détails.
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h4 className="text-lg font-bold mb-4">Récapitulatif de commande</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-primary-gray">Numéro de commande</span>
                        <span className="font-medium">CMD-2024-00123</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-gray">Date</span>
                        <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-gray">Total</span>
                        <span className="text-xl font-bold text-primary-orange">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(calculateTotal())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-gray">Statut</span>
                        <span className="font-medium text-green-600">Confirmée</span>
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
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <div className="font-medium">{item.vehicle.name}</div>
                          <div className="text-sm text-primary-gray">
                            {item.quantity} × {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(item.unitPrice)}
                          </div>
                        </div>
                        <div className="font-bold">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(item.totalPrice)}
                        </div>
                      </div>
                    ))}
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
                  
                  {user?.customer_type === 'company' && (
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
                      <span>{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBuilding className="w-4 h-4 text-primary-gray" />
                      <span>
                        {user?.customer_type === 'individual' ? 'Particulier' :
                         user?.customer_type === 'company' ? 'Entreprise' : 'Filiale'}
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
                        Vos données sont protégées
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