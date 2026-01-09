// CORRECTION : Changer l'import pour utiliser l'export par défaut
import api from './auth.js'

const documentService = {
  // Générer un document
  generateDocument: async (documentData) => {
    try {
      const response = await api.post('/documents/generate', documentData, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération du document',
        status: error.response?.status
      }
    }
  },

  // Générer une facture
  generateInvoice: async (orderId, format = 'pdf') => {
    try {
      const response = await api.get(`/documents/invoice/${orderId}`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération de la facture',
        status: error.response?.status
      }
    }
  },

  // Générer un devis
  generateQuote: async (quoteId, format = 'pdf') => {
    try {
      const response = await api.get(`/documents/quote/${quoteId}`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération du devis',
        status: error.response?.status
      }
    }
  },

  // Générer un contrat
  generateContract: async (contractId, format = 'pdf') => {
    try {
      const response = await api.get(`/documents/contract/${contractId}`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération du contrat',
        status: error.response?.status
      }
    }
  },

  // Générer un bon de commande
  generatePurchaseOrder: async (orderId, format = 'pdf') => {
    try {
      const response = await api.get(`/documents/purchase-order/${orderId}`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération du bon de commande',
        status: error.response?.status
      }
    }
  },

  // Générer un certificat de cession
  generateTransferCertificate: async (vehicleId, format = 'pdf') => {
    try {
      const response = await api.get(`/documents/transfer-certificate/${vehicleId}`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération du certificat de cession',
        status: error.response?.status
      }
    }
  },

  // Générer une demande d'immatriculation
  generateRegistrationRequest: async (vehicleId, format = 'pdf') => {
    try {
      const response = await api.get(`/documents/registration-request/${vehicleId}`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération de la demande d\'immatriculation',
        status: error.response?.status
      }
    }
  },

  // Générer un rapport d'expertise
  generateInspectionReport: async (vehicleId, format = 'pdf') => {
    try {
      const response = await api.get(`/documents/inspection-report/${vehicleId}`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération du rapport d\'expertise',
        status: error.response?.status
      }
    }
  },

  // Générer une liasse de documents (Pattern Builder)
  generateDocumentBundle: async (bundleData) => {
    try {
      const response = await api.post('/documents/bundle', bundleData, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération de la liasse',
        status: error.response?.status
      }
    }
  },

  // Télécharger plusieurs documents en ZIP
  downloadDocumentsZip: async (documentIds) => {
    try {
      const response = await api.post('/documents/download-zip', { documentIds }, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du téléchargement des documents',
        status: error.response?.status
      }
    }
  },

  // Liste des documents disponibles
  getAvailableDocuments: async (orderId) => {
    try {
      const response = await api.get(`/documents/available/${orderId}`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des documents disponibles',
        status: error.response?.status
      }
    }
  },

  // Historique des documents générés
  getDocumentHistory: async (customerId) => {
    try {
      const response = await api.get(`/documents/history/${customerId}`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération de l\'historique',
        status: error.response?.status
      }
    }
  }
}

// Export par défaut
export default documentService