import { useContext } from 'react'
import { CompanyContext } from '../context/CompanyContext'

export const useFleet = () => {
  const context = useContext(CompanyContext)
  
  if (!context) {
    throw new Error('useFleet doit être utilisé dans un CompanyProvider')
  }
  
  return context
}