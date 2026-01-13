/**
 * Vérifie la compatibilité des options sélectionnées
 * @param {Array} selectedOptions - Options sélectionnées
 * @param {Array} incompatibilities - Liste des incompatibilités
 * @returns {Object} Résultat de la validation
 */
export const validateOptions = (selectedOptions, incompatibilities) => {
    const errors = []
    const warnings = []
    
    // Vérifier chaque paire d'options sélectionnées
    for (let i = 0; i < selectedOptions.length; i++) {
      for (let j = i + 1; j < selectedOptions.length; j++) {
        const option1 = selectedOptions[i]
        const option2 = selectedOptions[j]
        
        // Chercher une incompatibilité entre ces deux options
        const incompatibility = incompatibilities.find(
          inc => (inc.option1 === option1.id && inc.option2 === option2.id) ||
                 (inc.option1 === option2.id && inc.option2 === option1.id)
        )
        
        if (incompatibility) {
          errors.push({
            option1: option1.name,
            option2: option2.name,
            reason: incompatibility.reason
          })
        }
      }
    }
    
    // Vérifier les dépendances (si une option en requiert une autre)
    selectedOptions.forEach(option => {
      if (option.requires) {
        const requiredOption = selectedOptions.find(opt => opt.id === option.requires)
        if (!requiredOption) {
          warnings.push({
            option: option.name,
            message: `Nécessite: ${option.requiresName}`
          })
        }
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      hasWarnings: warnings.length > 0
    }
  }
  
  /**
   * Calcule le prix total des options
   * @param {Array} options - Liste des options
   * @returns {number} Prix total
   */
  export const calculateOptionsTotal = (options) => {
    return options.reduce((total, option) => total + (option.price || 0), 0)
  }
  
  /**
   * Filtre les options par catégorie
   * @param {Array} options - Liste des options
   * @param {string} category - Catégorie à filtrer
   * @returns {Array} Options filtrées
   */
  export const filterOptionsByCategory = (options, category) => {
    return options.filter(option => option.category === category)
  }
  
  /**
   * Vérifie si une option est déjà sélectionnée
   * @param {Array} selectedOptions - Options sélectionnées
   * @param {number|string} optionId - ID de l'option à vérifier
   * @returns {boolean} True si l'option est déjà sélectionnée
   */
  export const isOptionSelected = (selectedOptions, optionId) => {
    return selectedOptions.some(option => option.id === optionId)
  }