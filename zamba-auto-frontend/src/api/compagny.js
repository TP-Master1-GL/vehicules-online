// CORRECTION : Changer l'import pour utiliser l'export par défaut
import api from './auth.js'

const companyService = {
  // Récupérer les informations de l'entreprise (SocieteController)
  getCompany: async (companyId) => {
    try {
      const response = await api.get('/societe');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des informations de l\'entreprise',
        status: error.response?.status
      };
    }
  },

  // Mettre à jour les informations de l'entreprise (non implémenté côté backend)
  updateCompany: async (companyId, companyData) => {
    console.warn('updateCompany: Fonctionnalité à implémenter côté backend');
    return { success: false, message: 'Fonctionnalité non disponible' };
  },

  // Récupérer les filiales
  getSubsidiaries: async (companyId) => {
    try {
      const response = await api.get('/societe/filiales');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des filiales',
        status: error.response?.status
      };
    }
  },

  // Créer une filiale (non implémenté côté backend)
  createSubsidiary: async (companyId, subsidiaryData) => {
    console.warn('createSubsidiary: Fonctionnalité à implémenter côté backend');
    return { success: false, message: 'Fonctionnalité non disponible' };
  },

  // Mettre à jour une filiale (non implémenté côté backend)
  updateSubsidiary: async (subsidiaryId, subsidiaryData) => {
    console.warn('updateSubsidiary: Fonctionnalité à implémenter côté backend');
    return { success: false, message: 'Fonctionnalité non disponible' };
  },

  // Supprimer une filiale (non implémenté côté backend)
  deleteSubsidiary: async (subsidiaryId) => {
    console.warn('deleteSubsidiary: Fonctionnalité à implémenter côté backend');
    return { success: false, message: 'Fonctionnalité non disponible' };
  },

  // Récupérer les commandes de flotte (toutes les commandes société)
  getFleetOrders: async (companyId, params = {}) => {
    try {
      const response = await api.get('/societe/commandes', { params });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des commandes flotte',
        status: error.response?.status
      };
    }
  },

  // Statistiques de flotte
  getFleetStatistics: async (companyId) => {
    try {
      const response = await api.get('/societe/statistics');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des statistiques',
        status: error.response?.status
      };
    }
  },

  // Méthodes non encore implémentées côté backend - simulation ou messages informatifs

  // Rapport d'utilisation de flotte
  getFleetUsageReport: async (companyId, period) => {
    console.warn('getFleetUsageReport: Fonctionnalité à implémenter côté backend');
    // Simulation de rapport
    return {
      period,
      totalVehicles: 25,
      utilizationRate: 78.5,
      maintenanceCost: 12500,
      fuelCost: 8750,
      totalCost: 21250
    };
  },

  // Gestion des conducteurs (utilise les employés des filiales)
  getDrivers: async (companyId) => {
    try {
      const subsidiaries = await companyService.getSubsidiaries(companyId);
      const allDrivers = subsidiaries.flatMap(sub => sub.employes || []);
      return allDrivers;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la récupération des conducteurs',
        status: error.response?.status
      };
    }
  },

  // Gestion de la maintenance (simulation)
  getMaintenanceSchedule: async (companyId) => {
    console.warn('getMaintenanceSchedule: Fonctionnalité à implémenter côté backend');
    return {
      upcoming: [
        { vehicleId: 1, type: 'Vidange', date: '2026-01-15', cost: 85 },
        { vehicleId: 2, type: 'Pneus', date: '2026-01-20', cost: 320 }
      ],
      overdue: [
        { vehicleId: 3, type: 'CT', date: '2026-01-01', cost: 120 }
      ]
    };
  },

  // Gestion des assurances (simulation)
  getInsurancePolicies: async (companyId) => {
    console.warn('getInsurancePolicies: Fonctionnalité à implémenter côté backend');
    return [
      {
        id: 1,
        type: 'Flotte complète',
        provider: 'AXA',
        coverage: 'Tous risques',
        monthlyPremium: 1250,
        expiryDate: '2026-12-31'
      }
    ];
  },

  // Gestion des budgets (utilise les statistiques)
  getBudgetAnalysis: async (companyId) => {
    try {
      const stats = await companyService.getFleetStatistics(companyId);
      return {
        totalBudget: stats.totalValue * 1.1, // +10% pour maintenance
        spent: stats.totalValue * 0.8,
        remaining: stats.totalValue * 0.3,
        projectedCosts: stats.totalValue * 0.15
      };
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'analyse budgétaire',
        status: error.response?.status
      };
    }
  },

  // Contrats de flotte (simulation)
  getFleetContracts: async (companyId) => {
    console.warn('getFleetContracts: Fonctionnalité à implémenter côté backend');
    return [
      {
        id: 1,
        type: 'Location longue durée',
        provider: 'Arval',
        startDate: '2025-01-01',
        endDate: '2028-01-01',
        monthlyPayment: 3500,
        vehicles: 15
      }
    ];
  },

  // Simulation de coût de possession (TCO)
  calculateTCO: async (vehicleData) => {
    console.warn('calculateTCO: Fonctionnalité à implémenter côté backend');
    // Simulation simple du TCO
    const basePrice = vehicleData.price || 25000;
    const depreciation = basePrice * 0.15; // 15% dépréciation/an
    const insurance = 800; // €/an
    const maintenance = 1200; // €/an
    const fuel = 2000; // €/an

    return {
      totalCostOwnership: {
        year1: depreciation + insurance + maintenance + fuel,
        year2: (depreciation * 0.8) + insurance + maintenance + fuel,
        year3: (depreciation * 0.6) + insurance + maintenance + fuel,
        year4: (depreciation * 0.4) + insurance + maintenance + fuel,
        year5: (depreciation * 0.2) + insurance + maintenance + fuel
      },
      breakdown: {
        depreciation,
        insurance,
        maintenance,
        fuel
      }
    };
  },

  // Optimisation de flotte (simulation avancée)
  optimizeFleet: async (companyId, optimizationParams) => {
    console.warn('optimizeFleet: Fonctionnalité à implémenter côté backend');
    return {
      recommendations: [
        'Remplacer 3 véhicules de plus de 5 ans',
        'Opter pour des modèles hybrides pour 40% de la flotte',
        'Négocier un contrat de maintenance préventive'
      ],
      potentialSavings: 45000,
      implementationCost: 15000,
      paybackPeriod: 4 // mois
    };
  }
}

// Export par défaut
export default companyService