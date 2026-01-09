/**
 * Formate un prix selon la locale et la devise
 * @param {number} price - Prix à formater
 * @param {string} currency - Devise (par défaut EUR)
 * @param {string} locale - Locale (par défaut fr-FR)
 * @returns {string} Prix formaté
 */
export const formatPrice = (price, currency = 'EUR', locale = 'fr-FR') => {
    if (price === null || price === undefined) return 'N/A'
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }
  
  /**
   * Formate un prix avec possibilité d'afficher les décimales
   * @param {number} price - Prix à formater
   * @param {boolean} showDecimals - Afficher les décimales
   * @returns {string} Prix formaté
   */
  export const formatPriceWithDecimals = (price, showDecimals = false) => {
    if (price === null || price === undefined) return 'N/A'
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    }).format(price)
  }
  
  /**
   * Formate un prix en notation compacte (K, M)
   * @param {number} price - Prix à formater
   * @returns {string} Prix formaté en notation compacte
   */
  export const formatPriceCompact = (price) => {
    if (price === null || price === undefined) return 'N/A'
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      compactDisplay: 'short'
    }).format(price)
  }