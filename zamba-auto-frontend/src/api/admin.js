// admin.js - VERSION COMPLÈTE AVEC GESTION DES IMAGES
import api from './auth.js'

const adminService = {
  // ========== TEST DE CONNEXION ==========
  testConnection: async () => {
    try {
      console.log('🔗 [ADMIN] Test connexion admin...')
      const response = await api.get('/admin/test')
      console.log('✅ [ADMIN] Test réussi:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Test échoué:', error)
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur de connexion admin')
    }
  },

  // ========== GESTION UTILISATEURS ==========
  getUtilisateurs: async () => {
    try {
      console.log('👥 [ADMIN] Récupération utilisateurs...')
      const response = await api.get('/admin/utilisateurs')
      console.log(`✅ [ADMIN] ${response.data?.length || 0} utilisateurs récupérés`)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getUtilisateurs:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement des utilisateurs')
    }
  },

  // ========== GESTION DES VÉHICULES ==========
  getVehicules: async () => {
    try {
      console.log('🚗 [ADMIN] Récupération véhicules...')
      const response = await api.get('/admin/vehicules')
      console.log(`✅ [ADMIN] ${response.data?.length || 0} véhicules récupérés`)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getVehicules:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement des véhicules')
    }
  },

  getVehiculeById: async (id) => {
    try {
      console.log(`🚗 [ADMIN] Récupération véhicule ID ${id}...`)
      const response = await api.get(`/admin/vehicules/${id}`)
      console.log('✅ [ADMIN] Véhicule récupéré:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur getVehiculeById ${id}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement du véhicule')
    }
  },

  createVehicule: async (vehiculeData) => {
    try {
      console.log('🚗 [ADMIN] Création véhicule...', vehiculeData)
      
      // Formatage des données pour le backend
      const formattedData = {
        ...vehiculeData,
        // Assurez-vous que les nombres sont bien des nombres
        prix: Number(vehiculeData.prix),
        quantite: Number(vehiculeData.quantite),
        // Les autres champs numériques
        nombrePortes: vehiculeData.nombrePortes ? Number(vehiculeData.nombrePortes) : undefined,
        nombrePlaces: vehiculeData.nombrePlaces ? Number(vehiculeData.nombrePlaces) : undefined,
        puissance: vehiculeData.puissance ? Number(vehiculeData.puissance) : undefined,
        autonomie: vehiculeData.autonomie ? Number(vehiculeData.autonomie) : undefined,
        cylindree: vehiculeData.cylindree ? Number(vehiculeData.cylindree) : undefined
      }
      
      console.log('📤 [ADMIN] Données formatées:', formattedData)
      
      const response = await api.post('/admin/vehicules', formattedData)
      console.log('✅ [ADMIN] Véhicule créé:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur createVehicule:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      })
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      error.message || 
                      'Erreur lors de la création du véhicule'
      throw new Error(errorMsg)
    }
  },

  updateVehicule: async (id, vehiculeData) => {
    try {
      console.log(`🚗 [ADMIN] Modification véhicule ID ${id}...`, vehiculeData)
      
      // Formatage des données
      const formattedData = { ...vehiculeData }
      
      // Conversion des nombres
      if (formattedData.prix) formattedData.prix = Number(formattedData.prix)
      if (formattedData.quantite) formattedData.quantite = Number(formattedData.quantite)
      if (formattedData.nombrePortes) formattedData.nombrePortes = Number(formattedData.nombrePortes)
      if (formattedData.nombrePlaces) formattedData.nombrePlaces = Number(formattedData.nombrePlaces)
      if (formattedData.puissance) formattedData.puissance = Number(formattedData.puissance)
      if (formattedData.autonomie) formattedData.autonomie = Number(formattedData.autonomie)
      if (formattedData.cylindree) formattedData.cylindree = Number(formattedData.cylindree)
      
      const response = await api.put(`/admin/vehicules/${id}`, formattedData)
      console.log('✅ [ADMIN] Véhicule modifié:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur updateVehicule ${id}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      const errorMsg = error.response?.data?.error || 
                      error.response?.data?.message || 
                      error.message || 
                      'Erreur lors de la mise à jour du véhicule'
      throw new Error(errorMsg)
    }
  },

  deleteVehicule: async (id) => {
    try {
      console.log(`🚗 [ADMIN] Suppression véhicule ID ${id}...`)
      const response = await api.delete(`/admin/vehicules/${id}`)
      console.log('✅ [ADMIN] Véhicule supprimé')
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur deleteVehicule ${id}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors de la suppression du véhicule')
    }
  },

  mettreEnSolde: async (id, pourcentageSolde) => {
    try {
      console.log(`🏷️ [ADMIN] Mise en solde véhicule ID ${id} avec ${pourcentageSolde}%`)
      const response = await api.put(`/admin/vehicules/${id}/solde`, { 
        pourcentageSolde: Number(pourcentageSolde) 
      })
      console.log('✅ [ADMIN] Véhicule mis en solde:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur mettreEnSolde ${id}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors de la mise en solde')
    }
  },

  // ========== GESTION DES IMAGES DES VÉHICULES ==========
  
  uploadVehiculeImage: async (vehiculeId, formData) => {
    try {
      console.log(`📸 [ADMIN] Upload image pour véhicule ID ${vehiculeId}`)
      const response = await api.post(`/admin/vehicules/${vehiculeId}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('✅ [ADMIN] Image uploadée:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur uploadVehiculeImage ${vehiculeId}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors de l\'upload de l\'image')
    }
  },

  uploadMultipleVehiculeImages: async (vehiculeId, formData) => {
    try {
      console.log(`📸 [ADMIN] Upload multiple images pour véhicule ID ${vehiculeId}`)
      const response = await api.post(`/admin/vehicules/${vehiculeId}/upload-multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('✅ [ADMIN] Images uploadées:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur uploadMultipleVehiculeImages ${vehiculeId}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors de l\'upload des images')
    }
  },

  getVehiculeImages: async (vehiculeId) => {
    try {
      console.log(`📸 [ADMIN] Récupération images pour véhicule ID ${vehiculeId}`)
      const response = await api.get(`/admin/vehicules/${vehiculeId}/images`)
      console.log(`✅ [ADMIN] ${response.data?.images?.length || 0} images récupérées`)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur getVehiculeImages ${vehiculeId}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement des images')
    }
  },

  deleteVehiculeImage: async (imageId) => {
    try {
      console.log(`🗑️ [ADMIN] Suppression image ID ${imageId}`)
      const response = await api.delete(`/admin/vehicules/images/${imageId}`)
      console.log('✅ [ADMIN] Image supprimée:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur deleteVehiculeImage ${imageId}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors de la suppression de l\'image')
    }
  },

  setImageAsMain: async (imageId) => {
    try {
      console.log(`⭐ [ADMIN] Définition image ID ${imageId} comme principale`)
      const response = await api.put(`/admin/vehicules/images/${imageId}/set-main`)
      console.log('✅ [ADMIN] Image définie comme principale:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur setImageAsMain ${imageId}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors de la définition de l\'image principale')
    }
  },

  // ========== GESTION DES COMMANDES ==========
  getCommandes: async (statut) => {
    try {
      console.log(`📦 [ADMIN] Récupération commandes${statut ? ` avec statut ${statut}` : ''}...`)
      const url = statut ? `/admin/commandes?statut=${statut}` : '/admin/commandes'
      const response = await api.get(url)
      console.log(`✅ [ADMIN] ${response.data?.length || 0} commandes récupérées`)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getCommandes:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement des commandes')
    }
  },

  getCommandeById: async (id) => {
    try {
      console.log(`📦 [ADMIN] Récupération commande ID ${id}...`)
      const response = await api.get(`/admin/commandes/${id}`)
      console.log('✅ [ADMIN] Commande récupérée:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur getCommandeById ${id}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement de la commande')
    }
  },

  updateCommandeStatut: async (id, statut) => {
    try {
      console.log(`📦 [ADMIN] Mise à jour statut commande ID ${id} -> ${statut}`)
      const response = await api.put(`/admin/commandes/${id}/statut`, { statut })
      console.log('✅ [ADMIN] Statut mis à jour:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur updateCommandeStatut ${id}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors de la mise à jour du statut')
    }
  },

  // ========== GESTION DES OPTIONS ==========
  getOptions: async () => {
    try {
      console.log('⚙️ [ADMIN] Récupération options...')
      const response = await api.get('/admin/options')
      console.log(`✅ [ADMIN] ${response.data?.length || 0} options récupérées`)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getOptions:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement des options')
    }
  },

  // ========== AUTRES FONCTIONS ADMIN ==========
  getConfigurations: async () => {
    try {
      console.log('⚙️ [ADMIN] Récupération configurations...')
      const response = await api.get('/admin/configurations')
      console.log('✅ [ADMIN] Configurations récupérées:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getConfigurations:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement des configurations')
    }
  },

  getHealthDetailed: async () => {
    try {
      console.log('🏥 [ADMIN] Récupération santé système...')
      const response = await api.get('/admin/health-detailed')
      console.log('✅ [ADMIN] Santé système récupérée:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getHealthDetailed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement de la santé système')
    }
  },

  getMetrics: async () => {
    try {
      console.log('📊 [ADMIN] Récupération métriques...')
      const response = await api.get('/admin/metrics')
      console.log('✅ [ADMIN] Métriques récupérées:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getMetrics:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement des métriques')
    }
  }
}

export default adminService