// API service pour l'administration - utilisant les routes backend
import api from './auth.js'

const adminService = {
  // ADMIN - Routes disponibles
  // GET /admin/utilisateurs - Liste utilisateurs
  // POST /admin/utilisateurs - Créer utilisateur
  // PUT /admin/utilisateurs/{id}/role - Modifier rôle
  // PUT /admin/utilisateurs/{id}/desactiver - Désactiver utilisateur
  // GET /admin/configurations - Configurations système
  // PUT /admin/configurations/{key} - Modifier configuration
  // GET /admin/health-detailed - Santé détaillée
  // GET /admin/metrics - Métriques système
  // POST /admin/database/backup - Sauvegarde BD
  // POST /admin/database/optimize - Optimisation BD

  // Gestion des utilisateurs
  getUtilisateurs: async () => {
    try {
      const response = await api.get('/admin/utilisateurs')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des utilisateurs')
    }
  },

  creerUtilisateur: async (userData) => {
    try {
      const response = await api.post('/admin/utilisateurs', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur')
    }
  },

  modifierRoleUtilisateur: async (userId, role) => {
    try {
      const response = await api.put(`/admin/utilisateurs/${userId}/role`, { role })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la modification du rôle')
    }
  },

  desactiverUtilisateur: async (userId) => {
    try {
      const response = await api.put(`/admin/utilisateurs/${userId}/desactiver`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la désactivation de l\'utilisateur')
    }
  },

  // Configurations système
  getConfigurations: async () => {
    try {
      const response = await api.get('/admin/configurations')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des configurations')
    }
  },

  modifierConfiguration: async (key, value) => {
    try {
      const response = await api.put(`/admin/configurations/${key}`, { value })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la modification de la configuration')
    }
  },

  // Monitoring système
  getHealthDetailed: async () => {
    try {
      const response = await api.get('/admin/health-detailed')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement de la santé système')
    }
  },

  getMetrics: async () => {
    try {
      const response = await api.get('/admin/metrics')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des métriques')
    }
  },

  // Base de données
  backupDatabase: async () => {
    try {
      const response = await api.post('/admin/database/backup')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la sauvegarde de la base de données')
    }
  },

  optimizeDatabase: async () => {
    try {
      const response = await api.post('/admin/database/optimize')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'optimisation de la base de données')
    }
  },

  // Gestion des véhicules
  getVehicules: async () => {
    try {
      const response = await api.get('/admin/vehicules')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des véhicules')
    }
  },

  getVehiculeById: async (id) => {
    try {
      const response = await api.get(`/admin/vehicules/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du véhicule')
    }
  },

  createVehicule: async (vehiculeData) => {
    try {
      const response = await api.post('/admin/vehicules', vehiculeData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du véhicule')
    }
  },

  updateVehicule: async (id, vehiculeData) => {
    try {
      const response = await api.put(`/admin/vehicules/${id}`, vehiculeData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du véhicule')
    }
  },

  deleteVehicule: async (id) => {
    try {
      const response = await api.delete(`/admin/vehicules/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du véhicule')
    }
  },

  mettreEnSolde: async (id, pourcentageSolde) => {
    try {
      const response = await api.put(`/admin/vehicules/${id}/solde`, { pourcentageSolde })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise en solde')
    }
  },

  // Gestion des commandes
  getCommandes: async (statut) => {
    try {
      const url = statut ? `/admin/commandes?statut=${statut}` : '/admin/commandes'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des commandes')
    }
  },

  getCommandeById: async (id) => {
    try {
      const response = await api.get(`/admin/commandes/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement de la commande')
    }
  },

  updateCommandeStatut: async (id, statut) => {
    try {
      const response = await api.put(`/admin/commandes/${id}/statut`, { statut })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut')
    }
  },

  // Gestion des options
  getOptions: async () => {
    try {
      const response = await api.get('/admin/options')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des options')
    }
  },

  createOption: async (optionData) => {
    try {
      const response = await api.post('/admin/options', optionData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'option')
    }
  },

  updateOption: async (id, optionData) => {
    try {
      const response = await api.put(`/admin/options/${id}`, optionData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'option')
    }
  },

  deleteOption: async (id) => {
    try {
      const response = await api.delete(`/admin/options/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'option')
    }
  }
}

export default adminService
