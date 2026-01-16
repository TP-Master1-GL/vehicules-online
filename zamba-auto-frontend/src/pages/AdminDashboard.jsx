import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import adminService from '../api/admin'
import toast from 'react-hot-toast'
import {
  FaUsers, FaCar, FaShoppingCart, FaCog, FaPlus, FaEdit, FaTrash,
  FaCheckCircle, FaTimesCircle, FaChartBar, FaFileAlt, FaSearch,
  FaSync, FaEye, FaDownload, FaFilter, FaSort, FaTachometerAlt,
  FaCogs, FaWarehouse, FaMoneyBillWave, FaTags, FaExclamationTriangle,
  FaSpinner, FaDatabase, FaChartLine, FaUserCheck, FaGasPump, FaBolt,
  FaPlug, FaTachometerAlt as FaTachometer, FaCog as FaGear,
  FaDoorClosed, FaChair, FaMotorcycle, FaPalette, FaPercent,
  FaImage, FaCamera, FaUpload, FaCloudUploadAlt, FaImages, FaFileUpload,
  FaStar, FaExclamationCircle
} from 'react-icons/fa'

const AdminDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  // Réfs pour contrôler les exécutions
  const hasLoaded = useRef(false)
  const isMounted = useRef(true)
  
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // États de chargement
  const [loading, setLoading] = useState(true)
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    avgOrderValue: 0
  })

  // États des données
  const [users, setUsers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [orders, setOrders] = useState([])
  const [options, setOptions] = useState([])
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  
  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [orderFilter, setOrderFilter] = useState('all')

  // Fonctions de chargement
  const loadStats = useCallback(async () => {
    try {
      const [usersData, vehiclesData, ordersData] = await Promise.allSettled([
        adminService.getUtilisateurs(),
        adminService.getVehicules(),
        adminService.getCommandes()
      ])
      
      const users = usersData.status === 'fulfilled' ? usersData.value : []
      const vehicles = vehiclesData.status === 'fulfilled' ? vehiclesData.value : []
      const orders = ordersData.status === 'fulfilled' ? ordersData.value : []
      
      const completedOrders = orders.filter(o => o.statut === 'VALIDEE' || o.statut === 'LIVREE')
      const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.montantTotal || 0), 0)
      
      setStats({
        totalUsers: users.length,
        totalVehicles: vehicles.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.statut === 'EN_COURS').length,
        revenue: totalRevenue,
        avgOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0
      })
      
      return { users, vehicles, orders }
    } catch (error) {
      console.error('Erreur chargement stats:', error)
      return { users: [], vehicles: [], orders: [] }
    }
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true)
      const data = await adminService.getUtilisateurs()
      setUsers(data)
      return data
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error)
      toast.error('Erreur lors du chargement des utilisateurs')
      return []
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  const loadVehicles = useCallback(async () => {
    try {
      setLoadingVehicles(true)
      const data = await adminService.getVehicules()
      setVehicles(data)
      return data
    } catch (error) {
      console.error('Erreur chargement véhicules:', error)
      toast.error('Erreur lors du chargement des véhicules')
      return []
    } finally {
      setLoadingVehicles(false)
    }
  }, [])

  const loadOrders = useCallback(async () => {
    try {
      setLoadingOrders(true)
      const data = await adminService.getCommandes()
      setOrders(data)
      return data
    } catch (error) {
      console.error('Erreur chargement commandes:', error)
      toast.error('Erreur lors du chargement des commandes')
      return []
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  const loadOptions = useCallback(async () => {
    try {
      setLoadingOptions(true)
      const data = await adminService.getOptions()
      setOptions(data)
      return data
    } catch (error) {
      console.error('Erreur chargement options:', error)
      toast.error('Erreur lors du chargement des options')
      return []
    } finally {
      setLoadingOptions(false)
    }
  }, [])

  // Fonction principale de chargement
  const loadDashboardData = useCallback(async (force = false) => {
    if (!force && hasLoaded.current) {
      console.log('✅ Données déjà chargées, skip')
      return
    }
    
    if (!isMounted.current) return
    
    console.log('🚀 Début du chargement dashboard')
    setLoading(true)
    hasLoaded.current = true
    
    try {
      const statsResult = await loadStats()
      await loadOptions()
      
      if (statsResult.users) {
        setUsers(statsResult.users)
      }
      if (statsResult.vehicles) {
        setVehicles(statsResult.vehicles)
      }
      if (statsResult.orders) {
        setOrders(statsResult.orders)
      }
      
      console.log('✅ Dashboard chargé avec succès')
      
    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      if (isMounted.current) {
        setLoading(false)
        console.log('🏁 Chargement terminé')
      }
    }
  }, [loadStats, loadOptions])

  // useEffect PRINCIPAL
  useEffect(() => {
    isMounted.current = true
    
    const initializeDashboard = async () => {
      if (authLoading) {
        console.log('⏳ Auth en cours de chargement...')
        return
      }
      
      if (!isAuthenticated) {
        console.log('🔴 Non authentifié, redirection vers login')
        navigate('/login', { state: { from: '/admin/dashboard' } })
        return
      }
      
      const userRole = user?.role?.toUpperCase?.() || user?.role
      if (userRole !== 'ADMIN') {
        console.log('🔴 Rôle non admin, redirection vers home')
        toast.error('Accès refusé. Vous devez être administrateur.')
        navigate('/')
        return
      }
      
      if (!hasLoaded.current && isMounted.current) {
        console.log('🎯 Premier chargement du dashboard')
        await loadDashboardData()
      }
    }
    
    const timer = setTimeout(() => {
      if (isMounted.current) {
        initializeDashboard()
      }
    }, 100)
    
    return () => {
      isMounted.current = false
      clearTimeout(timer)
    }
  }, [isAuthenticated, authLoading, user, navigate, loadDashboardData])

  // Rafraîchissement manuel
  const handleRefresh = useCallback(async () => {
    console.log('🔄 Rafraîchissement manuel')
    hasLoaded.current = false
    await loadDashboardData(true)
  }, [loadDashboardData])

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.')) {
      return
    }
    try {
      await adminService.deleteVehicule(id)
      toast.success('Véhicule supprimé avec succès')
      await loadVehicles()
      const statsResult = await loadStats()
      setStats(statsResult)
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateCommandeStatut(orderId, newStatus)
      toast.success(`Commande ${newStatus === 'VALIDEE' ? 'validée' : 'marquée comme livrée'}`)
      await loadOrders()
      const statsResult = await loadStats()
      setStats(statsResult)
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    }
  }

  const handleExportData = (type) => {
    let data, filename
    
    switch(type) {
      case 'users':
        data = users
        filename = 'utilisateurs.csv'
        break
      case 'vehicles':
        data = vehicles
        filename = 'vehicules.csv'
        break
      case 'orders':
        data = orders
        filename = 'commandes.csv'
        break
      default:
        return
    }
    
    if (!data || data.length === 0) {
      toast.error('Aucune donnée à exporter')
      return
    }
    
    const headers = Object.keys(data[0] || {}).join(',')
    const rows = data.map(item => 
      Object.values(item).map(val => 
        `"${String(val).replace(/"/g, '""')}"`
      ).join(',')
    ).join('\n')
    
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success(`Données exportées: ${filename}`)
  }

  // Filtrage
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.typeVehicule?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = vehicleFilter === 'all' || 
      vehicle.typeVehicule === vehicleFilter ||
      (vehicleFilter === 'onsale' && vehicle.enSolde)
    
    return matchesSearch && matchesFilter
  })

  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.statut === orderFilter
    return matchesFilter
  })

  // Écran de chargement
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <FaDatabase className="text-blue-400 text-6xl animate-pulse" />
            </div>
            <div className="relative">
              <FaSpinner className="text-blue-600 text-8xl animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Chargement du tableau de bord</h2>
          <p className="text-gray-600 mb-6">Préparation de votre espace administrateur...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
          <p className="text-gray-500 text-sm mt-4">Cette opération peut prendre quelques secondes</p>
        </div>
      </div>
    )
  }

  // Si pas admin après chargement
  const userRole = user?.role?.toUpperCase?.() || user?.role
  if (!authLoading && isAuthenticated && userRole !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600 mb-6">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
              <div className="flex items-center gap-2 mt-1">
                <FaUserCheck className="text-green-500" />
                <span className="text-gray-600">Connecté en tant que <strong>{user?.nom || 'Administrateur'}</strong></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                disabled={loadingVehicles || loadingUsers || loadingOrders || loadingOptions}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(loadingVehicles || loadingUsers || loadingOrders || loadingOptions) ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Actualisation...
                  </>
                ) : (
                  <>
                    <FaSync />
                    Rafraîchir
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
              >
                <FaEye />
                Voir le site
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
              { id: 'vehicles', label: 'Véhicules', icon: FaCar },
              { id: 'orders', label: 'Commandes', icon: FaShoppingCart },
              { id: 'users', label: 'Utilisateurs', icon: FaUsers },
              { id: 'options', label: 'Options', icon: FaCog },
              { id: 'analytics', label: 'Analytics', icon: FaChartLine }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon />
                <span>{tab.label}</span>
                {tab.id === 'orders' && stats.pendingOrders > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Search/Filters */}
          {(activeTab === 'vehicles' || activeTab === 'orders' || activeTab === 'users') && (
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Rechercher ${activeTab === 'vehicles' ? 'un véhicule...' : activeTab === 'orders' ? 'une commande...' : 'un utilisateur...'}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>
                
                {activeTab === 'vehicles' && (
                  <div className="flex gap-2">
                    <select
                      value={vehicleFilter}
                      onChange={(e) => setVehicleFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="all">Tous les véhicules</option>
                      <option value="AUTOMOBILE">Automobiles</option>
                      <option value="SCOOTER">Scooters</option>
                      <option value="onsale">En solde</option>
                    </select>
                    <button
                      onClick={() => handleExportData('vehicles')}
                      disabled={vehicles.length === 0}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <FaDownload />
                      Exporter
                    </button>
                  </div>
                )}
                
                {activeTab === 'orders' && (
                  <div className="flex gap-2">
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="all">Toutes les commandes</option>
                      <option value="EN_COURS">En cours</option>
                      <option value="VALIDEE">Validées</option>
                      <option value="LIVREE">Livrées</option>
                    </select>
                    <button
                      onClick={() => handleExportData('orders')}
                      disabled={orders.length === 0}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <FaDownload />
                      Exporter
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <DashboardView 
                stats={stats}
                vehicles={vehicles}
                orders={orders}
                users={users}
                onAddVehicle={() => setShowVehicleForm(true)}
              />
            )}

            {activeTab === 'vehicles' && (
              <VehiclesView
                vehicles={filteredVehicles}
                loading={loadingVehicles}
                onAdd={() => setShowVehicleForm(true)}
                onEdit={(vehicle) => {
                  setEditingVehicle(vehicle)
                  setShowVehicleForm(true)
                }}
                onDelete={handleDeleteVehicle}
                onRefresh={loadVehicles}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersView
                orders={filteredOrders}
                loading={loadingOrders}
                onUpdateStatus={handleUpdateOrderStatus}
                onRefresh={loadOrders}
              />
            )}

            {activeTab === 'users' && (
              <UsersView
                users={users}
                loading={loadingUsers}
                onRefresh={loadUsers}
                onExport={() => handleExportData('users')}
              />
            )}

            {activeTab === 'options' && (
              <OptionsView
                options={options}
                loading={loadingOptions}
                onRefresh={loadOptions}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                stats={stats}
                orders={orders}
                vehicles={vehicles}
                users={users}
              />
            )}
          </div>
        </div>
      </main>

      {/* Vehicle Form Modal avec upload d'images */}
      {showVehicleForm && (
        <VehicleFormWithImagesModal
          vehicle={editingVehicle}
          onClose={() => {
            setShowVehicleForm(false)
            setEditingVehicle(null)
          }}
          onSave={() => {
            setShowVehicleForm(false)
            setEditingVehicle(null)
            handleRefresh()
          }}
        />
      )}
    </div>
  )
}

// Dashboard View Component
const DashboardView = ({ stats, vehicles, orders, users, onAddVehicle }) => {
  const recentVehicles = [...vehicles].slice(-3).reverse()
  const recentOrders = [...orders].slice(-3).reverse()
  const recentUsers = [...users].slice(-3).reverse()
  
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aperçu général</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <FaUsers className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Véhicules</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalVehicles}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <FaCar className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Commandes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.pendingOrders} en attente</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <FaShoppingCart className="text-white text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">Chiffre d'affaires</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.revenue.toLocaleString()} FCFA</p>
              </div>
              <div className="bg-amber-500 p-3 rounded-lg">
                <FaMoneyBillWave className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onAddVehicle}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-5 text-left hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <FaPlus className="text-2xl mb-2" />
                <h3 className="font-bold text-lg">Ajouter un véhicule</h3>
                <p className="text-blue-100 text-sm mt-1">Mettez en vente un nouveau véhicule</p>
              </div>
            </div>
          </button>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <FaChartLine className="text-gray-600 text-2xl mb-2" />
                <h3 className="font-bold text-lg text-gray-900">Analytics</h3>
                <p className="text-gray-600 text-sm mt-1">Consultez les statistiques détaillées</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <FaUsers className="text-gray-600 text-2xl mb-2" />
                <h3 className="font-bold text-lg text-gray-900">Utilisateurs</h3>
                <p className="text-gray-600 text-sm mt-1">{stats.totalUsers} utilisateurs actifs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Véhicules récents</h3>
          <div className="space-y-3">
            {recentVehicles.length > 0 ? recentVehicles.map(vehicle => (
              <div key={vehicle.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                {vehicle.imageUrl ? (
                  <img 
                    src={vehicle.imageUrl} 
                    alt={vehicle.marque}
                    className="h-10 w-10 object-cover rounded-lg mr-3"
                  />
                ) : (
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaCar className="text-blue-600" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{vehicle.marque} {vehicle.modele}</div>
                  <div className="text-sm text-gray-500">{vehicle.typeVehicule}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{vehicle.prix?.toLocaleString()} FCFA</div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Aucun véhicule récent</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Commandes récentes</h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? recentOrders.map(order => (
              <div key={order.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg mr-3 ${
                  order.statut === 'VALIDEE' ? 'bg-green-100' :
                  order.statut === 'EN_COURS' ? 'bg-yellow-100' :
                  'bg-gray-100'
                }`}>
                  <FaShoppingCart className={
                    order.statut === 'VALIDEE' ? 'text-green-600' :
                    order.statut === 'EN_COURS' ? 'text-yellow-600' :
                    'text-gray-600'
                  } />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">#{order.id}</div>
                  <div className="text-sm text-gray-500">{order.client?.nom || 'Client'}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{order.montantTotal?.toLocaleString()} FCFA</div>
                  <div className={`text-xs font-medium ${
                    order.statut === 'VALIDEE' ? 'text-green-600' :
                    order.statut === 'EN_COURS' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {order.statut}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Aucune commande récente</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Nouveaux utilisateurs</h3>
          <div className="space-y-3">
            {recentUsers.length > 0 ? recentUsers.map(user => (
              <div key={user.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <FaUsers className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{user.nom}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">Aucun utilisateur récent</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Vehicles View Component
const VehiclesView = ({ vehicles, loading, onAdd, onEdit, onDelete, onRefresh }) => (
  <div>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des véhicules</h2>
        <p className="text-gray-600">{vehicles.length} véhicule(s) trouvé(s)</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 border border-gray-300"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          {loading ? 'Chargement...' : 'Rafraîchir'}
        </button>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <FaPlus />
          Ajouter un véhicule
        </button>
      </div>
    </div>

    {loading ? (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <FaSpinner className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des véhicules...</p>
        </div>
      </div>
    ) : vehicles.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <FaCar className="text-gray-400 text-5xl mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun véhicule trouvé</h3>
        <p className="text-gray-600 mb-6">Commencez par ajouter votre premier véhicule</p>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mx-auto"
        >
          <FaPlus />
          Ajouter un véhicule
        </button>
      </div>
    ) : (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {vehicle.imageUrl ? (
                      <img 
                        src={vehicle.imageUrl} 
                        alt={vehicle.marque}
                        className="h-10 w-10 object-cover rounded-lg mr-3"
                      />
                    ) : (
                      <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FaCar className="text-blue-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.marque}</div>
                      <div className="text-sm text-gray-500">{vehicle.modele || vehicle.nom}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {vehicle.typeVehicule}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {vehicle.typeCarburant || 'ESSENCE'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">
                    {vehicle.prix?.toLocaleString()} FCFA
                  </div>
                  {vehicle.enSolde && (
                    <div className="text-xs text-red-600 flex items-center gap-1">
                      <FaTags />
                      En solde
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    vehicle.quantite > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.quantite > 0 ? 'En stock' : 'Rupture'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <FaImage className="text-blue-500" />
                        <span className="text-sm text-gray-600">{vehicle.images.length}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Aucune</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(vehicle.id)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

// Orders View Component
const OrdersView = ({ orders, loading, onUpdateStatus, onRefresh }) => (
  <div>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des commandes</h2>
        <p className="text-gray-600">{orders.length} commande(s) trouvée(s)</p>
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 border border-gray-300"
      >
        <FaSync className={loading ? 'animate-spin' : ''} />
        {loading ? 'Chargement...' : 'Rafraîchir'}
      </button>
    </div>

    {loading ? (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="text-blue-500 text-4xl animate-spin" />
      </div>
    ) : orders.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <FaShoppingCart className="text-gray-400 text-5xl mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
        <p className="text-gray-600">Aucune commande n'a été passée pour le moment</p>
      </div>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    order.statut === 'VALIDEE' ? 'bg-green-100' :
                    order.statut === 'EN_COURS' ? 'bg-yellow-100' :
                    order.statut === 'LIVREE' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    <FaShoppingCart className={
                      order.statut === 'VALIDEE' ? 'text-green-600' :
                      order.statut === 'EN_COURS' ? 'text-yellow-600' :
                      order.statut === 'LIVREE' ? 'text-blue-600' :
                      'text-gray-600'
                    } />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">Commande #{order.id}</h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        order.statut === 'VALIDEE' ? 'bg-green-100 text-green-800' :
                        order.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                        order.statut === 'LIVREE' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.statut}
                      </span>
                    </div>
                    <div className="text-gray-600 mb-1">
                      <span className="font-medium">Client:</span> {order.client?.nom || 'N/A'}
                    </div>
                    <div className="text-gray-600 mb-1">
                      <span className="font-medium">Email:</span> {order.client?.email || 'N/A'}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Date:</span> {new Date(order.dateCreation).toLocaleDateString()} à {new Date(order.dateCreation).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{order.montantTotal?.toLocaleString()} FCFA</div>
                  <div className="text-sm text-gray-500">
                    {order.vehicules?.length || 0} véhicule(s)
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {order.statut === 'EN_COURS' && (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'VALIDEE')}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaCheckCircle />
                      Valider
                    </button>
                  )}
                  {(order.statut === 'EN_COURS' || order.statut === 'VALIDEE') && (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'LIVREE')}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaCheckCircle />
                      Livrer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)

// Users View Component
const UsersView = ({ users, loading, onRefresh, onExport }) => (
  <div>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
        <p className="text-gray-600">{users.length} utilisateur(s) inscrit(s)</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 border border-gray-300"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          {loading ? 'Chargement...' : 'Rafraîchir'}
        </button>
        <button
          onClick={onExport}
          disabled={users.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <FaDownload />
          Exporter
        </button>
      </div>
    </div>

    {loading ? (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="text-blue-500 text-4xl animate-spin" />
      </div>
    ) : users.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <FaUsers className="text-gray-400 text-5xl mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
        <p className="text-gray-600">Aucun utilisateur n'est inscrit pour le moment</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.nom?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.nom}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                user.role === 'ADMIN' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Téléphone:</span>
                <span>{user.telephone || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Inscription:</span>
                <span>{new Date(user.dateInscription || user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                user.enabled !== false 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.enabled !== false ? '✅ Compte actif' : '❌ Compte désactivé'}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)

// Options View Component
const OptionsView = ({ options, loading, onRefresh }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des options</h2>
        <p className="text-gray-600">{options.length} option(s) disponible(s)</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 border border-gray-300"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          {loading ? 'Chargement...' : 'Rafraîchir'}
        </button>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus />
          Ajouter une option
        </button>
      </div>
    </div>

    {loading ? (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="text-blue-500 text-4xl animate-spin" />
      </div>
    ) : options.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <FaCog className="text-gray-400 text-5xl mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune option disponible</h3>
        <p className="text-gray-600 mb-6">Ajoutez des options pour personnaliser les véhicules</p>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mx-auto">
          <FaPlus />
          Créer une option
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option) => (
          <div key={option.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{option.nom}</h3>
                <p className="text-gray-600 mt-1">{option.description}</p>
              </div>
              <FaCogs className="text-blue-500 text-xl" />
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-xl font-bold text-gray-900">
                {option.prix?.toLocaleString()} FCFA
              </span>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors">
                  <FaEdit />
                </button>
                <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)

// Analytics View Component
const AnalyticsView = ({ stats, orders, vehicles, users }) => {
  const monthlyRevenue = orders.reduce((acc, order) => {
    if (order.statut === 'VALIDEE' || order.statut === 'LIVREE') {
      const month = new Date(order.dateCreation).getMonth()
      acc[month] = (acc[month] || 0) + (order.montantTotal || 0)
    }
    return acc
  }, {})
  
  const vehicleTypes = vehicles.reduce((acc, vehicle) => {
    const type = vehicle.typeVehicule
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Rapports</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques clés</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Taux de conversion</span>
              <span className="font-bold text-gray-900">
                {users.length > 0 ? ((orders.length / users.length) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Panier moyen</span>
              <span className="font-bold text-gray-900">{stats.avgOrderValue.toLocaleString()} FCFA</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Commandes par jour (moy.)</span>
              <span className="font-bold text-gray-900">
                {orders.length > 0 ? (orders.length / 30).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des véhicules</h3>
          <div className="space-y-3">
            {Object.entries(vehicleTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-700">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / vehicles.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performances mensuelles</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => {
              const month = new Date(0, i).toLocaleString('fr-FR', { month: 'short' })
              const revenue = monthlyRevenue[i] || 0
              return (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">{month}</div>
                  <div className="text-xl font-bold text-gray-900">
                    {revenue > 0 ? (revenue / 1000).toFixed(0) + 'K' : '0'} FCFA
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Vehicle Form Modal avec upload d'images - VERSION COMPLÈTE ET FONCTIONNELLE
const VehicleFormWithImagesModal = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    prix: '',
    typeVehicule: 'AUTOMOBILE',
    typeCarburant: 'ESSENCE',
    couleur: '#3B82F6',
    quantite: '1',
    enSolde: false,
    pourcentageSolde: '',
    
    // Champs automobiles
    nombrePortes: '4',
    nombrePlaces: '5',
    puissance: '100',
    transmission: 'AUTOMATIQUE',
    consommation: '6.5',
    carburant: 'ESSENCE',
    autonomie: '600',
    
    // Champs scooters
    cylindree: '125',
    categoriePermis: 'A',
    
    // Champs électriques
    tempsCharge: '30',
    tempsChargeRapide: '30',
    typeBatterie: 'LITHIUM_ION',
    typeChargeur: 'TYPE2'
  })
  
  const [loading, setLoading] = useState(false)
  const [formStep, setFormStep] = useState(1)
  const [selectedImages, setSelectedImages] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [existingImages, setExistingImages] = useState([])

  // Initialisation
  useEffect(() => {
    if (vehicle) {
      setFormData({
        marque: vehicle.marque || '',
        modele: vehicle.modele || vehicle.nom || '',
        prix: vehicle.prix || vehicle.prixBase || '',
        typeVehicule: vehicle.typeVehicule || 'AUTOMOBILE',
        typeCarburant: vehicle.typeCarburant || 'ESSENCE',
        couleur: vehicle.couleur || '#3B82F6',
        quantite: vehicle.quantite?.toString() || '1',
        enSolde: vehicle.enSolde || false,
        pourcentageSolde: vehicle.pourcentageSolde?.toString() || '',
        
        nombrePortes: vehicle.nombrePortes?.toString() || '4',
        nombrePlaces: vehicle.nombrePlaces?.toString() || '5',
        puissance: vehicle.puissance?.toString() || '100',
        transmission: vehicle.transmission || 'AUTOMATIQUE',
        consommation: vehicle.consommation?.toString() || '6.5',
        carburant: vehicle.carburant || 'ESSENCE',
        autonomie: vehicle.autonomie?.toString() || '600',
        
        cylindree: vehicle.cylindree?.toString() || '125',
        categoriePermis: vehicle.categoriePermis || 'A',
        
        tempsCharge: vehicle.tempsCharge?.toString() || '30',
        tempsChargeRapide: vehicle.tempsChargeRapide?.toString() || '30',
        typeBatterie: vehicle.typeBatterie || 'LITHIUM_ION',
        typeChargeur: vehicle.typeChargeur || 'TYPE2'
      })
      
      if (vehicle.images && vehicle.images.length > 0) {
        setExistingImages(vehicle.images)
      }
    }
  }, [vehicle])

  // Nettoyer les URLs de prévisualisation
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  // Gestion de la sélection d'images
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    
    if (selectedImages.length + files.length > 10) {
      toast.error('Maximum 10 images autorisées')
      return
    }
    
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      toast.error('Certains fichiers dépassent 5MB')
      return
    }
    
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    
    setSelectedImages(prev => [...prev, ...files])
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    
    toast.success(`${files.length} image(s) sélectionnée(s)`)
  }

  // Supprimer une image sélectionnée
  const removeSelectedImage = (index) => {
    URL.revokeObjectURL(previewUrls[index])
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  // Supprimer une image existante
  const removeExistingImage = async (imageId) => {
    if (vehicle) {
      try {
        await adminService.deleteVehiculeImage(imageId)
        setExistingImages(prev => prev.filter(img => img.id !== imageId))
        toast.success('Image supprimée')
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  // Définir une image comme principale
  const setAsMainImage = async (imageId) => {
    if (vehicle) {
      try {
        await adminService.setImageAsMain(imageId)
        setExistingImages(prev => 
          prev.map(img => ({
            ...img,
            isMain: img.id === imageId
          }))
        )
        toast.success('Image définie comme principale')
      } catch (error) {
        toast.error('Erreur lors de la mise à jour')
      }
    }
  }

  // Validation du formulaire
  const validateForm = () => {
    const errors = []
    
    if (!formData.marque.trim()) errors.push('La marque est requise')
    if (!formData.modele.trim()) errors.push('Le modèle est requis')
    if (!formData.prix || parseFloat(formData.prix) <= 0) errors.push('Le prix doit être supérieur à 0')
    if (!formData.quantite || parseInt(formData.quantite) < 1) errors.push('La quantité doit être au moins 1')
    
    return errors
  }

  // Préparation des données pour le backend
  const prepareDataForBackend = () => {
    const backendData = {
      marque: formData.marque.trim(),
      modele: formData.modele.trim(),
      prix: parseFloat(formData.prix),
      typeVehicule: formData.typeVehicule,
      typeCarburant: formData.typeCarburant,
      couleur: formData.couleur,
      quantite: parseInt(formData.quantite),
      enSolde: formData.enSolde,
      pourcentageSolde: formData.enSolde && formData.pourcentageSolde 
        ? parseFloat(formData.pourcentageSolde) 
        : null,
      dateStock: new Date().toISOString().split('T')[0]
    }
  
    if (formData.typeVehicule === 'AUTOMOBILE') {
      backendData.nombrePortes = parseInt(formData.nombrePortes)
      backendData.nombrePlaces = parseInt(formData.nombrePlaces)
      backendData.puissance = parseInt(formData.puissance)
      backendData.transmission = formData.transmission
      
      if (formData.typeCarburant === 'ESSENCE' || formData.typeCarburant === 'DIESEL' || formData.typeCarburant === 'HYBRIDE') {
        backendData.consommation = parseFloat(formData.consommation)
        backendData.carburant = formData.carburant
        backendData.autonomie = parseInt(formData.autonomie)
      } else if (formData.typeCarburant === 'ELECTRIQUE') {
        backendData.autonomie = parseInt(formData.autonomie)
        backendData.tempsChargeRapide = parseInt(formData.tempsChargeRapide)
        backendData.typeChargeur = formData.typeChargeur
      }
    } else if (formData.typeVehicule === 'SCOOTER') {
      backendData.cylindree = parseInt(formData.cylindree)
      backendData.categoriePermis = formData.categoriePermis
      
      if (formData.typeCarburant === 'ESSENCE' || formData.typeCarburant === 'DIESEL') {
        backendData.consommation = parseFloat(formData.consommation)
        backendData.carburant = formData.carburant
        backendData.autonomie = parseInt(formData.autonomie)
      } else if (formData.typeCarburant === 'ELECTRIQUE') {
        backendData.autonomie = parseInt(formData.autonomie)
        backendData.tempsCharge = parseInt(formData.tempsCharge)
        backendData.typeBatterie = formData.typeBatterie
      }
    }
  
    return backendData
  }

  // Création ou mise à jour du véhicule avec images
  const handleCreateOrUpdateVehicle = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return false
    }
    
    setLoading(true)
    
    try {
      // 1. Préparer les données du véhicule
      const vehicleData = prepareDataForBackend()
      console.log('📤 Envoi des données véhicule:', vehicleData)
      
      let vehicleId
      let response
      
      // 2. Créer ou mettre à jour le véhicule
      if (vehicle) {
        response = await adminService.updateVehicule(vehicle.id, vehicleData)
        vehicleId = vehicle.id
        toast.success('✅ Véhicule mis à jour avec succès')
      } else {
        response = await adminService.createVehicule(vehicleData)
        vehicleId = response.id
        toast.success('✅ Véhicule créé avec succès')
      }
      
      console.log('📥 Réponse création véhicule:', response)
      
      // 3. Uploader les images sélectionnées
      if (selectedImages.length > 0) {
        toast.success(`📸 Upload de ${selectedImages.length} image(s)...`)
        
        const uploadPromises = selectedImages.map(async (file, index) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('isMain', index === 0 && existingImages.length === 0)
          
          return await adminService.uploadVehiculeImage(vehicleId, formData)
        })
        
        await Promise.all(uploadPromises)
        toast.success('✅ Toutes les images ont été uploadées')
      }
      
      // 4. Nettoyer les prévisualisations
      previewUrls.forEach(url => URL.revokeObjectURL(url))
      
      // 5. Appeler le callback de sauvegarde
      if (onSave) {
        onSave()
      }
      
      return true
      
    } catch (error) {
      console.error('❌ Erreur création véhicule:', error)
      
      let errorMessage = 'Erreur lors de la sauvegarde'
      if (error.response?.data) {
        console.error('📄 Détails erreur backend:', error.response.data)
        if (error.response.data.error) errorMessage = error.response.data.error
        else if (error.response.data.message) errorMessage = error.response.data.message
      }
      
      toast.error(`❌ ${errorMessage}`)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formStep < 3) {
      setFormStep(formStep + 1)
      return
    }
    
    await handleCreateOrUpdateVehicle()
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const renderStepContent = () => {
    switch (formStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de véhicule *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, typeVehicule: 'AUTOMOBILE'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border ${
                      formData.typeVehicule === 'AUTOMOBILE'
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    <FaCar />
                    Automobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, typeVehicule: 'SCOOTER'})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border ${
                      formData.typeVehicule === 'SCOOTER'
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    <FaMotorcycle />
                    Scooter
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'énergie *
                </label>
                <select
                  name="typeCarburant"
                  value={formData.typeCarburant}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  required
                >
                  <option value="ESSENCE">Essence</option>
                  <option value="ELECTRIQUE">Électrique</option>
                  <option value="HYBRIDE">Hybride</option>
                  <option value="DIESEL">Diesel</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marque *
                </label>
                <input
                  type="text"
                  name="marque"
                  value={formData.marque}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  required
                  placeholder="Ex: Toyota, Peugeot..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modèle *
                </label>
                <input
                  type="text"
                  name="modele"
                  value={formData.modele}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  required
                  placeholder="Ex: Corolla, 208..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  required
                  min="0"
                  step="1000"
                  placeholder="Ex: 15000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité en stock *
                </label>
                <input
                  type="number"
                  name="quantite"
                  value={formData.quantite}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  required
                  min="1"
                  placeholder="Ex: 5"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaPalette className="inline mr-2" />
                Couleur
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleInputChange}
                  className="h-10 w-10 cursor-pointer rounded"
                />
                <input
                  type="text"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleInputChange}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enSolde"
                name="enSolde"
                checked={formData.enSolde}
                onChange={handleInputChange}
                className="h-5 w-5"
              />
              <label htmlFor="enSolde" className="text-sm font-medium text-gray-700">
                <FaPercent className="inline mr-2" />
                Mettre en promotion
              </label>
            </div>
            
            {formData.enSolde && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pourcentage de réduction
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="pourcentageSolde"
                    value={formData.pourcentageSolde}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="Ex: 15.5"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            )}
          </div>
        )
      
      case 2:
        return formData.typeVehicule === 'AUTOMOBILE' 
          ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Caractéristiques de l'automobile
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de portes
                  </label>
                  <select
                    name="nombrePortes"
                    value={formData.nombrePortes}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  >
                    <option value="2">2 portes</option>
                    <option value="3">3 portes</option>
                    <option value="4">4 portes</option>
                    <option value="5">5 portes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de places
                  </label>
                  <select
                    name="nombrePlaces"
                    value={formData.nombrePlaces}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  >
                    <option value="2">2 places</option>
                    <option value="4">4 places</option>
                    <option value="5">5 places</option>
                    <option value="7">7 places</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Puissance (ch)
                  </label>
                  <input
                    type="number"
                    name="puissance"
                    value={formData.puissance}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                    min="50"
                    step="10"
                    placeholder="Ex: 100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  >
                    <option value="MANUELLE">Manuelle</option>
                    <option value="AUTOMATIQUE">Automatique</option>
                  </select>
                </div>
              </div>
              
              {(formData.typeCarburant === 'ESSENCE' || formData.typeCarburant === 'DIESEL' || formData.typeCarburant === 'HYBRIDE') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consommation (L/100km)
                      </label>
                      <input
                        type="number"
                        name="consommation"
                        value={formData.consommation}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                        min="0"
                        step="0.1"
                        placeholder="Ex: 6.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Autonomie (km)
                      </label>
                      <input
                        type="number"
                        name="autonomie"
                        value={formData.autonomie}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                        min="100"
                        step="50"
                        placeholder="Ex: 600"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de carburant
                    </label>
                    <select
                      name="carburant"
                      value={formData.carburant}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                    >
                      <option value="ESSENCE">Essence</option>
                      <option value="DIESEL">Diesel</option>
                      <option value="HYBRIDE">Hybride</option>
                    </select>
                  </div>
                </>
              )}
              
              {formData.typeCarburant === 'ELECTRIQUE' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Autonomie (km)
                    </label>
                    <input
                      type="number"
                      name="autonomie"
                      value={formData.autonomie}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                      min="100"
                      step="50"
                      placeholder="Ex: 400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temps charge rapide (min)
                    </label>
                    <input
                      type="number"
                      name="tempsChargeRapide"
                      value={formData.tempsChargeRapide}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                      min="10"
                      step="5"
                      placeholder="Ex: 30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de chargeur
                    </label>
                    <select
                      name="typeChargeur"
                      value={formData.typeChargeur}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                    >
                      <option value="TYPE1">Type 1</option>
                      <option value="TYPE2">Type 2</option>
                      <option value="CCS">CCS</option>
                      <option value="CHADEMO">CHAdeMO</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )
          : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Caractéristiques du scooter
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cylindrée (cc)
                  </label>
                  <select
                    name="cylindree"
                    value={formData.cylindree}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  >
                    <option value="50">50cc</option>
                    <option value="125">125cc</option>
                    <option value="250">250cc</option>
                    <option value="300">300cc</option>
                    <option value="500">500cc</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie permis
                  </label>
                  <select
                    name="categoriePermis"
                    value={formData.categoriePermis}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  >
                    <option value="AM">AM (50cc)</option>
                    <option value="A1">A1 (125cc)</option>
                    <option value="A2">A2 (≤35kW)</option>
                    <option value="A">A (Toutes)</option>
                  </select>
                </div>
              </div>
              
              {(formData.typeCarburant === 'ESSENCE' || formData.typeCarburant === 'DIESEL') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consommation (L/100km)
                    </label>
                    <input
                      type="number"
                      name="consommation"
                      value={formData.consommation}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                      min="0"
                      step="0.1"
                      placeholder="Ex: 2.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Autonomie (km)
                    </label>
                    <input
                      type="number"
                      name="autonomie"
                      value={formData.autonomie}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                      min="100"
                      step="50"
                      placeholder="Ex: 250"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de carburant
                    </label>
                    <select
                      name="carburant"
                      value={formData.carburant}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                    >
                      <option value="ESSENCE">Essence</option>
                      <option value="DIESEL">Diesel</option>
                    </select>
                  </div>
                </div>
              )}
              
              {formData.typeCarburant === 'ELECTRIQUE' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Autonomie (km)
                    </label>
                    <input
                      type="number"
                      name="autonomie"
                      value={formData.autonomie}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                      min="50"
                      step="10"
                      placeholder="Ex: 100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temps charge (min)
                    </label>
                    <input
                      type="number"
                      name="tempsCharge"
                      value={formData.tempsCharge}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                      min="30"
                      step="15"
                      placeholder="Ex: 120"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de batterie
                    </label>
                    <select
                      name="typeBatterie"
                      value={formData.typeBatterie}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                    >
                      <option value="LITHIUM_ION">Lithium-ion</option>
                      <option value="PLOMB">Plomb</option>
                      <option value="NIMH">NiMH</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <FaImages className="inline mr-2" />
                Images du véhicule
              </h3>
              <p className="text-gray-600 mb-4">
                Ajoutez des photos de haute qualité pour présenter votre véhicule. 
                Vous pouvez sélectionner jusqu'à 10 images.
              </p>
            </div>
            
            {/* Zone d'upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
              <div className="max-w-md mx-auto">
                <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">Sélectionnez vos images</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Formats supportés: JPG, PNG, WebP (Max 5MB par image)
                </p>
                
                <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  <FaUpload />
                  Parcourir les fichiers
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={loading}
                  />
                </label>
                
                <p className="text-sm text-gray-500 mt-3">
                  {selectedImages.length} image(s) sélectionnée(s)
                </p>
              </div>
            </div>
            
            {/* Prévisualisation des nouvelles images */}
            {selectedImages.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Images à uploader ({selectedImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className={`relative overflow-hidden rounded-lg border ${index === 0 && existingImages.length === 0 ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
                        <img
                          src={previewUrls[index]}
                          alt={file.name}
                          className="w-full h-32 object-cover"
                        />
                        {index === 0 && existingImages.length === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Principale
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Images existantes */}
            {existingImages.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Images existantes ({existingImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className={`relative overflow-hidden rounded-lg border-2 ${
                        image.isMain ? 'border-blue-500' : 'border-gray-200'
                      }`}>
                        <img
                          src={image.fileUrl || image.thumbnailUrl}
                          alt={image.fileName}
                          className="w-full h-32 object-cover"
                        />
                        {image.isMain && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Principale
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            {!image.isMain && (
                              <button
                                type="button"
                                onClick={() => setAsMainImage(image.id)}
                                className="bg-white p-2 rounded-full hover:bg-gray-100"
                                title="Définir comme principale"
                              >
                                <FaStar className="text-amber-500" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeExistingImage(image.id)}
                              className="bg-white p-2 rounded-full hover:bg-gray-100"
                              title="Supprimer"
                            >
                              <FaTrash className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">{image.fileName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedImages.length === 0 && existingImages.length === 0 && !vehicle && (
              <div className="text-center py-4 bg-amber-50 rounded-lg border border-amber-200">
                <FaExclamationCircle className="text-amber-500 inline-block mr-2" />
                <span className="text-amber-700">
                  Aucune image sélectionnée. Vous pourrez en ajouter plus tard dans l'édition.
                </span>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {vehicle ? 'Modifier' : 'Ajouter'} un véhicule
              </h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    {step > 1 && <span>→</span>}
                    <span className={`px-2 py-1 rounded ${
                      formStep === step 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      Étape {step}: {step === 1 ? 'Infos' : step === 2 ? 'Caract.' : 'Images'}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1"
              disabled={loading}
            >
              <FaTimesCircle className="text-xl" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between pt-6 border-t border-gray-200">
            {formStep > 1 && (
              <button
                type="button"
                onClick={() => setFormStep(formStep - 1)}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ← Précédent
              </button>
            )}
            
            <div className="flex gap-4 ml-auto">
              {formStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setFormStep(formStep + 1)}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Suivant →
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    disabled={loading}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    ← Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <FaSpinner className="animate-spin" />}
                    {vehicle ? 'Mettre à jour' : 'Créer'} le véhicule
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard