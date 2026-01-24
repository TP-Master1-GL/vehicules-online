import React, { createContext, useState, useContext, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import cartService from '../api/cart'
import { useAuth } from './AuthContext'

export const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  // Charger le panier au démarrage
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        // Charger depuis le backend si connecté
        await fetchCart()
      } else {
        // Charger depuis localStorage si non connecté
        loadCartFromLocalStorage()
      }
    }
    loadCart()
  }, [isAuthenticated])

  // Charger depuis localStorage
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('zamba_cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
        setTotal(calculateCartTotalLocal(parsedCart))
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier depuis localStorage:', error)
    }
  }

  // Sauvegarder dans localStorage
  const saveCartToLocalStorage = (cartItems) => {
    try {
      localStorage.setItem('zamba_cart', JSON.stringify(cartItems))
      const newTotal = calculateCartTotalLocal(cartItems)
      localStorage.setItem('zamba_cart_total', newTotal.toString())
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error)
    }
  }

  // Calculer total local
  const calculateCartTotalLocal = (cartItems) => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.totalPrice || (item.vehicle?.prix || item.vehicle?.price || 0) * item.quantity)
    }, 0)
  }

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      loadCartFromLocalStorage()
      return
    }

    try {
      setLoading(true)
      const cartData = await cartService.getCart()
      
      console.log('📦 Données panier reçues du backend:', cartData)

      // Adapter le format du backend au format frontend
      let formattedCart = []
      
      if (cartData.lignes && cartData.lignes.length > 0) {
        formattedCart = cartData.lignes.map(ligne => ({
          id: ligne.id,
          vehicle: {
            id: ligne.vehicule?.id,
            nom: ligne.vehicule?.nom || ligne.vehicule?.name || 'Véhicule inconnu',
            marque: ligne.vehicule?.marque || ligne.vehicule?.brand,
            modele: ligne.vehicule?.modele || ligne.vehicule?.model,
            prix: ligne.vehicule?.prix || ligne.vehicule?.price || ligne.prixUnitaire,
            imageUrl: ligne.vehicule?.imageUrl || ligne.vehicule?.image,
            typeVehicule: ligne.vehicule?.typeVehicule || ligne.vehicule?.type
          },
          quantity: ligne.quantite || 1,
          selectedOptions: ligne.options || [],
          totalPrice: ligne.prixTotal || (ligne.vehicule?.prix || 0) * (ligne.quantite || 1)
        }))
      } else if (cartData.items && cartData.items.length > 0) {
        formattedCart = cartData.items.map(item => ({
          id: item.id,
          vehicle: {
            id: item.vehicule?.id || item.vehicle?.id,
            nom: item.vehicule?.nom || item.vehicle?.name || 'Véhicule inconnu',
            marque: item.vehicule?.marque || item.vehicle?.brand,
            modele: item.vehicule?.modele || item.vehicle?.model,
            prix: item.vehicule?.prix || item.vehicle?.price || item.prixUnitaire,
            imageUrl: item.vehicule?.imageUrl || item.vehicle?.image,
            typeVehicule: item.vehicule?.typeVehicule || item.vehicle?.type
          },
          quantity: item.quantite || item.quantity || 1,
          selectedOptions: item.options || [],
          totalPrice: item.prixTotal || (item.vehicule?.prix || 0) * (item.quantite || 1)
        }))
      }

      console.log('🛒 Panier formaté pour le frontend:', formattedCart)

      setCart(formattedCart)
      const newTotal = cartData.total || calculateCartTotalLocal(formattedCart)
      setTotal(newTotal)
      
      // Sauvegarder aussi dans localStorage pour persistance
      saveCartToLocalStorage(formattedCart)
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error)
      // En cas d'erreur, charger depuis localStorage
      loadCartFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Fonction addToCart améliorée
  const addToCart = async (vehicle, options = [], quantity = 1) => {
    try {
      setLoading(true)
      
      console.log('➕ Tentative d\'ajout au panier:', {
        vehicleId: vehicle.id,
        vehicleName: vehicle.nom || vehicle.name,
        optionsCount: options.length,
        quantity: quantity
      })

      // Créer l'item pour le panier
      const newItem = {
        id: Date.now(), // ID temporaire
        vehicle: {
          id: vehicle.id,
          nom: vehicle.nom || vehicle.name,
          marque: vehicle.marque || vehicle.brand,
          modele: vehicle.modele || vehicle.model,
          prix: vehicle.prix || vehicle.price,
          imageUrl: vehicle.image || vehicle.imageUrl,
          typeVehicule: vehicle.type || vehicle.typeVehicule
        },
        quantity: quantity,
        selectedOptions: options,
        totalPrice: (vehicle.prix || vehicle.price) * quantity
      }

      console.log('📝 Nouvel item créé:', newItem)

      // Sauvegarder l'état actuel pour undo (Pattern Command)
      setHistory(prev => [...prev, { cart: [...cart], total }])

      if (isAuthenticated && user) {
        // Envoyer au backend si connecté
        const cartItem = {
          vehiculeId: vehicle.id,
          optionIds: options.map(opt => opt.id)
        }
        
        console.log('📤 Envoi API avec payload:', cartItem)
        
        const response = await cartService.addToCart(cartItem)
        console.log('✅ Réponse API:', response)
        
        // Recharger le panier depuis le backend
        await fetchCart()
      } else {
        // Gestion locale si non connecté
        const existingItemIndex = cart.findIndex(item => 
          item.vehicle.id === vehicle.id && 
          JSON.stringify(item.selectedOptions.map(o => o.id).sort()) === 
          JSON.stringify(options.map(o => o.id).sort())
        )

        let updatedCart
        if (existingItemIndex !== -1) {
          // Augmenter la quantité
          updatedCart = [...cart]
          updatedCart[existingItemIndex].quantity += quantity
          updatedCart[existingItemIndex].totalPrice = 
            updatedCart[existingItemIndex].vehicle.prix * updatedCart[existingItemIndex].quantity
          console.log('🔄 Quantité mise à jour pour l\'item existant')
        } else {
          // Ajouter nouvel item
          updatedCart = [...cart, newItem]
          console.log('🆕 Nouvel item ajouté au panier local')
        }

        const newTotal = calculateCartTotalLocal(updatedCart)
        
        setCart(updatedCart)
        setTotal(newTotal)
        saveCartToLocalStorage(updatedCart)
      }

      toast.success(`${vehicle.nom || vehicle.name} ajouté au panier !`)
      return true
    } catch (error) {
      console.error('❌ Erreur addToCart:', error.response || error)
      
      let errorMessage = 'Erreur lors de l\'ajout au panier'
      if (error.message) {
        errorMessage = error.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      if (error.response?.status === 401) {
        errorMessage = 'Veuillez vous connecter pour ajouter au panier'
      }
      
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true)
      
      // Sauvegarder l'état actuel pour undo
      setHistory(prev => [...prev, { cart: [...cart], total }])

      if (isAuthenticated) {
        // Supprimer via l'API
        await cartService.removeFromCart(itemId)
        // Recharger le panier
        await fetchCart()
      } else {
        // Supprimer localement
        const updatedCart = cart.filter(item => item.id !== itemId)
        const newTotal = calculateCartTotalLocal(updatedCart)
        
        setCart(updatedCart)
        setTotal(newTotal)
        saveCartToLocalStorage(updatedCart)
      }

      toast.success('Article supprimé du panier')
    } catch (error) {
      console.error('Erreur removeFromCart:', error)
      toast.error('Erreur lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      setLoading(true)
      
      // Sauvegarder l'état actuel pour undo
      setHistory(prev => [...prev, { cart: [...cart], total }])

      if (isAuthenticated) {
        // Mettre à jour via l'API
        await cartService.updateQuantity(itemId, newQuantity)
        // Recharger le panier
        await fetchCart()
      } else {
        // Mettre à jour localement
        const updatedCart = cart.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: item.vehicle.prix * newQuantity
            }
          }
          return item
        })
        
        const newTotal = calculateCartTotalLocal(updatedCart)
        
        setCart(updatedCart)
        setTotal(newTotal)
        saveCartToLocalStorage(updatedCart)
      }
      
      toast.success('Quantité mise à jour')
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error)
      toast.error('Erreur lors de la mise à jour de la quantité')
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      
      // Sauvegarder l'état actuel pour undo
      setHistory(prev => [...prev, { cart: [...cart], total }])

      if (isAuthenticated) {
        // Vider via l'API
        await cartService.clearCart()
      }
      
      // Mettre à jour le state
      setCart([])
      setTotal(0)
      
      // Supprimer de localStorage
      localStorage.removeItem('zamba_cart')
      localStorage.removeItem('zamba_cart_total')
      
      toast.success('Panier vidé')
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error)
      toast.error('Erreur lors de la suppression du panier')
    } finally {
      setLoading(false)
    }
  }

  // Pattern Command : Annuler la dernière action
  const undoLastAction = async () => {
    if (history.length === 0) {
      toast.error('Aucune action à annuler')
      return
    }

    try {
      setLoading(true)
      const previousState = history[history.length - 1]
      
      // Restaurer l'état précédent
      setCart(previousState.cart)
      setTotal(previousState.total)
      
      // Sauvegarder dans localStorage
      saveCartToLocalStorage(previousState.cart)
      
      // Retirer de l'historique
      setHistory(prev => prev.slice(0, -1))
      
      toast.success('Dernière action annulée')
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error)
      toast.error('Erreur lors de l\'annulation')
    } finally {
      setLoading(false)
    }
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const getCartItems = () => {
    return cart
  }

  const calculateCartTotal = () => {
    const calculatedTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
    setTotal(calculatedTotal)
    return calculatedTotal
  }

  const applyPromoCode = async (code) => {
    try {
      setLoading(true)
      // Simulation de code promo
      if (code === 'ZAMBA10') {
        const discount = total * 0.1 // 10% de réduction
        const discountedTotal = total - discount
        
        toast.success(`Code promo appliqué ! Réduction de ${discount.toFixed(2)} €`)
        return { success: true, discount, newTotal: discountedTotal }
      } else {
        toast.error('Code promo invalide')
        return { success: false }
      }
    } catch (error) {
      toast.error('Erreur lors de l\'application du code promo')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Synchroniser le panier local avec le backend après connexion
  useEffect(() => {
    if (isAuthenticated && cart.length > 0) {
      // Si l'utilisateur se connecte avec un panier local,
      // on pourrait synchroniser avec le backend
      console.log('🔄 Synchronisation du panier local avec le backend...')
    }
  }, [isAuthenticated])

  const value = {
    cart,
    total,
    loading,
    history,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    undoLastAction,
    getCartCount,
    getCartItems,
    calculateCartTotal,
    applyPromoCode,
    // Propriétés dérivées
    itemCount: getCartCount(),
    isEmpty: cart.length === 0,
    cartItems: cart // alias pour compatibilité
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}