// API service pour la gestion - utilisant les routes backend
import api from './auth.js'

const managerService = {
  // MANAGER - Routes disponibles
  // GET /manager/dashboard - Tableau de bord
  // GET /manager/vehicules - Liste véhicules
  // POST /manager/vehicules - Créer véhicule
  // PUT /manager/vehicules/{id} - Modifier véhicule
  // DELETE /manager/vehicules/{id} - Supprimer véhicule
  // GET /manager/commandes/pending - Commandes en attente
  // PUT /manager/commandes/{id}/valider - Valider commande
  // PUT /manager/commandes/{id}/rejeter - Rejeter commande
  // GET /manager/reports/ventes-mensuelles - Rapport ventes

  // Tableau de bord
  getDashboard: async () => {
    try {
      const response = await api.get('/manager/dashboard')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du tableau de bord')
    }
  },

  // Gestion des véhicules
  getVehicules: async () => {
    try {
      const response = await api.get('/manager/vehicules')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des véhicules')
    }
  },

  creerVehicule: async (vehiculeData) => {
    try {
      const response = await api.post('/manager/vehicules', vehiculeData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du véhicule')
    }
  },

  modifierVehicule: async (id, vehiculeData) => {
    try {
      const response = await api.put(`/manager/vehicules/${id}`, vehiculeData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la modification du véhicule')
    }
  },

  supprimerVehicule: async (id) => {
    try {
      const response = await api.delete(`/manager/vehicules/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du véhicule')
    }
  },

  // Gestion des commandes
  getCommandesPending: async () => {
    try {
      const response = await api.get('/manager/commandes/pending')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des commandes en attente')
    }
  },

  validerCommande: async (id) => {
    try {
      const response = await api.put(`/manager/commandes/${id}/valider`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la validation de la commande')
    }
  },

  rejeterCommande: async (id, raison) => {
    try {
      const response = await api.put(`/manager/commandes/${id}/rejeter`, { raison })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du rejet de la commande')
    }
  },

  // Rapports
  getRapportVentesMensuelles: async () => {
    try {
      const response = await api.get('/manager/reports/ventes-mensuelles')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du rapport de ventes')
    }
  }
}

export default managerService
