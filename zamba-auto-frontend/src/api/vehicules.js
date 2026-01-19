import api from './auth.js'

// Service de véhicules pour le catalogue
const vehiculesService = {
  // ========== CATALOGUE ==========
  
  // Récupérer le catalogue une ligne (avec décorateurs)
  getCatalogueUneLigne: async () => {
    try {
      console.log('📋 [CATALOGUE] Récupération catalogue une ligne...')
      // CORRECTION: Supprimer le /api/ en début car il est déjà dans baseURL
      const response = await api.get('/catalogue/une-ligne')
      console.log('✅ [CATALOGUE] Catalogue reçu:', response.data)
      
      // Le backend retourne { "vehicules": [...], "displayTexts": [...], "total": ... }
      return response.data.vehicules || []
      
    } catch (error) {
      console.error('❌ [CATALOGUE] Erreur catalogue une ligne:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      return []
    }
  },

  // Récupérer le catalogue trois lignes (DTO complets)
  getCatalogueTroisLignes: async () => {
    try {
      console.log('📋 [CATALOGUE] Récupération catalogue trois lignes...')
      // CORRECTION: Supprimer le /api/ en début
      const response = await api.get('/catalogue/trois-lignes')
      console.log('✅ [CATALOGUE] Catalogue reçu:', response.data)
      
      return response.data.vehicules || []
      
    } catch (error) {
      console.error('❌ [CATALOGUE] Erreur catalogue trois lignes:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      return []
    }
  },

  // Récupérer les véhicules en solde
  getVehiculesSoldes: async () => {
    try {
      console.log('🏷️ [CATALOGUE] Récupération véhicules en solde...')
      // CORRECTION: Supprimer le /api/ en début
      const response = await api.get('/catalogue/soldes')
      console.log('✅ [CATALOGUE] Soldes reçus:', response.data)
      
      return response.data.vehicules || []
      
    } catch (error) {
      console.error('❌ [CATALOGUE] Erreur soldes:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      return []
    }
  },

  // Récupérer un véhicule par ID
  getVehiculeById: async (id) => {
    try {
      console.log(`🔍 [CATALOGUE] Récupération véhicule ID: ${id}`)
      // CORRECTION: Supprimer le /api/ en début
      const response = await api.get(`/catalogue/${id}`)
      console.log('✅ [CATALOGUE] Véhicule reçu:', response.data)
      
      // Le backend retourne { "vehicule": {...}, "displayText": ... }
      return response.data.vehicule || response.data
      
    } catch (error) {
      console.error(`❌ [CATALOGUE] Erreur récupération véhicule ${id}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      return null
    }
  },

  // Récupérer les nouveautés
  getNouveautes: async () => {
    try {
      console.log('🆕 [CATALOGUE] Récupération nouveautés...')
      // CORRECTION: Supprimer le /api/ en début
      const response = await api.get('/catalogue/nouveautes')
      console.log('✅ [CATALOGUE] Nouveautés reçus:', response.data)
      
      return response.data.vehicules || []
      
    } catch (error) {
      console.error('❌ [CATALOGUE] Erreur nouveautés:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      return []
    }
  },

  // ========== IMAGES ==========
  
  // Récupérer les images d'un véhicule depuis admin API
  getVehiculeImages: async (vehiculeId) => {
    try {
      console.log(`🖼️ [IMAGES] Récupération images pour véhicule ID: ${vehiculeId}`)
      // CORRECTION: Supprimer le /api/ en début
      const response = await api.get(`/admin/vehicules/${vehiculeId}/images`)
      console.log(`✅ [IMAGES] Images récupérées:`, response.data)
      
      // Vérifier le format de réponse
      const images = response.data.images || response.data || []
      
      return {
        images: images,
        mainImageUrl: images.find(img => img.main || img.isMain)?.fileUrl || 
                     images.find(img => img.main || img.isMain)?.url || 
                     images[0]?.fileUrl || 
                     images[0]?.url,
        thumbnailUrl: images.find(img => img.main || img.isMain)?.thumbnailUrl || 
                     images.find(img => img.main || img.isMain)?.fileUrl || 
                     images.find(img => img.main || img.isMain)?.url || 
                     images[0]?.thumbnailUrl || 
                     images[0]?.fileUrl || 
                     images[0]?.url,
        totalImages: images.length
      }
      
    } catch (error) {
      console.error(`❌ [IMAGES] Erreur récupération images véhicule ${vehiculeId}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      
      // Retourner des images par défaut en cas d'erreur
      const defaultImages = [{
        id: 1,
        fileUrl: `https://images.unsplash.com/photo-${vehiculeId % 2 === 0 ? '1553440569' : '1549399542'}-bcc63803a83d?w=600&h=400&fit=crop`,
        thumbnailUrl: `https://images.unsplash.com/photo-${vehiculeId % 2 === 0 ? '1553440569' : '1549399542'}-bcc63803a83d?w=300&h=200&fit=crop`,
        main: true,
        isMain: true
      }]
      
      return {
        images: defaultImages,
        mainImageUrl: defaultImages[0].fileUrl,
        thumbnailUrl: defaultImages[0].thumbnailUrl,
        totalImages: 1
      }
    }
  },

  // Formater les images pour le frontend
  formatImages: (imagesData) => {
    if (!imagesData || !Array.isArray(imagesData)) {
      return []
    }
    
    return imagesData.map((img, index) => ({
      id: img.id || index,
      fileUrl: img.fileUrl || img.url || img.imageUrl,
      thumbnailUrl: img.thumbnailUrl || img.fileUrl || img.url,
      isMain: img.main || img.isMain || index === 0,
      alt: img.alt || `Image ${index + 1}`,
      order: img.order || index
    }))
  },

  // Générer l'URL d'image pour un véhicule
  getVehicleImageUrl: (vehiculeId, type = 'AUTOMOBILE', thumbnail = false) => {
    const imageType = thumbnail ? 'thumbnail' : 'main'
    const defaultImages = {
      'AUTOMOBILE': thumbnail 
        ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&h=200&fit=crop'
        : 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&h=400&fit=crop',
      'SCOOTER': thumbnail
        ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
        : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'
    }
    
    return defaultImages[type] || defaultImages['AUTOMOBILE']
  },

  // ========== FORMATAGE DES VÉHICULES ==========
  
  // Fonction utilitaire pour formater un véhicule
  formatVehicle: (vehicle) => {
    if (!vehicle) return null
    
    // Déterminer le badge
    let badge = null
    if (vehicle.nouveau) badge = "Nouveau"
    else if (vehicle.enSolde) badge = "Solde"
    else if (vehicle.populaire) badge = "Populaire"
    else if (vehicle.electrique) badge = "Électrique"
    
    // Déterminer le type d'animation
    const animationType = vehicle.electrique ? "electric" : 
                         vehicle.typeVehicule === 'SCOOTER' ? "scooter" : "gas"
    
    // Calculer le pourcentage de réduction si en solde
    let discountPercentage = null
    if (vehicle.enSolde && vehicle.prixBase && vehicle.prixFinal) {
      const reduction = ((vehicle.prixBase - vehicle.prixFinal) / vehicle.prixBase) * 100
      discountPercentage = Math.round(reduction)
    }
    
    return {
      // ID et identifiants
      id: vehicle.id,
      
      // Nom et marque
      name: vehicle.nom || vehicle.name || `${vehicle.marque} ${vehicle.modele}`,
      nom: vehicle.nom || vehicle.name || `${vehicle.marque} ${vehicle.modele}`,
      brand: vehicle.marque || vehicle.brand,
      marque: vehicle.marque || vehicle.brand,
      modele: vehicle.modele || vehicle.model,
      
      // Type et caractéristiques
      type: vehicle.typeVehicule || vehicle.type,
      typeVehicule: vehicle.typeVehicule || vehicle.type,
      typeCarburant: vehicle.typeCarburant || vehicle.energie,
      energie: vehicle.typeCarburant || vehicle.energie,
      
      // Prix et promotions
      price: vehicle.prixFinal || vehicle.price || vehicle.prix || 0,
      prix: vehicle.prixFinal || vehicle.price || vehicle.prix || 0,
      prixBase: vehicle.prixBase || vehicle.prix || vehicle.price || 0,
      prixFinal: vehicle.prixFinal || vehicle.prix || vehicle.price || 0,
      oldPrice: vehicle.prixBase && vehicle.prixFinal && vehicle.prixBase > vehicle.prixFinal 
                ? vehicle.prixBase 
                : null,
      enSolde: vehicle.enSolde || false,
      pourcentageSolde: vehicle.pourcentageSolde || discountPercentage,
      
      // Décorateurs
      nouveau: vehicle.nouveau || false,
      populaire: vehicle.populaire || false,
      electrique: vehicle.electrique || false,
      avecOptions: vehicle.avecOptions || false,
      
      // Caractéristiques supplémentaires
      features: vehicle.options?.map(opt => opt.nom) || vehicle.features || [],
      options: vehicle.options || [],
      rating: 4.5,
      location: "Douala",
      fuel: vehicle.energie || vehicle.typeCarburant || 'Essence',
      transmission: vehicle.transmission || "Automatique",
      km: vehicle.kilometrage || 0,
      kilometrage: vehicle.kilometrage || 0,
      annee: vehicle.annee || new Date().getFullYear() - 2,
      dateStock: vehicle.dateStock,
      
      // Badge et statut
      badge: badge,
      clearance: vehicle.enSolde || false,
      promo: vehicle.enSolde || false,
      quantite: vehicle.quantite || 1,
      
      // Pour les animations
      hasAnimation: true,
      animationType: animationType,
      
      // Description
      descriptionComplete: vehicle.descriptionComplete || vehicle.description || '',
      shortDescription: vehicle.descriptionComplete || vehicle.description
        ? (vehicle.descriptionComplete || vehicle.description).substring(0, 100) + '...' 
        : `${vehicle.marque} ${vehicle.modele} - ${vehicle.typeVehicule}`,
      
      // Spécifications techniques
      puissance: vehicle.puissance,
      autonomie: vehicle.autonomie,
      cylindree: vehicle.cylindree,
      nombrePortes: vehicle.nombrePortes,
      nombrePlaces: vehicle.nombrePlaces,
      couleur: vehicle.couleur || '#3B82F6'
    }
  },

  // Formater une liste de véhicules
  formatVehiclesList: (vehicles) => {
    if (!Array.isArray(vehicles)) return []
    
    return vehicles.map(vehicle => vehiculesService.formatVehicle(vehicle))
  },

  // ========== UTILITAIRES DE DEBUG ==========
  
  // Méthode de debug pour vérifier la structure des réponses
  debugCatalogueResponse: async () => {
    try {
      console.log('🔍 [DEBUG] Test des endpoints catalogue...')
      
      // Testez chaque endpoint (URLS CORRIGÉES)
      const endpoints = [
        { name: 'une-ligne', url: '/catalogue/une-ligne' },
        { name: 'trois-lignes', url: '/catalogue/trois-lignes' },
        { name: 'soldes', url: '/catalogue/soldes' },
        { name: 'nouveautes', url: '/catalogue/nouveautes' }
      ]
      
      const results = {}
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint.url)
          results[endpoint.name] = {
            status: 'success',
            data: response.data,
            hasVehiculesKey: !!response.data.vehicules,
            vehiculesCount: response.data.vehicules ? response.data.vehicules.length : 0,
            isArray: Array.isArray(response.data),
            keys: Object.keys(response.data)
          }
        } catch (err) {
          results[endpoint.name] = {
            status: 'error',
            error: err.message,
            statusCode: err.response?.status
          }
        }
      }
      
      console.log('📊 [DEBUG] Résultats:', results)
      return results
      
    } catch (error) {
      console.error('❌ [DEBUG] Erreur:', error)
      return null
    }
  },

  // Tester la connexion au backend
  testBackendConnection: async () => {
    try {
      console.log('🔗 [TEST] Test connexion backend...')
      // CORRECTION: URL corrigée
      const response = await api.get('/catalogue/une-ligne')
      console.log('✅ [TEST] Connexion réussie')
      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } catch (error) {
      console.error('❌ [TEST] Connexion échouée:', error)
      return {
        success: false,
        error: error.message,
        status: error.response?.status
      }
    }
  },

  // ========== FONCTIONS UTILITAIRES ==========
  
  // Extraire les véhicules de n'importe quelle réponse
  extractVehiculesFromResponse: (response) => {
    if (!response || !response.data) {
      return []
    }
    
    // Si la réponse est directement un tableau
    if (Array.isArray(response.data)) {
      return response.data
    }
    
    // Si la réponse contient une clé "vehicules"
    if (response.data.vehicules && Array.isArray(response.data.vehicules)) {
      return response.data.vehicules
    }
    
    // Si la réponse contient une clé "data" avec des véhicules
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data
    }
    
    // Autres formats possibles
    if (response.data.vehicule) {
      return [response.data.vehicule]
    }
    
    console.warn('[CATALOGUE] Format de réponse inattendu:', response.data)
    return []
  },

  // Filtrer les véhicules par type
  filterByType: (vehicles, type) => {
    if (!Array.isArray(vehicles)) return []
    
    return vehicles.filter(vehicle => 
      (vehicle.typeVehicule || vehicle.type || '').toLowerCase() === type.toLowerCase()
    )
  },

  // Rechercher des véhicules
  searchVehicles: (vehicles, searchTerm) => {
    if (!Array.isArray(vehicles) || !searchTerm) return vehicles
    
    const term = searchTerm.toLowerCase()
    return vehicles.filter(vehicle => 
      (vehicle.marque || '').toLowerCase().includes(term) ||
      (vehicle.modele || '').toLowerCase().includes(term) ||
      (vehicle.nom || '').toLowerCase().includes(term) ||
      (vehicle.typeVehicule || '').toLowerCase().includes(term)
    )
  },

  // Trier les véhicules
  sortVehicles: (vehicles, sortBy = 'prix', order = 'asc') => {
    if (!Array.isArray(vehicles)) return []
    
    return [...vehicles].sort((a, b) => {
      let aValue = a[sortBy] || 0
      let bValue = b[sortBy] || 0
      
      // Pour les chaînes de caractères
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }
}

export default vehiculesService