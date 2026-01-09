import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompany } from '../context/CompagnyContext'
import { 
  FaBuilding, FaCar, FaChartLine, FaUsers, FaMoneyBillWave, 
  FaClipboardList, FaPlus, FaDownload, FaFilter, FaCalendar 
} from 'react-icons/fa'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

const FleetDashboard = () => {
  const { 
    company, 
    subsidiaries, 
    fleetOrders, 
    calculateFleetStatistics,
    getFleetOverview,
    loading 
  } = useCompany()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('month')
  
  useEffect(() => {
    if (!company) {
      navigate('/achat-flotte')
    }
  }, [company, navigate])

  if (loading) {
    return (
      <div className="section bg-white">
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  const stats = calculateFleetStatistics()
  const overview = getFleetOverview()

  // Charts data
  const subsidiaryChartData = {
    labels: overview.map(s => s.name),
    datasets: [
      {
        label: 'Véhicules',
        data: overview.map(s => s.vehicles),
        backgroundColor: '#F97316',
        borderRadius: 8
      }
    ]
  }

  const ordersChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Commandes',
        data: [3, 5, 2, 4, 6, 3],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true
      }
    ]
  }

  const spendingChartData = {
    labels: ['Véhicules', 'Maintenance', 'Assurance', 'Carburant'],
    datasets: [
      {
        data: [65, 15, 10, 10],
        backgroundColor: [
          '#F97316',
          '#2563EB',
          '#10B981',
          '#8B5CF6'
        ]
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  }

  return (
    <div className="section bg-white">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaBuilding className="w-8 h-8 text-primary-orange" />
                <h1 className="text-3xl font-bold">Dashboard Flotte</h1>
              </div>
              <p className="text-primary-gray">
                Gestion complète de votre flotte d'entreprise
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="btn bg-gray-100 text-primary-dark hover:bg-gray-200">
                <FaFilter className="mr-2" />
                Filtres
              </button>
              <button className="btn btn-primary">
                <FaPlus className="mr-2" />
                Nouvelle commande
              </button>
            </div>
          </div>

          {/* Company Info */}
          <div className="card mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{company?.name}</h2>
                  <div className="space-y-2">
                    <p className="text-primary-gray">{company?.address}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-primary-gray">Contact: {company?.contactPerson}</span>
                      <span className="text-primary-gray">Tél: {company?.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary-light p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary-orange">
                    Budget: {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(company?.monthlyBudget || 0)}/mois
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'orders', 'subsidiaries', 'analytics', 'documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-orange text-primary-orange'
                    : 'border-transparent text-primary-gray hover:text-primary-dark'
                }`}
              >
                {tab === 'overview' && 'Vue générale'}
                {tab === 'orders' && 'Commandes'}
                {tab === 'subsidiaries' && 'Filiales'}
                {tab === 'analytics' && 'Analytiques'}
                {tab === 'documents' && 'Documents'}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaCar className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold">{stats.totalVehicles}</span>
              </div>
              <h3 className="font-bold mb-2">Véhicules en flotte</h3>
              <p className="text-sm text-primary-gray">Total de véhicules actifs</p>
            </div>
          </div>
          
          <div className="card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaClipboardList className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold">{stats.totalOrders}</span>
              </div>
              <h3 className="font-bold mb-2">Commandes totales</h3>
              <p className="text-sm text-primary-gray">{stats.pendingOrders} en attente</p>
            </div>
          </div>
          
          <div className="card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaMoneyBillWave className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    notation: 'compact'
                  }).format(stats.totalSpent)}
                </span>
              </div>
              <h3 className="font-bold mb-2">Dépenses totales</h3>
              <p className="text-sm text-primary-gray">Budget utilisé</p>
            </div>
          </div>
          
          <div className="card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaChartLine className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(stats.averageOrderValue)}
                </span>
              </div>
              <h3 className="font-bold mb-2">Panier moyen</h3>
              <p className="text-sm text-primary-gray">Par commande</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <div className="card mb-8">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Activité récente</h3>
                    <select 
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="form-select w-40"
                    >
                      <option value="week">Cette semaine</option>
                      <option value="month">Ce mois</option>
                      <option value="quarter">Ce trimestre</option>
                      <option value="year">Cette année</option>
                    </select>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-64">
                    <Line data={ordersChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold">Commandes récentes</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-primary-gray uppercase tracking-wider">
                            N° Commande
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-primary-gray uppercase tracking-wider">
                            Filiale
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-primary-gray uppercase tracking-wider">
                            Montant
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-primary-gray uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-scale: {
      categoryScale: {
        type: 'category' as const,
        position: 'bottom' as const,
      }
    }xs font-medium text-primary-gray uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {fleetOrders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="font-medium">{order.orderNumber}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {order.subsidiary_name}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(order.total)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'livrée' ? 'bg-green-100 text-green-800' :
                                order.status === 'en cours' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {new Date(order.date).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div className="card mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold">Répartition par filiale</h3>
                </div>
                <div className="p-6">
                  <div className="h-64">
                    <Bar data={subsidiaryChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold">Répartition des dépenses</h3>
                </div>
                <div className="p-6">
                  <div className="h-64">
                    <Pie data={spendingChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subsidiaries' && (
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Gestion des filiales</h3>
                <button className="btn btn-primary">
                  <FaPlus className="mr-2" />
                  Ajouter une filiale
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subsidiaries.map(subsidiary => (
                  <div key={subsidiary.id} className="card">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold mb-2">{subsidiary.name}</h4>
                          <p className="text-primary-gray">{subsidiary.location}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaBuilding className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-primary-gray">Véhicules</span>
                          <span className="font-bold">{subsidiary.vehicles}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-primary-gray">Manager</span>
                          <span>{subsidiary.manager}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-primary-gray">Téléphone</span>
                          <span>{subsidiary.phone}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 btn bg-gray-100 text-primary-dark hover:bg-gray-200">
                          Voir détails
                        </button>
                        <button className="flex-1 btn btn-outline">
                          Commandes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="card p-6 text-left hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaDownload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Documents</h4>
                <p className="text-sm text-primary-gray">
                  Téléchargez vos factures et contrats
                </p>
              </div>
            </div>
          </button>
          
          <button className="card p-6 text-left hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCalendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Maintenance</h4>
                <p className="text-sm text-primary-gray">
                  Planifiez l'entretien de votre flotte
                </p>
              </div>
            </div>
          </button>
          
          <button className="card p-6 text-left hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FaUsers className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Support</h4>
                <p className="text-sm text-primary-gray">
                  Contactez votre gestionnaire dédié
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FleetDashboard