import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaFilter, FaSort, FaThLarge, FaList, FaSearch, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import VehicleCard from '../components/ui/VehiculeCard'

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    price: searchParams.get('price') || '',
    km: searchParams.get('km') || '',
    keywords: searchParams.get('keywords') || '',
    brand: '',
    year: '',
    fuel: '',
    transmission: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef(null)
  const itemsPerPage = viewMode === 'grid' ? 9 : 6

  // Effet de défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current && vehicles.length > 0) {
        const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
        if (scrollPosition >= maxScroll) {
          setScrollPosition(0)
        } else {
          setScrollPosition(prev => prev + 1)
        }
      }
    }, 30)

    return () => clearInterval(interval)
  }, [scrollPosition, vehicles.length])

  useEffect(() => {
    fetchVehicles()
  }, [searchParams])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPosition
    }
  }, [scrollPosition])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      // Données améliorées selon maquette
      const mockVehicles = [
        {
          id: 1,
          name: "Tesla Model 3",
          brand: "Tesla",
          type: "Électrique | Berline",
          year: 2023,
          price: 35000,
          oldPrice: null,
          clearance: false,
          image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop",
          features: ["Autopilot", "GPS", "Toit ouvrant"],
          rating: 4.9,
          location: "Douala",
          fuel: "Électrique",
          transmission: "Automatique",
          km: 0,
          promo: true,
          badge: "Nouveau"
        },
        {
          id: 2,
          name: "Toyota RAV4",
          brand: "Toyota",
          type: "SUV",
          year: 2023,
          price: 28000,
          oldPrice: 30000,
          clearance: true,
          image: "https://images.unsplash.com/photo-1566470001488-7ce4a5c64d9f?w=600&h=400&fit=crop",
          features: ["4x4", "Toit panoramique", "Caméra recul"],
          rating: 4.8,
          location: "Douala",
          fuel: "Diesel",
          transmission: "Automatique",
          km: 15000,
          badge: "Clearance"
        },
        {
          id: 3,
          name: "Renault Clio",
          brand: "Renault",
          type: "Citadine",
          year: 2022,
          price: 16500,
          oldPrice: null,
          clearance: false,
          image: "https://images.unsplash.com/photo-1563720360172-0f29dba0d8d5?w=600&h=400&fit=crop",
          features: ["Climatisation", "4 Zones", "GPS"],
          rating: 4.5,
          location: "Yaoundé",
          fuel: "Essence",
          transmission: "Manuelle",
          km: 25000
        },
        {
          id: 4,
          name: "Yamaha Scooter",
          brand: "Yamaha",
          type: "Scooter",
          year: 2023,
          price: 3500,
          oldPrice: null,
          clearance: false,
          image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=400&fit=crop",
          features: ["125cc", "Automatique", "City Smart"],
          rating: 4.7,
          location: "Douala",
          fuel: "Essence",
          transmission: "Automatique",
          km: 5000,
          promo: true,
          badge: "Promo"
        },
        {
          id: 5,
          name: "Ford Transit",
          brand: "Ford",
          type: "Utilitaire",
          year: 2021,
          price: 25000,
          oldPrice: 28000,
          clearance: true,
          image: "https://images.unsplash.com/photo-1632855413417-5d2e4b59b65c?w=600&h=400&fit=crop",
          features: ["Diesel", "Cargo 9h", "Grand volume"],
          rating: 4.6,
          location: "Bafoussam",
          fuel: "Diesel",
          transmission: "Manuelle",
          km: 45000,
          badge: "Clearance"
        },
        {
          id: 6,
          name: "Peugeot 208",
          brand: "Peugeot",
          type: "Citadine",
          year: 2022,
          price: 19500,
          oldPrice: 21000,
          clearance: false,
          image: "https://images.unsplash.com/photo-1603551662495-0d0d5676cd6d?w=600&h=400&fit=crop",
          features: ["Connecté", "Caméra recul", "Climatisation"],
          rating: 4.4,
          location: "Douala",
          fuel: "Essence",
          transmission: "Automatique",
          km: 18000
        },
        {
          id: 7,
          name: "Mercedes Classe A",
          brand: "Mercedes",
          type: "Berline",
          year: 2023,
          price: 42000,
          oldPrice: null,
          clearance: false,
          image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
          features: ["Premium", "Assistance conduite", "Sièges cuir"],
          rating: 4.9,
          location: "Yaoundé",
          fuel: "Diesel",
          transmission: "Automatique",
          km: 10000,
          badge: "Luxe"
        },
        {
          id: 8,
          name: "Honda CR-V",
          brand: "Honda",
          type: "SUV",
          year: 2022,
          price: 32000,
          oldPrice: 35000,
          clearance: true,
          image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop",
          features: ["Hybride", "4x4", "Toit panoramique"],
          rating: 4.7,
          location: "Douala",
          fuel: "Hybride",
          transmission: "Automatique",
          km: 20000,
          badge: "Clearance"
        },
        {
          id: 9,
          name: "BMW Série 3",
          brand: "BMW",
          type: "Berline",
          year: 2023,
          price: 45000,
          oldPrice: null,
          clearance: false,
          image: "https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=600&h=400&fit=crop",
          features: ["Sport", "iDrive", "Sièges chauffants"],
          rating: 4.8,
          location: "Yaoundé",
          fuel: "Essence",
          transmission: "Automatique",
          km: 5000,
          badge: "Sport"
        }
      ]

      // Appliquer les filtres
      let filtered = mockVehicles
      
      if (filters.type) {
        filtered = filtered.filter(v => v.type.toLowerCase().includes(filters.type.toLowerCase()))
      }
      
      if (filters.price) {
        const maxPrice = parseInt(filters.price)
        filtered = filtered.filter(v => v.price <= maxPrice)
      }
      
      if (filters.km) {
        const maxKm = parseInt(filters.km)
        filtered = filtered.filter(v => v.km <= maxKm)
      }
      
      setVehicles(filtered)
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      price: '',
      km: '',
      keywords: '',
      brand: '',
      year: '',
      fuel: '',
      transmission: ''
    })
    setSearchParams({})
  }

  const activeFiltersCount = Object.values(filters).filter(v => v).length

  // Pagination
  const totalPages = Math.ceil(vehicles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVehicles = vehicles.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pattern africain en haut */}
      <div className="absolute top-10 left-0 w-full
               h-14 md:h-26  lg:h-24
               bg-repeat-x pointer-events-none" style={{
        backgroundImage: 'url(/african-pattern-border.png)',
        backgroundSize: 'auto 80px'
      }}></div>

      <div className="container mx-auto px-4 py-8">
        {/* Header avec effet visuel */}
        <div className="text-center mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-orange-800 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-pulse">
            Catalogue Véhicules
          </h1>
          <p className="text-xl opacity-90">
            Découvrez notre sélection de {vehicles.length} véhicules disponibles
          </p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500 opacity-20 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Controls avec effets */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-700 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
              >
                <FaFilter />
                Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
              
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm">
                <option>Trier par : Pertinence</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Année récente</option>
                <option>Kilométrage faible</option>
              </select>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-lg font-medium text-gray-700">
                {vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''}
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-lg scale-105' : 'hover:bg-gray-200'}`}
                >
                  <FaThLarge className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-lg scale-105' : 'hover:bg-gray-200'}`}
                >
                  <FaList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel avec animation */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-slide-down">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filtres avancés</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Tout effacer
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filtres comme avant mais avec meilleur design */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Tous types</option>
                    <option value="suv">SUV</option>
                    <option value="citadine">Citadine</option>
                    <option value="berline">Berline</option>
                    <option value="utilitaire">Utilitaire</option>
                    <option value="scooter">Scooter</option>
                  </select>
                </div>
                
                {/* ... autres filtres similaires ... */}
              </div>
            </div>
          )}
        </div>

        {/* Carrousel de véhicules en vedette */}
        {!loading && vehicles.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Véhicules en vedette</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setScrollPosition(prev => Math.max(0, prev - 300))}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <FaArrowLeft />
                </button>
                <button 
                  onClick={() => {
                    const maxScroll = scrollContainerRef.current?.scrollWidth - scrollContainerRef.current?.clientWidth || 0
                    setScrollPosition(prev => Math.min(maxScroll, prev + 300))
                  }}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {vehicles.slice(0, 5).map(vehicle => (
                <div key={vehicle.id} className="min-w-[300px] flex-shrink-0">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                      {vehicle.badge && (
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            vehicle.badge === 'Clearance' ? 'bg-red-500 text-white' :
                            vehicle.badge === 'Promo' ? 'bg-green-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {vehicle.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2">{vehicle.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-orange-500">
                          {vehicle.price.toLocaleString()} €
                        </span>
                        <Link 
                          to={`/vehicule/${vehicle.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Voir détails →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grille principale des véhicules */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            } gap-6 mb-12`}>
              {currentVehicles.length > 0 ? (
                currentVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="animate-fade-in">
                    <VehicleCard 
                      vehicle={vehicle} 
                      layout={viewMode}
                      onViewDetails={() => window.location.href = `/vehicule/${vehicle.id}`}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <FaSearch className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Aucun véhicule trouvé</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Aucun véhicule ne correspond à vos critères de recherche.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Voir tous les véhicules
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Précédent
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-orange-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      
    </div>
  )
}

export default Catalog