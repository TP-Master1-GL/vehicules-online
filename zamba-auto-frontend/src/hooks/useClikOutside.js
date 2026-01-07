import { useEffect } from 'react'

/**
 * Hook personnalisé pour détecter les clics en dehors d'un élément
 * @param {Object} ref - Référence React
 * @param {Function} handler - Fonction à exécuter
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [ref, handler])
}