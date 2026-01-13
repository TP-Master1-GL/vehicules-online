/**
 * Formate une date selon le format français
 * @param {Date|string} date - Date à formater
 * @param {boolean} includeTime - Inclure l'heure
 * @returns {string} Date formatée
 */
export const formatDate = (date, includeTime = false) => {
    if (!date) return ''
    
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (includeTime) {
      return dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  /**
   * Calcule la différence entre deux dates en jours
   * @param {Date} date1 - Première date
   * @param {Date} date2 - Deuxième date
   * @returns {number} Nombre de jours de différence
   */
  export const getDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
  /**
   * Ajoute des jours à une date
   * @param {Date} date - Date de départ
   * @param {number} days - Nombre de jours à ajouter
   * @returns {Date} Nouvelle date
   */
  export const addDays = (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }
  
  /**
   * Vérifie si une date est dans le futur
   * @param {Date} date - Date à vérifier
   * @returns {boolean} True si la date est dans le futur
   */
  export const isFutureDate = (date) => {
    return new Date(date) > new Date()
  }
  
  /**
   * Formate une durée en heures:minutes
   * @param {number} minutes - Durée en minutes
   * @returns {string} Durée formatée
   */
  export const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours === 0) {
      return `${mins}min`
    }
    
    return `${hours}h${mins.toString().padStart(2, '0')}`
  }