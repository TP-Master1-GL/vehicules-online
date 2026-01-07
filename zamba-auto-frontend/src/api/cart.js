// CORRECTION : Changer l'import pour utiliser l'export par défaut
import api from './auth.js'

const cartService = {
  // Récupérer le panier actuel
  getCart: async () => {
    try {
      const response = await api.get('/cart')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération du panier',
        status: error.response?.status
      }
    }
  },

  // Ajouter un article au panier
  addToCart: async (cartItem) => {
    try {
      const response = await api.post('/cart/items', cartItem)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'ajout au panier',
        status: error.response?.status
      }
    }
  },

  // Mettre à jour la quantité d'un article
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la mise à jour',
        status: error.response?.status
      }
    }
  },

  // Supprimer un article du panier
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression',
        status: error.response?.status
      }
    }
  },

  // Vider le panier
  clearCart: async () => {
    try {
      const response = await api.delete('/cart')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression du panier',
        status: error.response?.status
      }
    }
  },

  // Annuler la dernière action (Pattern Command)
  undoLastAction: async () => {
    try {
      const response = await api.post('/cart/undo')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'annulation',
        status: error.response?.status
      }
    }
  },

  // Calculer le total du panier
  calculateTotal: async () => {
    try {
      const response = await api.get('/cart/total')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du calcul du total',
        status: error.response?.status
      }
    }
  },

  // Fusionner le panier (après connexion)
  mergeCart: async (guestCart) => {
    try {
      const response = await api.post('/cart/merge', { guestCart })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la fusion du panier',
        status: error.response?.status
      }
    }
  },

  // Sauvegarder le panier pour plus tard
  saveForLater: async (itemId) => {
    try {
      const response = await api.post(`/cart/items/${itemId}/save`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la sauvegarde',
        status: error.response?.status
      }
    }
  },

  // Récupérer les articles sauvegardés
  getSavedItems: async () => {
    try {
      const response = await api.get('/cart/saved')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des articles sauvegardés',
        status: error.response?.status
      }
    }
  },

  // Appliquer un code promo
  applyPromoCode: async (code) => {
    try {
      const response = await api.post('/cart/promo', { code })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'application du code promo',
        status: error.response?.status
      }
    }
  },

  // Supprimer un code promo
  removePromoCode: async () => {
    try {
      const response = await api.delete('/cart/promo')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression du code promo',
        status: error.response?.status
      }
    }
  },

  // Vérifier la disponibilité des articles
  checkAvailability: async () => {
    try {
      const response = await api.get('/cart/availability')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la vérification de disponibilité',
        status: error.response?.status
      }
    }
  }
}

// Export par défaut
export default cartService