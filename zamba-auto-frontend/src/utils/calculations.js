/**
 * Calcule la TVA
 * @param {number} amount - Montant HT
 * @param {number} rate - Taux de TVA (en pourcentage)
 * @returns {number} Montant de la TVA
 */
export const calculateVAT = (amount, rate = 20) => {
    return (amount * rate) / 100
  }
  
  /**
   * Calcule le montant TTC
   * @param {number} amount - Montant HT
   * @param {number} rate - Taux de TVA (en pourcentage)
   * @returns {number} Montant TTC
   */
  export const calculateWithVAT = (amount, rate = 20) => {
    return amount + calculateVAT(amount, rate)
  }
  
  /**
   * Calcule la mensualité d'un crédit
   * @param {number} amount - Montant emprunté
   * @param {number} rate - Taux d'intérêt annuel (en pourcentage)
   * @param {number} months - Durée en mois
   * @returns {number} Mensualité
   */
  export const calculateMonthlyPayment = (amount, rate, months) => {
    const monthlyRate = rate / 100 / 12
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1)
    return Math.round(payment * 100) / 100
  }
  
  /**
   * Calcule le coût total du crédit
   * @param {number} amount - Montant emprunté
   * @param {number} rate - Taux d'intérêt annuel (en pourcentage)
   * @param {number} months - Durée en mois
   * @returns {number} Coût total
   */
  export const calculateTotalCreditCost = (amount, rate, months) => {
    const monthlyPayment = calculateMonthlyPayment(amount, rate, months)
    return monthlyPayment * months
  }
  
  /**
   * Calcule la réduction en pourcentage
   * @param {number} originalPrice - Prix original
   * @param {number} salePrice - Prix soldé
   * @returns {number} Pourcentage de réduction
   */
  export const calculateDiscountPercentage = (originalPrice, salePrice) => {
    if (!originalPrice || originalPrice <= salePrice) return 0
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  }
  
  /**
   * Calcule le prix après réduction
   * @param {number} price - Prix original
   * @param {number} discount - Pourcentage de réduction
   * @returns {number} Prix après réduction
   */
  export const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100)
  }