// CORRECTION : Importer api comme export par défaut
import api from './auth.js'

const vehicleService = {
  // Récupérer tous les véhicules avec pagination et filtres
  getAllVehicles: async (params = {}) => {
    try {
      const response = await api.get('/vehicles', { params })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des véhicules',
        status: error.response?.status
      }
    }
  },

  // Récupérer un véhicule par ID
  getVehicleById: async (id) => {
    try {
      const response = await api.get(`/vehicles/${id}`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération du véhicule',
        status: error.response?.status
      }
    }
  },

  // Recherche avancée de véhicules
  searchVehicles: async (filters) => {
    try {
      const response = await api.post('/vehicles/search', filters)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la recherche',
        status: error.response?.status
      }
    }
  },

  // Récupérer les marques disponibles
  getBrands: async () => {
    try {
      const response = await api.get('/vehicles/brands')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des marques',
        status: error.response?.status
      }
    }
  },

  // Récupérer les types de véhicules
  getVehicleTypes: async () => {
    try {
      const response = await api.get('/vehicles/types')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des types',
        status: error.response?.status
      }
    }
  },

  // Récupérer les options d'un véhicule
  getVehicleOptions: async (vehicleId) => {
    try {
      const response = await api.get(`/vehicles/${vehicleId}/options`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des options',
        status: error.response?.status
      }
    }
  },

  // Vérifier la compatibilité des options
  checkOptionCompatibility: async (vehicleId, optionIds) => {
    try {
      const response = await api.post('/vehicles/options/compatibility', { 
        vehicleId, 
        optionIds 
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur de vérification de compatibilité',
        status: error.response?.status
      }
    }
  },

  // Récupérer les promotions (clearance)
  getClearanceVehicles: async () => {
    try {
      const response = await api.get('/vehicles/clearance')
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des promotions',
        status: error.response?.status
      }
    }
  },

  // Récupérer les véhicules similaires
  getSimilarVehicles: async (vehicleId) => {
    try {
      const response = await api.get(`/vehicles/${vehicleId}/similar`)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des véhicules similaires',
        status: error.response?.status
      }
    }
  },

  // Simuler un financement
  simulateFinancement: async (vehicleId, options) => {
    try {
      const response = await api.post(`/vehicles/${vehicleId}/financement`, options)
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la simulation',
        status: error.response?.status
      }
    }
  }
}

// Export par défaut
export default vehicleService