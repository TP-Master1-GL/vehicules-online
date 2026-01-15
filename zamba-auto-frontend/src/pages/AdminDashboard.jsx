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
  FaSpinner, FaDatabase, FaChartLine, FaUserCheck
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

  // Fonctions de chargement simples et stables
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

  // Fonction principale de chargement - SIMPLIFIÉE
  const loadDashboardData = useCallback(async (force = false) => {
    // Si déjà chargé et pas de force refresh, on skip
    if (!force && hasLoaded.current) {
      console.log('✅ Données déjà chargées, skip')
      return
    }
    
    // Vérifier si le composant est toujours monté
    if (!isMounted.current) return
    
    console.log('🚀 Début du chargement dashboard')
    setLoading(true)
    hasLoaded.current = true
    
    try {
      // Charger les stats d'abord (contient déjà users, vehicles, orders)
      const statsResult = await loadStats()
      
      // Charger les options séparément
      await loadOptions()
      
      // Mettre à jour les états avec les données déjà récupérées
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

  // useEffect PRINCIPAL - OPTIMISÉ et SIMPLIFIÉ
  useEffect(() => {
    isMounted.current = true
    
    const initializeDashboard = async () => {
      // Attendre que l'authentification soit chargée
      if (authLoading) {
        console.log('⏳ Auth en cours de chargement...')
        return
      }
      
      // Vérifier l'authentification
      if (!isAuthenticated) {
        console.log('🔴 Non authentifié, redirection vers login')
        navigate('/login', { state: { from: '/admin/dashboard' } })
        return
      }
      
      // Vérifier le rôle
      const userRole = user?.role?.toUpperCase?.() || user?.role
      if (userRole !== 'ADMIN') {
        console.log('🔴 Rôle non admin, redirection vers home')
        toast.error('Accès refusé. Vous devez être administrateur.')
        navigate('/')
        return
      }
      
      // Charger les données une seule fois
      if (!hasLoaded.current && isMounted.current) {
        console.log('🎯 Premier chargement du dashboard')
        await loadDashboardData()
      }
    }
    
    // Délai pour éviter les conflits de rendu
    const timer = setTimeout(() => {
      if (isMounted.current) {
        initializeDashboard()
      }
    }, 100)
    
    // Cleanup
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
      // Recharger uniquement les véhicules et stats
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
      // Recharger uniquement les commandes et stats
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

      {/* Vehicle Form Modal */}
      {showVehicleForm && (
        <VehicleFormModal
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
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaCar className="text-blue-600" />
                </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FaCar className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.marque}</div>
                      <div className="text-sm text-gray-500">{vehicle.modele || vehicle.nom}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {vehicle.typeVehicule}
                  </span>
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

// Vehicle Form Modal Component
const VehicleFormModal = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    prix: '',
    typeVehicule: 'AUTOMOBILE',
    typeCarburant: 'ESSENCE',
    couleur: '#3B82F6',
    quantite: '1',
    enSolde: false,
    pourcentageSolde: ''
  })
  
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (vehicle) {
      setFormData({
        marque: vehicle.marque || '',
        modele: vehicle.modele || vehicle.nom || '',
        prix: vehicle.prix || '',
        typeVehicule: vehicle.typeVehicule || 'AUTOMOBILE',
        typeCarburant: vehicle.typeCarburant || 'ESSENCE',
        couleur: vehicle.couleur || '#3B82F6',
        quantite: vehicle.quantite || '1',
        enSolde: vehicle.enSolde || false,
        pourcentageSolde: vehicle.pourcentageSolde || ''
      })
    }
  }, [vehicle])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const vehicleData = {
        marque: formData.marque,
        modele: formData.modele,
        prix: parseFloat(formData.prix),
        typeVehicule: formData.typeVehicule,
        typeCarburant: formData.typeCarburant,
        couleur: formData.couleur,
        quantite: parseInt(formData.quantite),
        enSolde: formData.enSolde,
        pourcentageSolde: formData.enSolde && formData.pourcentageSolde ? parseFloat(formData.pourcentageSolde) : null
      }
      
      if (vehicle) {
        await adminService.updateVehicule(vehicle.id, vehicleData)
        toast.success('Véhicule mis à jour avec succès')
      } else {
        await adminService.createVehicule(vehicleData)
        toast.success('Véhicule créé avec succès')
      }
      
      onSave()
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {vehicle ? 'Modifier' : 'Ajouter'} un véhicule
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1"
              disabled={loading}
            >
              <FaTimesCircle className="text-xl" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
            <input
              type="text"
              value={formData.marque}
              onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle *</label>
            <input
              type="text"
              value={formData.modele}
              onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.typeVehicule}
                onChange={(e) => setFormData({ ...formData, typeVehicule: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={loading}
              >
                <option value="AUTOMOBILE">Automobile</option>
                <option value="SCOOTER">Scooter</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Énergie *</label>
              <select
                value={formData.typeCarburant}
                onChange={(e) => setFormData({ ...formData, typeCarburant: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={loading}
              >
                <option value="ESSENCE">Essence</option>
                <option value="ELECTRIQUE">Électrique</option>
                <option value="HYBRIDE">Hybride</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
            <input
              type="number"
              value={formData.prix}
              onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
              disabled={loading}
              min="0"
              step="1000"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
              <input
                type="number"
                value={formData.quantite}
                onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                disabled={loading}
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.couleur}
                  onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                  className="h-10 w-10 cursor-pointer"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={formData.couleur}
                  onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enSolde"
              checked={formData.enSolde}
              onChange={(e) => setFormData({ ...formData, enSolde: e.target.checked })}
              className="h-5 w-5"
              disabled={loading}
            />
            <label htmlFor="enSolde" className="text-sm font-medium text-gray-700">
              Mettre en solde
            </label>
          </div>
          
          {formData.enSolde && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pourcentage de réduction</label>
              <input
                type="number"
                value={formData.pourcentageSolde}
                onChange={(e) => setFormData({ ...formData, pourcentageSolde: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={loading}
                min="0"
                max="100"
                step="0.1"
                placeholder="Ex: 15.5"
              />
            </div>
          )}
          
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {vehicle ? 'Modifier' : 'Créer'} le véhicule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard