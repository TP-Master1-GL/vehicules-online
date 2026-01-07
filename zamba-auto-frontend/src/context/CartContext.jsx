import React, { createContext, useState, useContext, useCallback } from 'react'
import toast from 'react-hot-toast'

// CORRECTION : Ajouter 'export' devant createContext
export const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      // Simulation - Récupération du panier depuis localStorage
      const storedCart = localStorage.getItem('zamba_cart')
      const storedTotal = localStorage.getItem('zamba_cart_total')
      
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        setCart(parsedCart)
        setTotal(parsedCart.reduce((sum, item) => sum + item.totalPrice, 0))
      } else {
        setCart([])
        setTotal(0)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error)
      setCart([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  const addToCart = async (vehicle, options = [], quantity = 1) => {
    try {
      setLoading(true)
      // Sauvegarder l'état actuel pour undo (Pattern Command)
      setHistory(prev => [...prev, { cart: [...cart], total }])
      
      const cartItem = {
        id: Date.now(),
        vehicle,
        options,
        quantity,
        unitPrice: vehicle.price,
        totalPrice: vehicle.price * quantity,
        addedAt: new Date().toISOString()
      }
      
      const newCart = [...cart, cartItem]
      const newTotal = newCart.reduce((sum, item) => sum + item.totalPrice, 0)
      
      // Mettre à jour le state
      setCart(newCart)
      setTotal(newTotal)
      
      // Sauvegarder dans localStorage
      localStorage.setItem('zamba_cart', JSON.stringify(newCart))
      localStorage.setItem('zamba_cart_total', newTotal.toString())
      
      toast.success('Véhicule ajouté au panier !')
      return cartItem
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'ajout au panier')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true)
      // Sauvegarder l'état actuel pour undo
      setHistory(prev => [...prev, { cart: [...cart], total }])
      
      const newCart = cart.filter(item => item.id !== itemId)
      const newTotal = newCart.reduce((sum, item) => sum + item.totalPrice, 0)
      
      // Mettre à jour le state
      setCart(newCart)
      setTotal(newTotal)
      
      // Sauvegarder dans localStorage
      localStorage.setItem('zamba_cart', JSON.stringify(newCart))
      localStorage.setItem('zamba_cart_total', newTotal.toString())
      
      toast.success('Article supprimé du panier')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true)
      // Sauvegarder l'état actuel pour undo
      setHistory(prev => [...prev, { cart: [...cart], total }])
      
      const newCart = cart.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          }
        }
        return item
      })
      
      const newTotal = newCart.reduce((sum, item) => sum + item.totalPrice, 0)
      
      // Mettre à jour le state
      setCart(newCart)
      setTotal(newTotal)
      
      // Sauvegarder dans localStorage
      localStorage.setItem('zamba_cart', JSON.stringify(newCart))
      localStorage.setItem('zamba_cart_total', newTotal.toString())
      
      toast.success('Quantité mise à jour')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      // Sauvegarder l'état actuel pour undo
      setHistory(prev => [...prev, { cart: [...cart], total }])
      
      // Mettre à jour le state
      setCart([])
      setTotal(0)
      
      // Supprimer de localStorage
      localStorage.removeItem('zamba_cart')
      localStorage.removeItem('zamba_cart_total')
      
      toast.success('Panier vidé')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression du panier')
      throw error
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
      localStorage.setItem('zamba_cart', JSON.stringify(previousState.cart))
      localStorage.setItem('zamba_cart_total', previousState.total.toString())
      
      // Retirer de l'historique
      setHistory(prev => prev.slice(0, -1))
      
      toast.success('Dernière action annulée')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'annulation')
      throw error
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
    applyPromoCode
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}