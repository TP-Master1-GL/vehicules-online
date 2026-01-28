// pages/Checkout.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { 
  FaCreditCard, FaFileInvoice, FaTruck, FaCheck, 
  FaLock, FaCalendar, FaUser, FaBuilding, FaMapMarkerAlt,
  FaEdit, FaEnvelope, FaPhone, FaIdCard
} from 'react-icons/fa'
import orderService from '../api/orders'
import cartService from '../api/cart'
import clientService from '../api/compagny' // Utiliser le service existant
import toast from 'react-hot-toast'

const Checkout = () => {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [deliveryCountry, setDeliveryCountry] = useState('FR')
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientDetails, setClientDetails] = useState(null)
  const [loadingClient, setLoadingClient] = useState(true)
  
  const { cart, total, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Récupérer les détails complets du client
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (isAuthenticated && user) {
        try {
          setLoadingClient(true)
          
          // Déterminer le type de client
          const isCompany = user.customerType === 'company' || 
                            user.role === 'CLIENT_SOCIETE' ||
                            user.role === 'SOCIETE'
          
          // Récupérer les détails selon le type
          if (isCompany) {
            // Pour les entreprises
            const companyData = await clientService.getCompanyInfo(user.id)
            setClientDetails({
              type: 'company',
              companyName: companyData.raisonSociale || user.nom,
              siret: companyData.siret,
              firstName: user.prenom,
              lastName: user.nom,
              email: user.email,
              phone: user.telephone,
              address: user.adresse || companyData.adresse,
              city: user.ville || companyData.ville,
              zipCode: user.codePostal || companyData.codePostal,
              country: 'FR'
            })
          } else {
            // Pour les particuliers
            const clientData = await clientService.getClientDetails(user.id)
            setClientDetails({
              type: 'individual',
              firstName: user.prenom || clientData.prenom,
              lastName: user.nom || clientData.nom,
              email: user.email,
              phone: user.telephone || clientData.telephone,
              address: user.adresse || clientData.adresse,
              city: user.ville || clientData.ville,
              zipCode: user.codePostal || clientData.codePostal,
              driverLicense: clientData.numeroPermis,
              country: 'FR'
            })
          }
          
        } catch (error) {
          console.warn('Impossible de récupérer les détails client:', error)
          // Utiliser les données basiques de l'utilisateur
          setClientDetails({
            type: user.customerType === 'company' ? 'company' : 'individual',
            firstName: user.prenom,
            lastName: user.nom,
            email: user.email,
            phone: user.telephone,
            companyName: user.nom,
            address: user.adresse,
            city: user.ville,
            zipCode: user.codePostal,
            country: 'FR'
          })
        } finally {
          setLoadingClient(false)
        }
      } else {
        setLoadingClient(false)
      }
    }
    
    fetchClientDetails()
  }, [isAuthenticated, user])

  // Pré-remplir le formulaire quand clientDetails est disponible
  useEffect(() => {
    if (clientDetails && !loadingClient) {
      const formData = {
        firstName: clientDetails.firstName || '',
        lastName: clientDetails.lastName || '',
        email: clientDetails.email || '',
        phone: clientDetails.phone || '',
        address: clientDetails.address || '',
        city: clientDetails.city || '',
        zipCode: clientDetails.zipCode || '',
        country: clientDetails.country || 'FR'
      }
      
      // Ajouter les champs spécifiques aux entreprises
      if (clientDetails.type === 'company') {
        formData.companyName = clientDetails.companyName || ''
        formData.siret = clientDetails.siret || ''
      } else {
        formData.driverLicense = clientDetails.driverLicense || ''
      }
      
      reset(formData)
      
      // Définir le pays de livraison
      if (clientDetails.country) {
        setDeliveryCountry(clientDetails.country)
      }
    }
  }, [clientDetails, loadingClient, reset])

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
    }
  ]

  const calculateTaxes = () => {
    const country = countries.find(c => c.code === deliveryCountry)
    return total * (country?.tax || 20) / 100
  }

  const calculateTotal = () => {
    const subtotal = total
    const taxes = calculateTaxes()
    const discount = clientDetails?.type === 'company' ? subtotal * 0.15 : 0
    return subtotal + taxes - discount
  }

  const handleDeliverySubmit = (data) => {
    console.log('Delivery data:', data)
    setStep(2)
  }

  const handlePaymentSubmit = async (data) => {
    try {
      if (!isAuthenticated) {
        toast.error('Veuillez vous connecter pour passer commande')
        navigate('/login')
        return
      }

      setIsProcessing(true)

      const selectedPayment = paymentMethods.find(m => m.id === paymentMethod)
      
      const orderData = {
        clientId: user.id,
        typePaiement: selectedPayment?.backendType || 'COMPTANT',
        paysLivraison: deliveryCountry,
        adresseLivraison: {
          nom: data.firstName + ' ' + data.lastName,
          adresse: data.address,
          ville: data.city,
          codePostal: data.zipCode,
          pays: deliveryCountry
        },
        vehiculeIds: cart.map(item => item.vehicle?.id || item.vehicleId),
        lignes: cart.map(item => ({
          vehiculeId: item.vehicle?.id || item.vehicleId,
          quantite: item.quantity || 1,
          optionIds: item.options?.map(opt => opt.id) || item.selectedOptions?.map(opt => opt.id) || []
        }))
      }

      // Ajouter les infos entreprises si nécessaire
      if (clientDetails?.type === 'company') {
        orderData.societeId = user.id
        orderData.raisonSociale = data.companyName
        orderData.siret = data.siret
      }

      console.log('Envoi de la commande:', orderData)
      const createdOrder = await orderService.createOrder(orderData)

      toast.success('Commande créée avec succès !')
      
      // Vider le panier
      if (user.id) {
        try {
          await cartService.clearCart(user.id)
        } catch (error) {
          console.warn('Erreur suppression panier:', error)
        }
      }
      
      clearCart()
      setStep(3)

      // Sauvegarder l'ID de commande
      localStorage.setItem('lastOrderId', createdOrder.id)
      
      // Sauvegarder les détails
      localStorage.setItem('lastOrderDetails', JSON.stringify({
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber || `CMD-${new Date().getFullYear()}-${String(createdOrder.id).padStart(5, '0')}`,
        date: new Date().toISOString(),
        total: calculateTotal(),
        status: 'EN_COURS'
      }))

    } catch (error) {
      console.error('Erreur création commande:', error)
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de la création de la commande')
    } finally {
      setIsProcessing(false)
    }
  }

  const getOrderSummary = () => {
    const savedOrder = localStorage.getItem('lastOrderDetails')
    if (savedOrder) {
      return JSON.parse(savedOrder)
    }
    
    return {
      orderNumber: `CMD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      date: new Date().toLocaleDateString('fr-FR'),
      total: calculateTotal(),
      status: 'EN_COURS'
    }
  }

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated && step !== 3) {
      toast.error('Veuillez vous connecter pour passer commande')
      navigate('/login')
    }
  }, [isAuthenticated, navigate, step])

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
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Adresse de livraison</h2>
                    <p className="text-primary-gray mt-2">
                      {clientDetails?.type === 'company' ? 'Informations professionnelles' : 'Informations personnelles'}
                      {clientDetails && !loadingClient && (
                        <span className="text-green-600 ml-2 text-sm">
                          ✓ Pré-remplies depuis votre compte
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/compte/profil')}
                    className="text-primary-orange hover:text-orange-700 font-medium flex items-center gap-2 text-sm"
                  >
                    <FaEdit /> Modifier mon profil
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(handleDeliverySubmit)} className="p-6 space-y-6">
                  {loadingClient ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-orange"></div>
                    </div>
                  ) : (
                    <>
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

                      {/* Customer Type Badge */}
                      {clientDetails?.type && (
                        <div className={`p-4 rounded-lg ${clientDetails.type === 'company' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
                          <div className="flex items-center gap-3">
                            <FaBuilding className={`w-5 h-5 ${clientDetails.type === 'company' ? 'text-blue-600' : 'text-green-600'}`} />
                            <div>
                              <span className="font-medium">
                                {clientDetails.type === 'company' ? 'Commande professionnelle' : 'Commande particulière'}
                              </span>
                              <p className="text-sm text-primary-gray mt-1">
                                {clientDetails.type === 'company' 
                                  ? 'Vous bénéficiez d\'une remise de 15% sur le prix catalogue. Facture avec TVA incluse.' 
                                  : 'Prix TTC avec TVA incluse. Pas de remise professionnelle applicable.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dynamic Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Champs communs */}
                        <div>
                          <label className="block text-sm font-medium text-primary-gray mb-2">
                            <FaUser className="inline mr-2 w-4 h-4" />
                            Prénom
                          </label>
                          <input
                            type="text"
                            {...register("firstName", { required: "Le prénom est requis" })}
                            className="form-input"
                            placeholder="Jean"
                            disabled={loadingClient}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-primary-gray mb-2">
                            <FaUser className="inline mr-2 w-4 h-4" />
                            Nom
                          </label>
                          <input
                            type="text"
                            {...register("lastName", { required: "Le nom est requis" })}
                            className="form-input"
                            placeholder="Dupont"
                            disabled={loadingClient}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-primary-gray mb-2">
                            <FaEnvelope className="inline mr-2 w-4 h-4" />
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
                            placeholder="jean.dupont@email.com"
                            disabled={loadingClient}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-primary-gray mb-2">
                            <FaPhone className="inline mr-2 w-4 h-4" />
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
                            disabled={loadingClient}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                          )}
                        </div>

                        {/* Champs spécifiques aux entreprises */}
                        {clientDetails?.type === 'company' && (
                          <>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-primary-gray mb-2">
                                <FaBuilding className="inline mr-2 w-4 h-4" />
                                Raison sociale
                              </label>
                              <input
                                type="text"
                                {...register("companyName", { required: "La raison sociale est requise" })}
                                className="form-input"
                                placeholder="SARL Dupont & Fils"
                                disabled={loadingClient}
                              />
                              {errors.companyName && (
                                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-primary-gray mb-2">
                                <FaIdCard className="inline mr-2 w-4 h-4" />
                                SIRET
                              </label>
                              <input
                                type="text"
                                {...register("siret", { 
                                  required: "Le SIRET est requis",
                                  pattern: {
                                    value: /^[0-9]{14}$/,
                                    message: "SIRET invalide (14 chiffres requis)"
                                  }
                                })}
                                className="form-input"
                                placeholder="12345678901234"
                                disabled={loadingClient}
                              />
                              {errors.siret && (
                                <p className="mt-1 text-sm text-red-600">{errors.siret.message}</p>
                              )}
                            </div>
                          </>
                        )}

                        {/* Champs d'adresse */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-primary-gray mb-2">
                            <FaMapMarkerAlt className="inline mr-2 w-4 h-4" />
                            Adresse
                          </label>
                          <input
                            type="text"
                            {...register("address", { required: "L'adresse est requise" })}
                            className="form-input"
                            placeholder="123 Avenue des Champs-Élysées"
                            disabled={loadingClient}
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
                            disabled={loadingClient}
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
                            disabled={loadingClient}
                          />
                          {errors.zipCode && (
                            <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                          )}
                        </div>

                        {/* Numéro de permis pour particuliers */}
                        {clientDetails?.type === 'individual' && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-primary-gray mb-2">
                              <FaIdCard className="inline mr-2 w-4 h-4" />
                              Numéro de permis (optionnel)
                            </label>
                            <input
                              type="text"
                              {...register("driverLicense")}
                              className="form-input"
                              placeholder="12AB34567"
                              disabled={loadingClient}
                            />
                          </div>
                        )}
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
                          disabled={loadingClient}
                        >
                          {loadingClient ? 'Chargement...' : 'Continuer vers le paiement →'}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}

            {/* Les autres steps (2 et 3) restent inchangés... */}
            {/* ... Copier les sections step === 2 et step === 3 du code précédent ... */}

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
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {cart.map(item => {
                      const vehicleName = item.vehicle?.marque + ' ' + item.vehicle?.modele || 'Véhicule'
                      const unitPrice = item.unitPrice || item.vehicle?.prixFinal || item.vehicle?.prix || 0
                      const quantity = item.quantity || 1
                      const totalPrice = unitPrice * quantity
                      
                      return (
                        <div key={item.id} className="flex justify-between border-b border-gray-100 pb-3 last:border-0">
                          <div className="max-w-[70%]">
                            <div className="font-medium text-sm truncate">{vehicleName}</div>
                            <div className="text-xs text-primary-gray">
                              {quantity} × {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(unitPrice)}
                            </div>
                            {item.options && item.options.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                +{item.options.length} option(s)
                              </div>
                            )}
                          </div>
                          <div className="font-bold text-right">
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
                  
                  {clientDetails?.type === 'company' && (
                    <div className="flex justify-between text-green-600">
                      <span>Remise entreprise (-15%)</span>
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
                  <div className="space-y-3">
                    {user && (
                      <>
                        <div className="flex items-start gap-2">
                          <FaUser className="w-4 h-4 text-primary-gray mt-1 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="truncate">{user.prenom} {user.nom}</div>
                            <div className="text-sm text-primary-gray truncate">{user.email}</div>
                          </div>
                        </div>
                        {user.telephone && (
                          <div className="flex items-center gap-2">
                            <FaPhone className="w-4 h-4 text-primary-gray" />
                            <span className="text-sm">{user.telephone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FaBuilding className="w-4 h-4 text-primary-gray" />
                          <span className="text-sm">
                            {clientDetails?.type === 'company' ? 'Entreprise' : 'Particulier'}
                            {clientDetails?.siret && (
                              <div className="text-xs text-primary-gray">SIRET: {clientDetails.siret}</div>
                            )}
                          </span>
                        </div>
                      </>
                    )}
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