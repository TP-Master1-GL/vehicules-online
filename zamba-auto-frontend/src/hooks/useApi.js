import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Hook personnalisé pour les appels API
 * @param {Function} apiFunction - Fonction API à appeler
 * @returns {Object} État et fonction d'exécution
 */
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      toast.error(err.message || 'Une erreur est survenue')
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}