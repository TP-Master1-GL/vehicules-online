// src/api/cart.js
import api from './axios'

const cartService = {
  // Récupérer le panier de l'utilisateur connecté
  getCart: async () => {
    try {
      console.log('🛒 Appel API: GET /panier')
      const response = await api.get('/panier')
      console.log('✅ Réponse getCart:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erreur getCart:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      
      if (error.response?.status === 401) {
        throw {
          message: 'Veuillez vous connecter pour accéder au panier',
          status: 401
        }
      }
      
      // Si erreur 404 ou autre, retourner un panier vide structuré
      console.log('⚠️ Retour d\'un panier vide par défaut')
      return {
        id: 0,
        clientId: null,
        lignes: [],
        items: [],
        total: 0,
        dateCreation: new Date().toISOString(),
        dateModification: new Date().toISOString()
      }
    }
  },

  // Ajouter un article au panier
  addToCart: async (cartItem) => {
    try {
      console.log('➕ Appel API: POST /panier/ajouter')
      console.log('📤 Données envoyées:', cartItem)
      
      // Format attendu par le backend
      const backendItem = {
        vehiculeId: cartItem.vehiculeId || cartItem.vehicleId,
        optionIds: cartItem.optionIds || cartItem.selectedOptions?.map(opt => opt.id) || []
      }

      const response = await api.post('/panier/ajouter', backendItem)
      console.log('✅ Réponse addToCart:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erreur addToCart:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      })
      
      let userMessage = 'Erreur lors de l\'ajout au panier'
      if (error.response?.status === 401) {
        userMessage = 'Veuillez vous connecter pour ajouter au panier'
      } else if (error.response?.data?.message) {
        userMessage = error.response.data.message
      } else if (error.message) {
        userMessage = error.message
      }
      
      throw {
        message: userMessage,
        status: error.response?.status,
        error: error
      }
    }
  },

  // Supprimer un article du panier
  removeFromCart: async (lignePanierId) => {
    try {
      console.log('🗑️ Appel API: DELETE /panier/retirer/' + lignePanierId)
      const response = await api.delete(`/panier/retirer/${lignePanierId}`)
      console.log('✅ Réponse removeFromCart:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erreur removeFromCart:', error)
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression',
        status: error.response?.status,
        error: error
      }
    }
  },

  // Vider le panier
  clearCart: async () => {
    try {
      console.log('🧹 Appel API: DELETE /panier/vider')
      const response = await api.delete('/panier/vider')
      console.log('✅ Réponse clearCart:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erreur clearCart:', error)
      
      // Si l'endpoint /vider n'existe pas, supprimer chaque ligne individuellement
      if (error.response?.status === 404) {
        console.log('⚠️ Endpoint /vider non trouvé, tentative de suppression ligne par ligne')
        try {
          const cart = await cartService.getCart()
          const promises = []
          
          if (cart.lignes && cart.lignes.length > 0) {
            for (const ligne of cart.lignes) {
              promises.push(cartService.removeFromCart(ligne.id))
            }
          }
          
          await Promise.all(promises)
          return { success: true, message: 'Panier vidé (méthode alternative)' }
        } catch (fallbackError) {
          throw {
            message: 'Impossible de vider le panier',
            status: 500,
            error: fallbackError
          }
        }
      }
      
      throw {
        message: error.response?.data?.message || 'Erreur lors de la suppression du panier',
        status: error.response?.status,
        error: error
      }
    }
  },

  // Mettre à jour la quantité d'une ligne
  updateQuantity: async (lignePanierId, quantite) => {
    try {
      console.log('📊 Appel API: PUT /panier/modifier-quantite')
      
      const request = {
        lignePanierId: lignePanierId,
        nouvelleQuantite: quantite
      }

      console.log('📤 Données envoyées:', request)
      const response = await api.put('/panier/modifier-quantite', request)
      console.log('✅ Réponse updateQuantity:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erreur updateQuantity:', error)
      
      // Si l'endpoint n'existe pas, proposer une alternative
      if (error.response?.status === 404) {
        console.warn('⚠️ Endpoint /modifier-quantite non trouvé')
        throw {
          message: 'La modification de quantité n\'est pas disponible pour le moment',
          status: 404,
          error: error
        }
      }
      
      throw {
        message: error.response?.data?.message || 'Erreur lors de la mise à jour de la quantité',
        status: error.response?.status,
        error: error
      }
    }
  },

  // Ajouter une option à une ligne
  addOption: async (lignePanierId, optionId) => {
    try {
      console.log('⚙️ Appel API: POST /panier/ajouter-option')
      
      const request = {
        lignePanierId: lignePanierId,
        optionId: optionId
      }

      const response = await api.post('/panier/ajouter-option', request)
      console.log('✅ Réponse addOption:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erreur addOption:', error)
      throw error
    }
  },

  // Retirer une option d'une ligne
  removeOption: async (lignePanierId, optionId) => {
    try {
      console.log('➖ Appel API: DELETE /panier/retirer-option')
      
      const request = {
        lignePanierId: lignePanierId,
        optionId: optionId
      }

      const response = await api.delete('/panier/retirer-option', { data: request })
      console.log('✅ Réponse removeOption:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erreur removeOption:', error)
      throw error
    }
  },

  // Vérifier la compatibilité des options (si disponible)
  checkOptionCompatibility: async (vehiculeId, selectedOptionIds) => {
    try {
      console.log('🔍 Appel API: POST /panier/options/verifier')
      
      const request = {
        vehiculeId: vehiculeId,
        optionIds: selectedOptionIds
      }

      const response = await api.post('/panier/options/verifier', request)
      return response.data
    } catch (error) {
      console.error('❌ Erreur checkOptionCompatibility:', error)
      // Par défaut, tout est compatible
      return { compatible: true, conflicts: [] }
    }
  },

  // Récupérer les options compatibles pour un véhicule (si disponible)
  getCompatibleOptions: async (vehiculeId) => {
    try {
      console.log('📋 Appel API: GET /panier/options/compatibles/' + vehiculeId)
      const response = await api.get(`/panier/options/compatibles/${vehiculeId}`)
      return response.data
    } catch (error) {
      console.error('❌ Erreur getCompatibleOptions:', error)
      return [] // Retourner un tableau vide si erreur
    }
  },

  // Test de connexion au service panier
  testConnection: async () => {
    try {
      console.log('🧪 Test de connexion au service panier...')
      const response = await api.get('/panier')
      console.log('✅ Service panier accessible:', response.status)
      return { success: true, status: response.status, data: response.data }
    } catch (error) {
      console.error('❌ Service panier inaccessible:', error.message)
      return { 
        success: false, 
        status: error.response?.status, 
        message: error.message 
      }
    }
  },

  // Méthode de secours pour les tests (sans authentification)
  addToCartTest: async (vehiculeId, options = []) => {
    try {
      console.log('🧪 Appel API TEST: POST /panier/ajouter-test')
      
      const request = {
        vehiculeId: vehiculeId,
        optionIds: options
      }

      const response = await api.post('/panier/ajouter-test', request)
      console.log('✅ Réponse addToCartTest:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erreur addToCartTest:', error)
      throw error
    }
  }
}

export default cartService