// CORRECTION : Changer l'import pour utiliser l'export par défaut
import api from './auth.js'

const orderService = {
  // Créer une commande (CommandeController)
  createOrder: async (orderData) => {
    try {
      // Adapter le format pour le backend
      const backendOrderData = {
        clientId: orderData.clientId,
        typePaiement: orderData.paymentType || 'COMPTANT',
        vehiculeIds: orderData.vehicleIds || []
      };

      const response = await api.post('/commandes', backendOrderData);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la création de la commande',
        status: error.response?.status
      };
    }
  },

  // Récupérer toutes les commandes de l'utilisateur
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/commandes', { params });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des commandes',
        status: error.response?.status
      };
    }
  },

  // Récupérer une commande par ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/commandes/${orderId}`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération de la commande',
        status: error.response?.status
      };
    }
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/commandes/${orderId}/statut`, { statut: status });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la mise à jour du statut',
        status: error.response?.status
      };
    }
  },

  // Annuler une commande (utilise updateOrderStatus avec 'ANNULEE')
  cancelOrder: async (orderId, reason) => {
    try {
      return await orderService.updateOrderStatus(orderId, 'ANNULEE');
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'annulation de la commande',
        status: error.response?.status
      };
    }
  },

  // Récupérer les documents d'une commande
  getOrderDocuments: async (orderId) => {
    try {
      const response = await api.get(`/commandes/${orderId}/documents`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des documents',
        status: error.response?.status
      };
    }
  },

  // Télécharger un document spécifique (format adapté au backend)
  downloadDocument: async (orderId, documentId, format = 'PDF') => {
    try {
      const response = await api.get(
        `/commandes/${orderId}/documents/${documentId}/download`,
        {
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du téléchargement',
        status: error.response?.status
      };
    }
  },

  // Méthodes non encore implémentées côté backend - simulation ou messages informatifs

  // Générer un devis (utilise createOrder pour l'instant)
  generateQuote: async (orderData) => {
    console.warn('generateQuote: Fonctionnalité devis à implémenter côté backend');
    // Simulation : retourne les mêmes données que createOrder
    return await orderService.createOrder(orderData);
  },

  // Convertir un devis en commande (non implémenté)
  convertQuoteToOrder: async (quoteId) => {
    console.warn('convertQuoteToOrder: Fonctionnalité à implémenter côté backend');
    return { success: false, message: 'Fonctionnalité non disponible' };
  },

  // Calculer les taxes (simulation simple)
  calculateTaxes: async (orderData) => {
    try {
      // Simulation - calcul simplifié selon le pays
      const country = orderData.country || 'FR';
      const taxRates = {
        'FR': 0.20, // 20% TVA France
        'BE': 0.21, // 21% TVA Belgique
        'LU': 0.17  // 17% TVA Luxembourg
      };

      const rate = taxRates[country] || 0.20;
      const subtotal = orderData.amount || 0;
      const taxes = Math.round(subtotal * rate * 100) / 100;
      const total = subtotal + taxes;

      return {
        subtotal,
        taxes,
        total,
        rate,
        country
      };
    } catch (error) {
      throw {
        message: 'Erreur lors du calcul des taxes',
        status: 500
      };
    }
  },

  // Traiter un paiement (non implémenté côté backend)
  processPayment: async (paymentData) => {
    console.warn('processPayment: Fonctionnalité paiement à implémenter côté backend');
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      message: 'Paiement simulé avec succès'
    };
  },

  // Demander un crédit (utilise createOrder avec type CREDIT)
  requestCredit: async (creditData) => {
    try {
      const orderData = {
        ...creditData,
        paymentType: 'CREDIT'
      };
      return await orderService.createOrder(orderData);
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la demande de crédit',
        status: error.response?.status
      };
    }
  },

  // Suivi de livraison (non implémenté)
  trackDelivery: async (orderId) => {
    console.warn('trackDelivery: Fonctionnalité suivi à implémenter côté backend');
    // Simulation de suivi
    return {
      status: 'in_transit',
      estimatedDelivery: '2026-01-15',
      currentLocation: 'Centre de distribution Paris',
      trackingNumber: `TRK${orderId}`
    };
  },

  // Commander une flotte (utilise createOrder normal)
  createFleetOrder: async (fleetOrderData) => {
    console.warn('createFleetOrder: Pattern Factory à implémenter côté backend');
    return await orderService.createOrder(fleetOrderData);
  },

  // Commander un véhicule avec options (Pattern Builder - utilise createOrder)
  buildVehicleOrder: async (vehicleOrderData) => {
    console.warn('buildVehicleOrder: Pattern Builder à implémenter côté backend');
    return await orderService.createOrder(vehicleOrderData);
  },

  // Récupérer l'historique des commandes (utilise getAllOrders)
  getOrderHistory: async (customerId) => {
    return await orderService.getAllOrders({ clientId: customerId });
  },

  // Répéter une commande (non implémenté)
  repeatOrder: async (orderId) => {
    console.warn('repeatOrder: Fonctionnalité à implémenter côté backend');
    try {
      const order = await orderService.getOrderById(orderId);
      // Simulation : créer une nouvelle commande basée sur l'ancienne
      const repeatData = {
        clientId: order.client.id,
        typePaiement: order.typePaiement,
        vehiculeIds: order.lignes.map(ligne => ligne.vehicule.id)
      };
      return await orderService.createOrder(repeatData);
    } catch (error) {
      throw {
        message: 'Erreur lors de la répétition de la commande',
        status: 500
      };
    }
  },

  // Noter une commande (non implémenté)
  rateOrder: async (orderId, rating) => {
    console.warn('rateOrder: Fonctionnalité évaluation à implémenter côté backend');
    return {
      success: true,
      message: 'Évaluation enregistrée',
      rating
    };
  },

  // Récupérer les documents d'une commande
  getOrderDocuments: async (orderId) => {
    try {
      const response = await api.get(`/commandes/${orderId}/documents`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des documents',
        status: error.response?.status
      };
    }
  },

  // Télécharger un document
  downloadDocument: async (orderId, documentId) => {
    try {
      const response = await api.get(`/commandes/${orderId}/documents/${documentId}/download`, {
        responseType: 'blob'
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document-${documentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du téléchargement du document',
        status: error.response?.status
      };
    }
  }
}

// Export par défaut
export default orderService