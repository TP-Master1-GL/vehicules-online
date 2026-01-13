import { useContext } from 'react'
import { CompanyContext } from '../context/CompanyContext'

export const useCompany = () => {
  const context = useContext(CompanyContext)
  
  if (!context) {
    throw new Error('useCompany doit être utilisé dans un CompanyProvider')
  }
  
  return context
}