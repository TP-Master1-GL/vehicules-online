// Service pour les documents PDF - utilisant les routes backend /pdf/*
import api from './auth.js'

const documentService = {
  // Générer un document PDF (Pattern Builder + Adapter)
  generateDocument: async (orderId, documentType) => {
    try {
      const response = await api.post('/pdf/generate', {
        commandeId: orderId,
        documentType: documentType // 'immatriculation', 'cession', 'bon_commande'
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération du document',
        status: error.response?.status
      }
    }
  },

  // Télécharger un document PDF
  downloadDocument: async (orderId, documentType) => {
    try {
      const response = await api.get(`/pdf/download/${orderId}/${documentType}`, {
        responseType: 'blob'
      })

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${documentType}-${orderId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du téléchargement du document',
        status: error.response?.status
      }
    }
  },

  // Télécharger la liasse complète de documents (Pattern Builder)
  downloadDocumentBundle: async (orderId) => {
    try {
      const response = await api.get(`/pdf/liasse/${orderId}`, {
        responseType: 'blob'
      })

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `liasse-complete-${orderId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du téléchargement de la liasse',
        status: error.response?.status
      }
    }
  },

  // Aperçu d'un document PDF
  previewDocument: async (orderId, documentType) => {
    try {
      const response = await api.get(`/pdf/preview/${orderId}/${documentType}`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'aperçu du document',
        status: error.response?.status
      }
    }
  },

  // Générer un bon de commande (utilise generateDocument avec type 'bon_commande')
  generatePurchaseOrder: async (orderId) => {
    return await documentService.generateDocument(orderId, 'bon_commande')
  },

  // Générer un certificat de cession
  generateTransferCertificate: async (orderId) => {
    return await documentService.generateDocument(orderId, 'cession')
  },

  // Générer une demande d'immatriculation
  generateRegistrationRequest: async (orderId) => {
    return await documentService.generateDocument(orderId, 'immatriculation')
  },

  // Méthodes non implémentées côté backend - retournent des messages informatifs
  generateInvoice: async (orderId) => {
    console.warn('generateInvoice: Facture non séparée du bon de commande côté backend')
    return await documentService.generatePurchaseOrder(orderId)
  },

  generateQuote: async (quoteId) => {
    console.warn('generateQuote: Devis à implémenter côté backend')
    return { success: false, message: 'Fonctionnalité devis non disponible' }
  },

  generateContract: async (contractId) => {
    console.warn('generateContract: Contrat à implémenter côté backend')
    return { success: false, message: 'Fonctionnalité contrat non disponible' }
  },

  generateInspectionReport: async (vehicleId) => {
    console.warn('generateInspectionReport: Rapport d\'expertise à implémenter côté backend')
    return { success: false, message: 'Fonctionnalité rapport d\'expertise non disponible' }
  },

  getAvailableDocuments: async (orderId) => {
    console.warn('getAvailableDocuments: Liste à implémenter côté backend')
    // Simulation des documents disponibles
    return [
      { id: 'bon_commande', name: 'Bon de commande', available: true },
      { id: 'cession', name: 'Certificat de cession', available: true },
      { id: 'immatriculation', name: 'Demande d\'immatriculation', available: true }
    ]
  },

  getDocumentHistory: async (customerId) => {
    console.warn('getDocumentHistory: Historique à implémenter côté backend')
    return []
  }
}

// Export par défaut
export default documentService