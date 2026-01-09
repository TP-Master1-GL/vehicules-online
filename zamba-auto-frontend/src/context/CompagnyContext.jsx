import React, { createContext, useState, useContext, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CompanyContext = createContext()

export const useCompany = () => {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('useCompany doit être utilisé dans un CompanyProvider')
  }
  return context
}

export const CompanyProvider = ({ children }) => {
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [subsidiaries, setSubsidiaries] = useState([])
  const [fleetOrders, setFleetOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && ['company', 'subsidiary'].includes(user.customer_type)) {
      fetchCompanyData()
    }
  }, [user])

  const fetchCompanyData = async () => {
    try {
      setLoading(true)
      
      // Simulation - À remplacer par l'appel API
      const mockCompany = {
        id: user.company_id || 1,
        name: "Entreprise XYZ Cameroon",
        email: "contact@entreprise-xyz.cm",
        address: "123 Avenue des Champs, Douala, Cameroun",
        phone: "+237 6 77 88 99 00",
        taxNumber: "M1234567890",
        fleetSize: 25,
        monthlyBudget: 50000,
        contactPerson: "M. Jean Dupont",
        createdAt: "2020-01-15"
      }

      const mockSubsidiaries = [
        { 
          id: 1, 
          name: "Filiale Douala", 
          location: "Douala", 
          vehicles: 12,
          manager: "M. Alain Martin",
          phone: "+237 6 11 22 33 44"
        },
        { 
          id: 2, 
          name: "Filiale Yaoundé", 
          location: "Yaoundé", 
          vehicles: 8,
          manager: "Mme. Sophie Ngo",
          phone: "+237 6 55 66 77 88"
        },
        { 
          id: 3, 
          name: "Filiale Bafoussam", 
          location: "Bafoussam", 
          vehicles: 5,
          manager: "M. Paul Tchoupa",
          phone: "+237 6 99 00 11 22"
        }
      ]

      const mockFleetOrders = [
        {
          id: 1,
          orderNumber: "CMD-2024-001",
          subsidiary_id: 1,
          subsidiary_name: "Filiale Douala",
          vehicles: [
            { id: 1, name: "Toyota RAV4", quantity: 2, unitPrice: 28000 },
            { id: 3, name: "Yamaha Scooter", quantity: 3, unitPrice: 3500 }
          ],
          total: 70000,
          status: "livrée",
          date: "2024-01-15",
          deliveryDate: "2024-01-20",
          paymentMethod: "virement"
        },
        {
          id: 2,
          orderNumber: "CMD-2024-002",
          subsidiary_id: 2,
          subsidiary_name: "Filiale Yaoundé",
          vehicles: [
            { id: 2, name: "Renault Clio", quantity: 5, unitPrice: 16500 }
          ],
          total: 82500,
          status: "validée",
          date: "2024-01-20",
          deliveryDate: "2024-02-05",
          paymentMethod: "crédit"
        },
        {
          id: 3,
          orderNumber: "CMD-2024-003",
          subsidiary_id: 1,
          subsidiary_name: "Filiale Douala",
          vehicles: [
            { id: 4, name: "Ford Transit", quantity: 1, unitPrice: 25000 }
          ],
          total: 25000,
          status: "en cours",
          date: "2024-01-25",
          deliveryDate: null,
          paymentMethod: "à définir"
        }
      ]

      setCompany(mockCompany)
      setSubsidiaries(mockSubsidiaries)
      setFleetOrders(mockFleetOrders)
      
    } catch (error) {
      toast.error('Erreur lors de la récupération des données entreprise')
    } finally {
      setLoading(false)
    }
  }

  const createFleetOrder = async (orderData) => {
    try {
      setLoading(true)
      
      // Simulation - À remplacer par l'appel API
      const newOrder = {
        id: fleetOrders.length + 1,
        orderNumber: `CMD-${new Date().getFullYear()}-${String(fleetOrders.length + 1).padStart(3, '0')}`,
        ...orderData,
        status: "en cours",
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      }
      
      setFleetOrders(prev => [...prev, newOrder])
      toast.success('Commande flotte créée avec succès')
      return newOrder
    } catch (error) {
      toast.error('Erreur lors de la création de la commande flotte')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateFleetOrder = async (orderId, updates) => {
    try {
      setLoading(true)
      setFleetOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        )
      )
      toast.success('Commande mise à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getSubsidiaryOrders = (subsidiaryId) => {
    return fleetOrders.filter(order => order.subsidiary_id === subsidiaryId)
  }

  const getSubsidiaryById = (subsidiaryId) => {
    return subsidiaries.find(sub => sub.id === subsidiaryId)
  }

  const calculateFleetStatistics = () => {
    const totalVehicles = subsidiaries.reduce((sum, sub) => sum + sub.vehicles, 0)
    const totalOrders = fleetOrders.length
    const totalSpent = fleetOrders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = fleetOrders.filter(order => order.status === 'en cours').length
    const deliveredOrders = fleetOrders.filter(order => order.status === 'livrée').length

    return {
      totalVehicles,
      totalOrders,
      totalSpent,
      pendingOrders,
      deliveredOrders,
      averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0
    }
  }

  const getFleetOverview = () => {
    return subsidiaries.map(subsidiary => {
      const orders = getSubsidiaryOrders(subsidiary.id)
      const spent = orders.reduce((sum, order) => sum + order.total, 0)
      
      return {
        ...subsidiary,
        ordersCount: orders.length,
        totalSpent: spent,
        pendingOrders: orders.filter(o => o.status === 'en cours').length
      }
    })
  }

  const value = {
    company,
    subsidiaries,
    fleetOrders,
    loading,
    fetchCompanyData,
    createFleetOrder,
    updateFleetOrder,
    getSubsidiaryOrders,
    getSubsidiaryById,
    calculateFleetStatistics,
    getFleetOverview
  }

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  )
}