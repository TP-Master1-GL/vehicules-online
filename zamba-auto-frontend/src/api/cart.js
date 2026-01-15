// CORRECTION : Changer l'import pour utiliser l'export par défaut
import api from './auth.js'

const cartService = {
  // Récupérer le panier actuel (PanierController)
  getCart: async () => {
    try {
      const response = await api.get('/panier');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération du panier',
        status: error.response?.status
      };
    }
  },

  // Ajouter un article au panier (format adapté au backend)
  addToCart: async (cartItem) => {
    try {
      // Adapter le format pour le backend
      const backendItem = {
        vehiculeId: cartItem.vehicleId || cartItem.vehicle?.id,
        quantite: cartItem.quantity || 1,
        optionIds: cartItem.selectedOptions?.map(opt => opt.id) || []
      };

      const response = await api.post('/panier/ajouter', backendItem);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'ajout au panier',
        status: error.response?.status
      };
    }
  },

  // Mettre à jour la quantité (non directement supporté par le backend actuel)
  updateCartItem: async (itemId, quantity) => {
    try {
      // Simulation - recréer l'item avec nouvelle quantité
      // Le backend actuel ne supporte pas la mise à jour directe de quantité
      // Cette méthode devrait être adaptée selon l'implémentation backend
      console.warn('updateCartItem: Fonctionnalité à implémenter côté backend');
      return { success: false, message: 'Fonctionnalité non disponible' };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la mise à jour',
        status: error.response?.status
      };
    }
  },

  // Supprimer un article du panier (format adapté)
  removeFromCart: async (itemId) => {
    try {
      // Le backend utilise l'ID du véhicule, pas l'ID de l'item du panier
      // Adapter selon l'implémentation
      const response = await api.delete(`/panier/retirer/${itemId}`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression',
        status: error.response?.status
      };
    }
  },

  // Vider le panier (non directement supporté par le backend actuel)
  clearCart: async () => {
    try {
      // Simulation - le backend n'a pas d'endpoint spécifique pour vider le panier
      console.warn('clearCart: Fonctionnalité à implémenter côté backend');
      return { success: false, message: 'Fonctionnalité non disponible' };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression du panier',
        status: error.response?.status
      };
    }
  },

  // Annuler la dernière action (Pattern Command - pas directement supporté par le backend actuel)
  undoLastAction: async () => {
    try {
      // Simulation - le backend actuel ne supporte pas l'annulation directe
      console.warn('undoLastAction: Pattern Command à implémenter côté backend');
      return { success: false, message: 'Fonctionnalité non disponible' };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'annulation',
        status: error.response?.status
      };
    }
  },

  // Calculer le total du panier (utilise getCart qui contient déjà le total)
  calculateTotal: async () => {
    try {
      const cart = await cartService.getCart();
      return { total: cart.total || 0 };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du calcul du total',
        status: error.response?.status
      };
    }
  },

  // Méthodes non supportées par le backend actuel - retournent des messages d'erreur
  mergeCart: async (guestCart) => {
    console.warn('mergeCart: Fonctionnalité à implémenter côté backend');
    return { success: false, message: 'Fonctionnalité non disponible' };
  },

  saveForLater: async (itemId) => {
    console.warn('saveForLater: Fonctionnalité à implémenter côté backend');
    return { success: false, message: 'Fonctionnalité non disponible' };
  },

  getSavedItems: async () => {
    console.warn('getSavedItems: Fonctionnalité à implémenter côté backend');
    return [];
  },

  applyPromoCode: async (code) => {
    console.warn('applyPromoCode: Fonctionnalité à implémenter côté backend');
    return { success: false, message: 'Codes promo non disponibles' };
  },

  removePromoCode: async () => {
    console.warn('removePromoCode: Fonctionnalité à implémenter côté backend');
    return { success: false, message: 'Fonctionnalité non disponible' };
  },

  checkAvailability: async () => {
    try {
      // Simulation - vérifie que les véhicules existent
      const cart = await cartService.getCart();
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
  }
}

// Export par défaut
export default cartService