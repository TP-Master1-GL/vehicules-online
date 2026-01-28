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
      // Si c'est une erreur 500, retourner un tableau vide au lieu de throw
      if (error.response?.status === 500) {
        console.warn('⚠️ [ADMIN] Erreur serveur, retour tableau vide')
        return []
      }
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement des utilisateurs')
    }
  },

  // ========== GESTION DES VÉHICULES ==========
  getVehicules: async () => {
    try {
      console.log('🚗 [ADMIN] Récupération véhicules...')
      const response = await api.get('/admin/vehicules')
      console.log(`✅ [ADMIN] ${response.data?.length || 0} véhicules récupérés`)
      
      // Normaliser les données pour le frontend
      const vehiculesNormalises = response.data.map(vehicule => ({
        ...vehicule,
        // Assurer que les champs d'images existent
        images: vehicule.images || [],
        totalImages: vehicule.totalImages || 0,
        // Assurer que les champs optionnels existent
        couleur: vehicule.couleur || '#3B82F6',
        quantite: vehicule.quantite || 1,
        enSolde: vehicule.enSolde || false,
        // Calculer le prix final si nécessaire
        prix: vehicule.prix || vehicule.prixFinal || vehicule.prixBase || 0
      }))
      
      return vehiculesNormalises
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getVehicules:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      // Si c'est une erreur 400/500, retourner un tableau vide au lieu de throw
      if ([400, 500].includes(error.response?.status)) {
        console.warn('⚠️ [ADMIN] Erreur serveur, retour tableau vide')
        return []
      }
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
        cylindree: vehiculeData.cylindree ? Number(vehiculeData.cylindree) : undefined,
        // Date de stock par défaut
        dateStock: vehiculeData.dateStock || new Date().toISOString().split('T')[0]
      }
      
      // Nettoyer les champs undefined
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] === undefined) {
          delete formattedData[key]
        }
      })
      
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
      if (formattedData.pourcentageSolde) formattedData.pourcentageSolde = Number(formattedData.pourcentageSolde)
      
      // Nettoyer les champs undefined
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] === undefined) {
          delete formattedData[key]
        }
      })
      
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

  // ========== GESTION DES IMAGES ==========
  uploadVehiculeImage: async (vehiculeId, formData) => {
    try {
      console.log(`📸 [ADMIN] Upload image pour véhicule ID ${vehiculeId}`)
      console.log('📋 FormData reçu:', {
        hasFile: formData.has('file'),
        hasIsMain: formData.has('isMain'),
        keys: Array.from(formData.keys())
      })
      
      const response = await api.post(
        `/admin/vehicules/${vehiculeId}/upload-image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Ajouter un timeout plus long pour les images
          timeout: 60000 // 60 secondes
        }
      )
      
      console.log('✅ [ADMIN] Image uploadée:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur uploadVehiculeImage ${vehiculeId}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        requestData: formData ? {
          hasFile: formData.has('file'),
          fileSize: formData.get('file')?.size
        } : 'No formData'
      })
      
      let errorMessage = 'Erreur lors de l\'upload de l\'image'
      if (error.response?.data) {
        errorMessage = error.response.data.error || error.response.data.message || errorMessage
      }
      throw new Error(errorMessage)
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
      // Retourner des données par défaut en cas d'erreur
      return {
        vehiculeId: vehiculeId,
        totalImages: 0,
        images: []
      }
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
      
      // Utiliser /api/commandes au lieu de /admin/commandes
      let url = '/api/commandes'
      if (statut) {
        // Utiliser l'endpoint spécifique pour le statut
        url = `/api/commandes/statut/${statut}`
      }
      
      const response = await api.get(url)
      console.log(`✅ [ADMIN] ${response.data?.length || 0} commandes récupérées`)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getCommandes:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      return []
    }
  },

  getAllCommandes: async () => {
    try {
      console.log('📦 [ADMIN] Récupération de toutes les commandes...')
      const response = await api.get('/api/commandes')
      console.log(`✅ [ADMIN] ${response.data?.length || 0} commandes récupérées`)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getAllCommandes:', error)
      return []
    }
  },

  updateCommandeStatut: async (id, statut) => {
    try {
      console.log(`📦 [ADMIN] Mise à jour statut commande ID ${id} -> ${statut}`)
      
      // Utiliser l'endpoint PUT existant dans CommandeController
      const response = await api.put(`/api/commandes/${id}/statut`, { statut })
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

  // Méthodes pour les statuts spécifiques
  getCommandesEnCours: async () => {
    return adminService.getCommandes('EN_COURS')
  },

  getCommandesValidees: async () => {
    return adminService.getCommandes('VALIDEE')
  },

  getCommandesPayees: async () => {
    return adminService.getCommandes('PAYEE')
  },

  getCommandesLivrees: async () => {
    return adminService.getCommandes('LIVREE')
  },

  getCommandesAnnulees: async () => {
    return adminService.getCommandes('ANNULEE')
  },

// Méthode pour obtenir une commande spécifique
getCommandeById: async (id) => {
  try {
    console.log(`📦 [ADMIN] Récupération commande ID ${id}...`)
    const response = await api.get(`/api/commandes/${id}`)
    console.log('✅ [ADMIN] Commande récupérée')
    return response.data
  } catch (error) {
    console.error(`❌ [ADMIN] Erreur getCommandeById ${id}:`, error)
    throw new Error('Erreur lors de la récupération de la commande')
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
      // Retourner tableau vide en cas d'erreur 500
      if (error.response?.status === 500) {
        console.warn('⚠️ [ADMIN] Erreur serveur options, retour tableau vide')
        return []
      }
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Erreur lors du chargement des options')
    }
  },

  // ========== STATISTIQUES ==========
  getStats: async () => {
    try {
      console.log('📊 [ADMIN] Récupération statistiques...')
      const response = await api.get('/admin/stats')
      console.log('✅ [ADMIN] Statistiques récupérées:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getStats:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      // Retourner des statistiques par défaut en cas d'erreur
      return {
        totalUsers: 0,
        totalVehicles: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        successRate: 0
      }
    }
  },

  // ========== NOUVELLES MÉTHODES ==========
  getVehiculeImagesByVehiculeId: async (vehiculeId) => {
    try {
      console.log(`📸 [ADMIN] Récupération images détaillées pour véhicule ID ${vehiculeId}`)
      const response = await api.get(`/admin/vehicules/${vehiculeId}/images`)
      return response.data
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur getVehiculeImagesByVehiculeId ${vehiculeId}:`, error)
      return {
        vehiculeId: vehiculeId,
        images: [],
        totalImages: 0
      }
    }
  },

  uploadMultipleImages: async (vehiculeId, files) => {
    try {
      console.log(`📸 [ADMIN] Upload multiple images pour véhicule ID ${vehiculeId}, ${files.length} fichiers`)
      
      const uploadPromises = files.map((file, index) => {
        return adminService.uploadVehiculeImage(vehiculeId, file, index === 0)
      })
      
      const results = await Promise.all(uploadPromises)
      console.log(`✅ [ADMIN] ${results.length} images uploadées avec succès`)
      return results
    } catch (error) {
      console.error(`❌ [ADMIN] Erreur uploadMultipleImages ${vehiculeId}:`, error)
      throw new Error('Erreur lors de l\'upload multiple des images')
    }
  },

  getDashboardData: async () => {
    try {
      console.log('📊 [ADMIN] Récupération données dashboard...')
      const [users, vehicules, commandes, options, stats] = await Promise.all([
        adminService.getUtilisateurs(),
        adminService.getVehicules(),
        adminService.getCommandes(),
        adminService.getOptions(),
        adminService.getStats()
      ])
      
      console.log(`✅ [ADMIN] Dashboard chargé: ${users.length} users, ${vehicules.length} vehicules, ${commandes.length} commandes`)
      
      return {
        users,
        vehicules,
        commandes,
        options,
        stats
      }
    } catch (error) {
      console.error('❌ [ADMIN] Erreur getDashboardData:', error)
      throw new Error('Erreur lors du chargement des données dashboard')
    }
  }
}

export default adminService