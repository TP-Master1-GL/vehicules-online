import { useState, useEffect } from 'react'

/**
 * Hook personnalisé pour le localStorage
 * @param {string} key - Clé du localStorage
 * @param {any} initialValue - Valeur initiale
 * @returns {Array} [valeur, setter, remove]
 */
export const useLocalStorage = (key, initialValue) => {
  // État pour stocker notre valeur
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error)
      return initialValue
    }
  })

  // Mettre à jour le localStorage quand l'état change
  const setValue = (value) => {
    try {
      // Permettre à la valeur d'être une fonction
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Erreur lors de l\'écriture dans le localStorage:', error)
    }
  }

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error('Erreur lors de la suppression du localStorage:', error)
    }
  }

  // Écouter les changements dans d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue)
        } catch (error) {
          console.error('Erreur lors de la synchronisation du localStorage:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}