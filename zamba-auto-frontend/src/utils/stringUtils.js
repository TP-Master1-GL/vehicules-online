/**
 * Met la première lettre en majuscule
 * @param {string} str - Chaîne à transformer
 * @returns {string} Chaîne transformée
 */
export const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  
  /**
   * Tronque une chaîne à une longueur donnée
   * @param {string} str - Chaîne à tronquer
   * @param {number} length - Longueur maximale
   * @param {string} suffix - Suffix à ajouter (par défaut ...)
   * @returns {string} Chaîne tronquée
   */
  export const truncate = (str, length, suffix = '...') => {
    if (!str || str.length <= length) return str
    return str.substring(0, length) + suffix
  }
  
  /**
   * Formate un numéro de téléphone
   * @param {string} phone - Numéro de téléphone
   * @returns {string} Numéro formaté
   */
  export const formatPhone = (phone) => {
    if (!phone) return ''
    
    // Enlever tous les caractères non numériques
    const cleaned = phone.replace(/\D/g, '')
    
    // Format pour les numéros français
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
    }
    
    // Format pour les numéros internationaux
    if (cleaned.length > 10) {
      return '+' + cleaned.replace(/(\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')
    }
    
    return phone
  }
  
  /**
   * Génère un identifiant unique
   * @returns {string} Identifiant unique
   */
  export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  /**
   * Normalise une chaîne pour la recherche
   * @param {string} str - Chaîne à normaliser
   * @returns {string} Chaîne normalisée
   */
  export const normalizeString = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .trim()
  }