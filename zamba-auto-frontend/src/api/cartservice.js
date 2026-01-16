// CORRECTION : Changer l'import pour utiliser l'export par défaut
import api from './auth.js'

const cartService = {
  // Récupérer le panier d'un client
  getCart: async (clientId) => {
    try {
      const response = await api.get(`/api/panier/${clientId}`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération du panier',
        status: error.response?.status
      };
    }
  },

  // Ajouter un article au panier - ADAPTÉ POUR LE BACKEND
  addToCart: async (cartData) => {
    try {
      // Format adapté pour le backend
      const backendData = {
        clientId: cartData.clientId,
        vehiculeId: cartData.vehiculeId || cartData.vehicleId,
        optionsIds: cartData.optionsIds || cartData.optionIds || []
      };

      const response = await api.post('/api/panier/ajouter', backendData);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'ajout au panier',
        status: error.response?.status
      };
    }
  },

  // Modifier la quantité d'une ligne de panier
  updateCartItemQuantity: async (updateData) => {
    try {
      const response = await api.put('/api/panier/modifier-quantite', {
        clientId: updateData.clientId,
        lignePanierId: updateData.lignePanierId,
        nouvelleQuantite: updateData.nouvelleQuantite
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la mise à jour de la quantité',
        status: error.response?.status
      };
    }
  },

  // Retirer une ligne du panier
  removeFromCart: async (clientId, lignePanierId) => {
    try {
      const response = await api.delete(`/api/panier/retirer/${lignePanierId}`, {
        params: { clientId }
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression',
        status: error.response?.status
      };
    }
  },

  // Vider le panier d'un client
  clearCart: async (clientId) => {
    try {
      const response = await api.delete(`/api/panier/vider/${clientId}`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression du panier',
        status: error.response?.status
      };
    }
  },

  // Ajouter une option à une ligne de panier
  addOptionToCartItem: async (optionData) => {
    try {
      const response = await api.post('/api/panier/ajouter-option', {
        clientId: optionData.clientId,
        lignePanierId: optionData.lignePanierId,
        optionId: optionData.optionId
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'ajout de l\'option',
        status: error.response?.status
      };
    }
  },

  // Retirer une option d'une ligne de panier
  removeOptionFromCartItem: async (optionData) => {
    try {
      const response = await api.delete('/api/panier/retirer-option', {
        data: {
          clientId: optionData.clientId,
          lignePanierId: optionData.lignePanierId,
          optionId: optionData.optionId
        }
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du retrait de l\'option',
        status: error.response?.status
      };
    }
  },

  // Simulation - Annuler la dernière action (Pattern Command)
  undoLastAction: async () => {
    console.warn('undoLastAction: Pattern Command à implémenter côté backend');
    return { 
      success: false, 
      message: 'Fonctionnalité non disponible côté backend' 
    };
  },

  // Simulation - Calculer le total du panier
  calculateTotal: async (clientId) => {
    try {
      const cart = await cartService.getCart(clientId);
      return { 
        total: cart.montantTotal || 0,
        itemsCount: cart.nombreArticles || 0
      };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du calcul du total',
        status: error.response?.status
      };
    }
  },

  // Simulation - Vérifier la disponibilité
  checkAvailability: async (clientId) => {
    try {
      const cart = await cartService.getCart(clientId);
      // Simulation simple
      return {
        available: true,
        unavailableItems: [],
        message: 'Tous les articles sont disponibles'
      };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la vérification de disponibilité',
        status: error.response?.status
      };
    }
  },

  // Simulation - Appliquer un code promo
  applyPromoCode: async (code) => {
    console.warn('applyPromoCode: Fonctionnalité à implémenter côté backend');
    return { 
      success: false, 
      message: 'Codes promo non disponibles côté backend' 
    };
  },

  // Simulation - Fusionner les paniers (guest/user)
  mergeCart: async (guestCart) => {
    console.warn('mergeCart: Fonctionnalité à implémenter côté backend');
    return { 
      success: false, 
      message: 'Fonctionnalité non disponible' 
    };
  },

  // Simulation - Sauvegarder pour plus tard
  saveForLater: async (itemId) => {
    console.warn('saveForLater: Fonctionnalité à implémenter côté backend');
    return { 
      success: false, 
      message: 'Fonctionnalité non disponible' 
    };
  },

  // Simulation - Récupérer les articles sauvegardés
  getSavedItems: async () => {
    console.warn('getSavedItems: Fonctionnalité à implémenter côté backend');
    return [];
  }
}

// Export par défaut
export default cartService;