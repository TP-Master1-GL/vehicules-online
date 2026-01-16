// API service pour les véhicules - utilisant les routes backend
import api from './auth.js'

// URL de base pour les images (à adapter selon votre configuration)
const BASE_IMAGE_URL = 'http://localhost:8080/images' // ou votre URL de backend

const vehiculesService = {
  // CATALOGUE - Routes disponibles avec patterns Decorator et Observer
  // GET /catalogue/une-ligne - Affichage une ligne par véhicule (avec Decorators)
  // GET /catalogue/trois-lignes - Affichage trois lignes par véhicule (sans Decorators)
  // GET /catalogue/soldes - Véhicules en solde (avec Decorators)
  // GET /catalogue/{id} - Véhicule par ID (avec Decorators)
  // GET /catalogue/decorated/{id} - Véhicule avec tous les décorateurs
  // GET /catalogue/nouveautes - Nouveautés (avec Decorators)

  // Récupérer le catalogue avec affichage une ligne (retourne des strings décorées)
  getCatalogueUneLigne: async () => {
    try {
      console.log('📋 [CATALOGUE] Récupération catalogue une ligne (décoré)')
      const response = await api.get('/catalogue/une-ligne')
      console.log('✅ [CATALOGUE] Catalogue une ligne reçu:', response.data.length, 'véhicules')
      
      // Parser les véhicules décorés et récupérer leurs images
      const parsedVehicles = await Promise.all(
        parseDecoratedVehicles(response.data).map(async (vehicle, index) => {
          // Pour chaque véhicule, essayer de récupérer ses images
          const vehicleWithImages = await vehiculesService.getVehiculeImages(vehicle.id)
          return {
            ...vehicle,
            images: vehicleWithImages.images || vehicle.images,
            imageUrl: vehicleWithImages.mainImageUrl || vehicle.imageUrl
          }
        })
      )
      return parsedVehicles
    } catch (error) {
      console.error('❌ [CATALOGUE] Erreur lors du chargement du catalogue une ligne:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du catalogue')
    }
  },

  // Récupérer le catalogue avec affichage trois lignes (retourne des DTO complets)
  getCatalogueTroisLignes: async () => {
    try {
      console.log('📋 [CATALOGUE] Récupération catalogue trois lignes (DTO complets)')
      const response = await api.get('/catalogue/trois-lignes')
      console.log('✅ [CATALOGUE] Catalogue trois lignes reçu:', response.data.length, 'véhicules')
      
      // Ajouter les URLs d'images complètes
      const vehiclesWithImages = response.data.map(vehicle => ({
        ...vehicle,
        // Si le véhicule a déjà des images dans le DTO
        images: vehicle.images ? vehiculesService.formatImages(vehicle.images) : [],
        // URL principale de l'image
        imageUrl: vehicle.imageUrl || vehiculesService.getVehicleImageUrl(vehicle.id, vehicle.type),
        // URLs pour le frontend
        mainImageUrl: vehicle.imageUrl || vehiculesService.getVehicleImageUrl(vehicle.id, vehicle.type),
        thumbnailUrl: vehicle.imageThumbnailUrl || vehiculesService.getVehicleImageUrl(vehicle.id, vehicle.type, true)
      }))
      
      return vehiclesWithImages
    } catch (error) {
      console.error('❌ [CATALOGUE] Erreur lors du chargement du catalogue trois lignes:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du catalogue')
    }
  },

  // Récupérer les véhicules en solde (retourne des strings décorées)
  getVehiculesSoldes: async () => {
    try {
      console.log('🏷️ [CATALOGUE] Récupération véhicules en solde')
      const response = await api.get('/catalogue/soldes')
      console.log('✅ [CATALOGUE] Soldes reçus:', response.data.length, 'véhicules')
      
      // Parser les véhicules décorés
      const parsedVehicles = parseDecoratedVehicles(response.data)
      
      // Ajouter les images pour chaque véhicule
      const vehiclesWithImages = await Promise.all(
        parsedVehicles.map(async (vehicle) => {
          try {
            const images = await vehiculesService.getVehiculeImages(vehicle.id)
            return {
              ...vehicle,
              images: images.images || vehicle.images,
              imageUrl: images.mainImageUrl || vehicle.imageUrl
            }
          } catch (error) {
            console.warn(`⚠️ [IMAGES] Impossible de récupérer images pour véhicule ${vehicle.id}:`, error)
            return vehicle
          }
        })
      )
      
      return vehiclesWithImages
    } catch (error) {
      console.error('❌ [CATALOGUE] Erreur lors du chargement des soldes:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des soldes')
    }
  },

  // Récupérer un véhicule par ID (retourne une string décorée)
  getVehiculeById: async (id) => {
    try {
      console.log(`🔍 [CATALOGUE] Récupération véhicule ID: ${id} (décoré)`)
      const response = await api.get(`/catalogue/${id}`)
      console.log('✅ [CATALOGUE] Véhicule reçu:', response.data.substring(0, 100) + '...')
      
      // Parser le véhicule décoré
      const parsedVehicle = parseDecoratedVehicle(response.data, id)
      
      // Récupérer les images du véhicule
      const vehicleImages = await vehiculesService.getVehiculeImages(id)
      
      return {
        ...parsedVehicle,
        images: vehicleImages.images,
        imageUrl: vehicleImages.mainImageUrl,
        mainImageUrl: vehicleImages.mainImageUrl,
        thumbnailUrl: vehicleImages.thumbnailUrl,
        additionalImages: vehicleImages.additionalImages
      }
    } catch (error) {
      console.error(`❌ [CATALOGUE] Erreur récupération véhicule ${id}:`, error)
      throw new Error(error.response?.data?.message || 'Véhicule non trouvé')
    }
  },

  // Récupérer un véhicule avec tous les décorateurs
  getVehiculeAvecDecorateurs: async (id) => {
    try {
      console.log(`🎨 [CATALOGUE] Récupération véhicule avec tous les décorateurs ID: ${id}`)
      const response = await api.get(`/catalogue/decorated/${id}`)
      console.log('✅ [CATALOGUE] Véhicule décoré reçu:', response.data.substring(0, 100) + '...')
      
      // Parser le véhicule décoré
      const parsedVehicle = parseDecoratedVehicle(response.data, id)
      
      // Récupérer les images
      const vehicleImages = await vehiculesService.getVehiculeImages(id)
      
      return {
        ...parsedVehicle,
        images: vehicleImages.images,
        imageUrl: vehicleImages.mainImageUrl
      }
    } catch (error) {
      console.error(`❌ [CATALOGUE] Erreur récupération véhicule décoré ${id}:`, error)
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du véhicule décoré')
    }
  },

  // Récupérer les nouveautés
  getNouveautes: async () => {
    try {
      console.log('🆕 [CATALOGUE] Récupération nouveautés')
      const response = await api.get('/catalogue/nouveautes')
      console.log('✅ [CATALOGUE] Nouveautés reçus:', response.data.length, 'véhicules')
      
      // Parser les véhicules décorés
      const parsedVehicles = parseDecoratedVehicles(response.data)
      
      // Ajouter les images
      const vehiclesWithImages = await Promise.all(
        parsedVehicles.map(async (vehicle) => {
          try {
            const images = await vehiculesService.getVehiculeImages(vehicle.id)
            return {
              ...vehicle,
              images: images.images || vehicle.images,
              imageUrl: images.mainImageUrl || vehicle.imageUrl
            }
          } catch (error) {
            console.warn(`⚠️ [IMAGES] Impossible de récupérer images pour nouveauté ${vehicle.id}`)
            return vehicle
          }
        })
      )
      
      return vehiclesWithImages
    } catch (error) {
      console.error('❌ [CATALOGUE] Erreur lors du chargement des nouveautés:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des nouveautés')
    }
  },

  // SERVICE D'IMAGES - Récupérer les images d'un véhicule
  getVehiculeImages: async (vehiculeId) => {
    try {
      console.log(`🖼️ [IMAGES] Récupération images pour véhicule ID: ${vehiculeId}`)
      
      // Option 1: Essayer de récupérer depuis un endpoint spécifique
      try {
        const response = await api.get(`/vehicules/${vehiculeId}/images`)
        if (response.data && response.data.length > 0) {
          const formattedImages = vehiculesService.formatImages(response.data)
          return {
            images: formattedImages,
            mainImageUrl: formattedImages.find(img => img.isMain)?.fileUrl || formattedImages[0]?.fileUrl,
            thumbnailUrl: formattedImages.find(img => img.isThumbnail)?.fileUrl || formattedImages[0]?.fileUrl,
            additionalImages: formattedImages.filter(img => !img.isMain).map(img => img.fileUrl)
          }
        }
      } catch (imageError) {
        console.log(`ℹ️ [IMAGES] Pas d'endpoint spécifique pour les images du véhicule ${vehiculeId}`)
      }
      
      // Option 2: Utiliser des images par défaut basées sur l'ID
      const defaultImages = vehiculesService.getDefaultVehicleImages(vehiculeId)
      
      return {
        images: defaultImages,
        mainImageUrl: defaultImages.find(img => img.isMain)?.fileUrl || defaultImages[0]?.fileUrl,
        thumbnailUrl: defaultImages.find(img => img.isThumbnail)?.fileUrl || defaultImages[0]?.fileUrl,
        additionalImages: defaultImages.filter(img => !img.isMain).map(img => img.fileUrl)
      }
      
    } catch (error) {
      console.error(`❌ [IMAGES] Erreur récupération images véhicule ${vehiculeId}:`, error)
      // Retourner des images par défaut en cas d'erreur
      return vehiculesService.getDefaultVehicleImages(vehiculeId)
    }
  },

  // Générer l'URL d'image pour un véhicule
  getVehicleImageUrl: (vehiculeId, type = 'AUTOMOBILE', thumbnail = false) => {
    // Essayer d'abord l'URL du dossier backend
    const imageName = thumbnail ? 'thumbnail.jpg' : 'main.jpg'
    const backendUrl = `${BASE_IMAGE_URL}/vehicules/${vehiculeId}/${imageName}`
    
    // Si l'URL du backend échoue, utiliser des images Unsplash par défaut
    const defaultImages = {
      'AUTOMOBILE': thumbnail 
        ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&h=200&fit=crop'
        : 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&h=400&fit=crop',
      'SCOOTER': thumbnail
        ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
        : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
      'SUV': thumbnail
        ? 'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=300&h=200&fit=crop'
        : 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=600&h=400&fit=crop'
    }
    
    return {
      backendUrl,
      fallbackUrl: defaultImages[type] || defaultImages['AUTOMOBILE']
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
      isMain: img.isMain || index === 0,
      isThumbnail: img.isThumbnail || index === 0,
      alt: img.alt || `Image ${index + 1}`,
      order: img.order || index
    }))
  },

  // Images par défaut pour un véhicule
  getDefaultVehicleImages: (vehiculeId) => {
    // Utiliser l'ID pour avoir des images différentes pour chaque véhicule
    const type = vehiculeId % 3 === 0 ? 'SCOOTER' : vehiculeId % 3 === 1 ? 'SUV' : 'AUTOMOBILE'
    
    const defaultImages = {
      'AUTOMOBILE': [
        {
          id: 1,
          fileUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&h=400&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=300&h=200&fit=crop',
          isMain: true,
          isThumbnail: true,
          alt: 'Véhicule automobile'
        },
        {
          id: 2,
          fileUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&h=200&fit=crop',
          isMain: false,
          isThumbnail: false,
          alt: 'Intérieur véhicule'
        }
      ],
      'SCOOTER': [
        {
          id: 1,
          fileUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop',
          isMain: true,
          isThumbnail: true,
          alt: 'Scooter'
        }
      ],
      'SUV': [
        {
          id: 1,
          fileUrl: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=600&h=400&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=300&h=200&fit=crop',
          isMain: true,
          isThumbnail: true,
          alt: 'SUV'
        }
      ]
    }
    
    return defaultImages[type] || defaultImages['AUTOMOBILE']
  },

  // COMMANDES - Routes disponibles (reste inchangé)
  creerCommande: async (commandeData) => {
    try {
      const response = await api.post('/commandes', commandeData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de la commande')
    }
  },

  getCommandeById: async (id) => {
    try {
      const response = await api.get(`/commandes/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Commande non trouvée')
    }
  },

  getCommandesByClient: async (clientId) => {
    try {
      const response = await api.get(`/commandes/client/${clientId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des commandes')
    }
  },

  updateStatutCommande: async (id, statut) => {
    try {
      const response = await api.put(`/commandes/${id}/statut`, { statut })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut')
    }
  },

  validerCommande: async (id) => {
    try {
      const response = await api.post(`/commandes/${id}/valider`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la validation de la commande')
    }
  },

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

  getStatsCommandes: async (clientId) => {
    try {
      const response = await api.get(`/commandes/stats/${clientId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des statistiques')
    }
  },

  // PANIER - Routes disponibles
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

  retirerDuPanier: async (vehiculeId) => {
    try {
      const response = await api.delete(`/panier/retirer/${vehiculeId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du panier')
    }
  },

  getPanier: async () => {
    try {
      const response = await api.get('/panier')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du panier')
    }
  },

  // PDF - Routes disponibles
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

  // FORMS - Routes disponibles
  getFormulaireVehicule: async () => {
    try {
      const response = await api.get('/forms/vehicule')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du formulaire véhicule')
    }
  },

  getFormulaireCommande: async () => {
    try {
      const response = await api.get('/forms/commande')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du formulaire commande')
    }
  },

  submitFormulaireVehicule: async (formData) => {
    try {
      const response = await api.post('/forms/vehicule/submit', formData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la soumission du formulaire véhicule')
    }
  },

  submitFormulaireCommande: async (formData) => {
    try {
      const response = await api.post('/forms/commande/submit', formData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la soumission du formulaire commande')
    }
  }
}

// Fonctions de parsing pour les véhicules décorés (externe au service)
function parseDecoratedVehicles(decoratedTexts) {
  return decoratedTexts.map((text, index) => parseDecoratedVehicle(text, index + 1))
}

function parseDecoratedVehicle(decoratedText, id) {
  // Nettoyer le texte des emojis pour l'analyse
  const cleanText = decoratedText.replace(/[🆕⭐🔥⚙️⚡]/g, '')
  
  // Extraire marque et modèle (ex: "Toyota Corolla (AUTOMOBILE) - 15.000.000 FCFA")
  const marqueMatch = cleanText.match(/^([A-Za-zÀ-ÿ]+)\s/)
  const marque = marqueMatch ? marqueMatch[1] : 'Marque'
  
  const modeleMatch = cleanText.match(/^[A-Za-zÀ-ÿ]+\s+([A-Za-zÀ-ÿ0-9]+)/)
  const modele = modeleMatch ? modeleMatch[1] : 'Modèle'
  
  // Extraire le type (entre parenthèses)
  const typeMatch = cleanText.match(/\(([^)]+)\)/)
  const typeVehicule = typeMatch ? typeMatch[1].split(' ')[0] : 'AUTOMOBILE'
  
  // Extraire les prix
  const prixFinalMatch = cleanText.match(/(\d[\d\s]*)(?:\s*FCFA|€)/)
  const prixFinal = prixFinalMatch ? parseFloat(prixFinalMatch[1].replace(/\s/g, '')) : 0
  
  // Chercher "au lieu de" pour le prix de base
  const prixBaseMatch = cleanText.match(/au lieu de\s*(\d[\d\s]*)/)
  const prixBase = prixBaseMatch ? parseFloat(prixBaseMatch[1].replace(/\s/g, '')) : prixFinal
  
  // Détecter les décorateurs
  const nouveau = decoratedText.includes('🆕') || decoratedText.includes('NEUF')
  const enSolde = decoratedText.includes('⭐') || decoratedText.includes('PROMOTION')
  const populaire = decoratedText.includes('🔥') || decoratedText.includes('POPULAIRE')
  const avecOptions = decoratedText.includes('⚙️') || decoratedText.includes('OPTIONS')
  const electrique = decoratedText.includes('⚡') || decoratedText.includes('ÉLECTRIQUE')
  
  // Extraire le pourcentage de promotion
  const pourcentageMatch = decoratedText.match(/-(\d+)%/)
  const pourcentageSolde = pourcentageMatch ? parseInt(pourcentageMatch[1]) : null
  
  // Calculer l'année (simulée)
  const annee = new Date().getFullYear() - (id % 5)
  
  // Calculer le kilométrage (simulé)
  const kilometrage = nouveau ? 0 : 10000 + (id % 10) * 5000
  
  return {
    id: id,
    // Informations de base
    marque,
    modele,
    typeVehicule,
    energie: electrique ? 'ELECTRIQUE' : 'ESSENCE',
    
    // Prix
    prixBase,
    prixFinal,
    prix: prixFinal,
    
    // Statuts et décorations
    nouveau,
    enSolde,
    populaire,
    avecOptions,
    electrique,
    pourcentageSolde,
    
    // Caractéristiques
    annee,
    kilometrage,
    
    // Description
    descriptionComplete: decoratedText,
    nom: `${marque} ${modele}`,
    
    // Options
    options: avecOptions ? [{ nom: 'Climatisation' }, { nom: 'GPS' }, { nom: 'Toit ouvrant' }] : [],
    
    // Images (seront remplies plus tard)
    images: [],
    imageUrl: null,
    
    // Pour le frontend
    name: `${marque} ${modele}`,
    brand: marque,
    type: typeVehicule,
    fuel: electrique ? 'ELECTRIQUE' : 'ESSENCE',
    price: prixFinal,
    badge: nouveau ? 'Nouveau' : (enSolde ? 'Solde' : null)
  }
}

export default vehiculesService