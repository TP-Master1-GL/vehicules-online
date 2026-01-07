// CORRECTION : Changer l'import pour utiliser l'export par défaut
import api from './auth.js'

const companyService = {
  // Récupérer les informations de l'entreprise
  getCompany: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des informations de l\'entreprise',
        status: error.response?.status
      }
    }
  },

  // Mettre à jour les informations de l'entreprise
  updateCompany: async (companyId, companyData) => {
    try {
      const response = await api.put(`/companies/${companyId}`, companyData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'entreprise',
        status: error.response?.status
      }
    }
  },

  // Récupérer les filiales
  getSubsidiaries: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/subsidiaries`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des filiales',
        status: error.response?.status
      }
    }
  },

  // Créer une filiale
  createSubsidiary: async (companyId, subsidiaryData) => {
    try {
      const response = await api.post(`/companies/${companyId}/subsidiaries`, subsidiaryData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la création de la filiale',
        status: error.response?.status
      }
    }
  },

  // Mettre à jour une filiale
  updateSubsidiary: async (subsidiaryId, subsidiaryData) => {
    try {
      const response = await api.put(`/subsidiaries/${subsidiaryId}`, subsidiaryData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la mise à jour de la filiale',
        status: error.response?.status
      }
    }
  },

  // Supprimer une filiale
  deleteSubsidiary: async (subsidiaryId) => {
    try {
      const response = await api.delete(`/subsidiaries/${subsidiaryId}`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression de la filiale',
        status: error.response?.status
      }
    }
  },

  // Récupérer les commandes de flotte
  getFleetOrders: async (companyId, params = {}) => {
    try {
      const response = await api.get(`/companies/${companyId}/fleet-orders`, { params })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des commandes flotte',
        status: error.response?.status
      }
    }
  },

  // Statistiques de flotte
  getFleetStatistics: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/fleet-statistics`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des statistiques',
        status: error.response?.status
      }
    }
  },

  // Rapport d'utilisation de flotte
  getFleetUsageReport: async (companyId, period) => {
    try {
      const response = await api.get(`/companies/${companyId}/fleet-usage-report`, { 
        params: { period }
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la génération du rapport',
        status: error.response?.status
      }
    }
  },

  // Gestion des conducteurs
  getDrivers: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/drivers`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des conducteurs',
        status: error.response?.status
      }
    }
  },

  // Gestion de la maintenance
  getMaintenanceSchedule: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/maintenance`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération du planning de maintenance',
        status: error.response?.status
      }
    }
  },

  // Gestion des assurances
  getInsurancePolicies: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/insurance`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des polices d\'assurance',
        status: error.response?.status
      }
    }
  },

  // Gestion des budgets
  getBudgetAnalysis: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/budget-analysis`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'analyse budgétaire',
        status: error.response?.status
      }
    }
  },

  // Contrats de flotte
  getFleetContracts: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/contracts`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des contrats',
        status: error.response?.status
      }
    }
  },

  // Simulation de coût de possession (TCO)
  calculateTCO: async (vehicleData) => {
    try {
      const response = await api.post('/companies/calculate-tco', vehicleData)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du calcul du TCO',
        status: error.response?.status
      }
    }
  },

  // Optimisation de flotte
  optimizeFleet: async (companyId, optimizationParams) => {
    try {
      const response = await api.post(`/companies/${companyId}/optimize-fleet`, optimizationParams)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'optimisation de flotte',
        status: error.response?.status
      }
    }
  }
}

// Export par défaut
export default companyService