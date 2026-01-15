// API service pour les véhicules - utilisant les routes backend
import api from './auth.js'

const vehiculesService = {
  // CATALOGUE - Routes disponibles
  // GET /catalogue/une-ligne - Affichage une ligne par véhicule
  // GET /catalogue/trois-lignes - Affichage trois lignes par véhicule
  // GET /catalogue/soldes - Véhicules en solde
  // GET /catalogue/{id} - Véhicule par ID

  // Récupérer le catalogue avec affichage une ligne
  getCatalogueUneLigne: async () => {
    try {
      const response = await api.get('/catalogue/une-ligne')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du catalogue')
    }
  },

  // Récupérer le catalogue avec affichage trois lignes
  getCatalogueTroisLignes: async () => {
    try {
      const response = await api.get('/catalogue/trois-lignes')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du catalogue')
    }
  },

  // Récupérer les véhicules en solde
  getVehiculesSoldes: async () => {
    try {
      const response = await api.get('/catalogue/soldes')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des soldes')
    }
  },

  // Récupérer un véhicule par ID
  getVehiculeById: async (id) => {
    try {
      const response = await api.get(`/catalogue/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Véhicule non trouvé')
    }
  },

  // COMMANDES - Routes disponibles
  // POST /commandes - Créer une commande
  // GET /commandes/{id} - Obtenir commande par ID
  // GET /commandes/client/{clientId} - Commandes d'un client
  // PUT /commandes/{id}/statut - Modifier statut
  // POST /commandes/{id}/valider - Valider commande
  // POST /commandes/solder-vehicule/{vehiculeId} - Appliquer solde
  // GET /commandes/stats/{clientId} - Stats commandes client

  // Créer une commande
  creerCommande: async (commandeData) => {
    try {
      const response = await api.post('/commandes', commandeData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de la commande')
    }
  },

  // Obtenir une commande par ID
  getCommandeById: async (id) => {
    try {
      const response = await api.get(`/commandes/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Commande non trouvée')
    }
  },

  // Obtenir les commandes d'un client
  getCommandesByClient: async (clientId) => {
    try {
      const response = await api.get(`/commandes/client/${clientId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des commandes')
    }
  },

  // Modifier le statut d'une commande
  updateStatutCommande: async (id, statut) => {
    try {
      const response = await api.put(`/commandes/${id}/statut`, { statut })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut')
    }
  },

  // Valider une commande
  validerCommande: async (id) => {
    try {
      const response = await api.post(`/commandes/${id}/valider`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la validation de la commande')
    }
  },

  // Appliquer un solde à un véhicule (Pattern Command)
  appliquerSolde: async (vehiculeId, pourcentage) => {
    try {
      const response = await api.post(`/commandes/solder-vehicule/${vehiculeId}`, null, {
        params: { pourcentage }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'application du solde')
    }
  },

  // Obtenir les statistiques des commandes d'un client
  getStatsCommandes: async (clientId) => {
    try {
      const response = await api.get(`/commandes/stats/${clientId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des statistiques')
    }
  },

  // PANIER - Routes disponibles
  // POST /panier/ajouter - Ajouter au panier
  // DELETE /panier/retirer/{vehiculeId} - Retirer du panier
  // GET /panier - Obtenir le panier

  // Ajouter un véhicule au panier
  ajouterAuPanier: async (vehiculeId, quantite = 1) => {
    try {
      const response = await api.post('/panier/ajouter', {
        vehiculeId,
        quantite
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout au panier')
    }
  },

  // Retirer un véhicule du panier
  retirerDuPanier: async (vehiculeId) => {
    try {
      const response = await api.delete(`/panier/retirer/${vehiculeId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du panier')
    }
  },

  // Obtenir le contenu du panier
  getPanier: async () => {
    try {
      const response = await api.get('/panier')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du panier')
    }
  },

  // PDF - Routes disponibles
  // POST /pdf/generate - Générer PDF
  // GET /pdf/download/{commandeId}/{documentType} - Télécharger PDF
  // GET /pdf/liasse/{commandeId} - Télécharger liasse complète
  // GET /pdf/preview/{commandeId}/{documentType} - Aperçu PDF

  // Générer un document PDF
  generatePdf: async (commandeId, documentType) => {
    try {
      const response = await api.post('/pdf/generate', {
        commandeId,
        documentType
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la génération du PDF')
    }
  },

  // Télécharger un PDF
  downloadPdf: async (commandeId, documentType) => {
    try {
      const response = await api.get(`/pdf/download/${commandeId}/${documentType}`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement du PDF')
    }
  },

  // Télécharger la liasse complète de documents
  downloadLiasse: async (commandeId) => {
    try {
      const response = await api.get(`/pdf/liasse/${commandeId}`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement de la liasse')
    }
  },

  // FORMS - Routes disponibles (Pattern Bridge)
  // GET /forms/vehicule - Formulaire véhicule
  // GET /forms/commande - Formulaire commande
  // POST /forms/vehicule/submit - Soumettre formulaire véhicule
  // POST /forms/commande/submit - Soumettre formulaire commande

  // Obtenir le formulaire véhicule
  getFormulaireVehicule: async () => {
    try {
      const response = await api.get('/forms/vehicule')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du formulaire véhicule')
    }
  },

  // Obtenir le formulaire commande
  getFormulaireCommande: async () => {
    try {
      const response = await api.get('/forms/commande')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du formulaire commande')
    }
  },

  // Soumettre le formulaire véhicule
  submitFormulaireVehicule: async (formData) => {
    try {
      const response = await api.post('/forms/vehicule/submit', formData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la soumission du formulaire véhicule')
    }
  },

  // Soumettre le formulaire commande
  submitFormulaireCommande: async (formData) => {
    try {
      const response = await api.post('/forms/commande/submit', formData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la soumission du formulaire commande')
    }
  }
}

export default vehiculesService
