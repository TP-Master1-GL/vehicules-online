import { useState, useEffect } from 'react'

/**
 * Hook personnalisé pour le debounce
 * @param {any} value - Valeur à debouncer
 * @param {number} delay - Délai en ms
 * @returns {any} Valeur debouncée
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}