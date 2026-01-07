// CORRECTION : Changer l'import pour utiliser l'export par défaut
import api from './auth.js'

const orderService = {
  // Créer une commande
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la création de la commande',
        status: error.response?.status
      }
    }
  },

  // Récupérer toutes les commandes
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des commandes',
        status: error.response?.status
      }
    }
  },

  // Récupérer une commande par ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération de la commande',
        status: error.response?.status
      }
    }
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la mise à jour du statut',
        status: error.response?.status
      }
    }
  },

  // Annuler une commande
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`, { reason })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'annulation de la commande',
        status: error.response?.status
      }
    }
  },

  // Récupérer les documents d'une commande
  getOrderDocuments: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/documents`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des documents',
        status: error.response?.status
      }
    }
  },

  // Télécharger un document spécifique
  downloadDocument: async (orderId, documentType, format = 'pdf') => {
    try {
      const response = await api.get(
        `/orders/${orderId}/documents/${documentType}`,
        { 
          params: { format },
          responseType: 'blob'
        }
      )
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du téléchargement',
        status: error.response?.status
      }
    }
  },

  // Générer un devis
  generateQuote: async (orderData) => {
    try {
      const response = await api.post('/orders/quote', orderData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération du devis',
        status: error.response?.status
      }
    }
  },

  // Convertir un devis en commande
  convertQuoteToOrder: async (quoteId) => {
    try {
      const response = await api.post(`/orders/quotes/${quoteId}/convert`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la conversion',
        status: error.response?.status
      }
    }
  },

  // Calculer les taxes
  calculateTaxes: async (orderData) => {
    try {
      const response = await api.post('/orders/calculate-taxes', orderData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du calcul des taxes',
        status: error.response?.status
      }
    }
  },

  // Traiter un paiement
  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/orders/payment', paymentData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du traitement du paiement',
        status: error.response?.status
      }
    }
  },

  // Demander un crédit
  requestCredit: async (creditData) => {
    try {
      const response = await api.post('/orders/credit', creditData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la demande de crédit',
        status: error.response?.status
      }
    }
  },

  // Suivi de livraison
  trackDelivery: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du suivi de livraison',
        status: error.response?.status
      }
    }
  },

  // Commander une flotte (Pattern Factory)
  createFleetOrder: async (fleetOrderData) => {
    try {
      const response = await api.post('/orders/fleet', fleetOrderData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la création de la commande flotte',
        status: error.response?.status
      }
    }
  },

  // Commander un véhicule avec options (Pattern Builder)
  buildVehicleOrder: async (vehicleOrderData) => {
    try {
      const response = await api.post('/orders/build', vehicleOrderData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la construction de la commande',
        status: error.response?.status
      }
    }
  },

  // Récupérer l'historique des commandes
  getOrderHistory: async (customerId) => {
    try {
      const response = await api.get(`/customers/${customerId}/orders`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération de l\'historique',
        status: error.response?.status
      }
    }
  },

  // Répéter une commande
  repeatOrder: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/repeat`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la répétition de la commande',
        status: error.response?.status
      }
    }
  },

  // Noter une commande
  rateOrder: async (orderId, rating) => {
    try {
      const response = await api.post(`/orders/${orderId}/rate`, rating)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'évaluation',
        status: error.response?.status
      }
    }
  }
}

// Export par défaut
export default orderService