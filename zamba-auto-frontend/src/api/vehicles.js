// CORRECTION : Importer api comme export par défaut
import api from './auth.js'

const vehicleService = {
  // Récupérer tous les véhicules (CatalogueController)
  getAllVehicles: async (params = {}) => {
    try {
      // Adapter les paramètres pour correspondre au backend
      const backendParams = {
        page: params.page || 0,
        size: params.limit || 20,
        marque: params.brand,
        energie: params.energy,
        prixMin: params.minPrice,
        prixMax: params.maxPrice,
        enSolde: params.onSale
      };

      // Choix du mode d'affichage selon les params
      let endpoint = '/catalogue';
      if (params.displayMode === 'one-line') {
        endpoint = '/catalogue/une-ligne';
      } else if (params.displayMode === 'three-lines') {
        endpoint = '/catalogue/trois-lignes';
      }

      const response = await api.get(endpoint, { params: backendParams });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des véhicules',
        status: error.response?.status
      };
    }
  },

  // Récupérer un véhicule par ID
  getVehicleById: async (id) => {
    try {
      const response = await api.get(`/catalogue/${id}`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération du véhicule',
        status: error.response?.status
      };
    }
  },

  // Recherche avancée (utilise les mêmes filtres que getAllVehicles)
  searchVehicles: async (filters) => {
    return vehicleService.getAllVehicles(filters);
  },

  // Récupérer les véhicules en solde (spécifique au backend)
  getClearanceVehicles: async () => {
    try {
      const response = await api.get('/catalogue/soldes');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des promotions',
        status: error.response?.status
      };
    }
  },

  // Les autres méthodes peuvent rester pour compatibilité
  // mais utilisent les endpoints du backend
  getBrands: async () => {
    try {
      // Simulation - le backend n'a pas cet endpoint spécifique
      return ['Peugeot', 'Renault', 'Citroën', 'BMW', 'Audi', 'Mercedes'];
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des marques',
        status: error.response?.status
      };
    }
  },

  getVehicleTypes: async () => {
    try {
      // Simulation - le backend utilise des enums
      return ['AUTOMOBILE', 'SCOOTER'];
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des types',
        status: error.response?.status
      };
    }
  },

  // Pour les options, nous utilisons les données du véhicule directement
  getVehicleOptions: async (vehicleId) => {
    try {
      const vehicle = await vehicleService.getVehicleById(vehicleId);
      return vehicle.options || [];
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des options',
        status: error.response?.status
      };
    }
  },

  // Vérifier la compatibilité des options (non implémenté côté backend pour l'instant)
  checkOptionCompatibility: async (vehicleId, optionIds) => {
    try {
      // Simulation - retourne toujours compatible pour l'instant
      return {
        compatible: true,
        message: 'Options compatibles'
      };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur de vérification de compatibilité',
        status: error.response?.status
      };
    }
  },

  // Méthodes restantes pour compatibilité
  getSimilarVehicles: async (vehicleId) => {
    try {
      // Simulation - retourne des véhicules similaires
      const allVehicles = await vehicleService.getAllVehicles();
      return allVehicles.slice(0, 4); // Retourne les 4 premiers comme similaires
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des véhicules similaires',
        status: error.response?.status
      };
    }
  },

  simulateFinancement: async (vehicleId, options) => {
    try {
      // Simulation - calcul simple de financement
      const vehicle = await vehicleService.getVehicleById(vehicleId);
      const totalPrice = vehicle.prixFinal + (options?.reduce((sum, opt) => sum + opt.price, 0) || 0);

      return {
        monthlyPayment: Math.round(totalPrice / 60), // 5 ans
        totalCost: totalPrice * 1.05, // +5% intérêts
        duration: 60
      };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la simulation',
        status: error.response?.status
      };
    }
  }
}

// Export par défaut
export default vehicleService