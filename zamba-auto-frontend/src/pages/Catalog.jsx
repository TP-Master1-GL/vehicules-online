import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaFilter, FaSort, FaThLarge, FaList, FaSearch, FaTimes, FaArrowLeft, FaArrowRight, FaPlay, FaPause } from 'react-icons/fa'
import VehicleCard from '../components/ui/VehiculeCard'
import VehicleAnimation from '../components/ui/VehicleAnimation'
import vehiculesService from '../api/vehicules'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  // Context hooks
  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
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
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keywords') || '')
  const [searchOperator, setSearchOperator] = useState('AND') // AND ou OR
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [vehiclesPerRow, setVehiclesPerRow] = useState(3) // 1 ou 3 véhicules par ligne
  const scrollContainerRef = useRef(null)
  const itemsPerPage = viewMode === 'grid' ? vehiclesPerRow * 3 : 6 // Adapte selon le mode

  // Observer pour les animations de véhicules
  const [animationObservers] = useState([])

  // Toggle le nombre de véhicules par ligne
  const toggleVehiclesPerRow = () => {
    setVehiclesPerRow(vehiclesPerRow === 3 ? 1 : 3)
  }

  // Gestionnaire pour ajouter au panier
  const handleAddToCart = async (vehicle) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter au panier')
      return
    }

    try {
      await addToCart(vehicle)
      toast.success(`${vehicle.name} ajouté au panier !`)
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier')
    }
  }

  // Effet de défilement automatique (avec Observer pattern)
  useEffect(() => {
    let interval
    if (isAutoScrolling && scrollContainerRef.current && filteredVehicles.length > 0) {
      interval = setInterval(() => {
        setScrollPosition(prev => {
          const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
          if (prev >= maxScroll) {
            return 0
          }
          return prev + 1
        })
      }, 30)
      
      // Notifier les observateurs (pour animations)
      animationObservers.forEach(observer => observer.onScroll(scrollPosition))
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoScrolling, scrollPosition, filteredVehicles.length, animationObservers])

  useEffect(() => {
    fetchVehicles()
  }, [searchParams])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPosition
    }
  }, [scrollPosition])

  // Recherche avancée avec opérateurs logiques
  const applyAdvancedSearch = (vehiclesArray) => {
    if (!searchQuery.trim()) return vehiclesArray
    
    const keywords = searchQuery.toLowerCase().split(' ')
    
    return vehiclesArray.filter(vehicle => {
      const searchableText = `${vehicle.name} ${vehicle.brand} ${vehicle.type} ${vehicle.fuel} ${vehicle.features?.join(' ')}`.toLowerCase()
      
      if (searchOperator === 'AND') {
        // Tous les mots doivent être présents
        return keywords.every(keyword => searchableText.includes(keyword))
      } else {
        // OR : au moins un mot doit être présent
        return keywords.some(keyword => searchableText.includes(keyword))
      }
    })
  }

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      // Utiliser le vrai service API selon le nombre de véhicules par ligne
      const vehiclesData = vehiclesPerRow === 1
        ? await vehiculesService.getCatalogueUneLigne()
        : await vehiculesService.getCatalogueTroisLignes()

      // Adapter le format du backend au format frontend
      const formattedVehicles = vehiclesData.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.nom,
        brand: vehicle.marque,
        type: `${vehicle.typeCarburant} | ${vehicle.typeVehicule}`,
        year: vehicle.annee,
        price: vehicle.prix,
        oldPrice: vehicle.prixPromotion || null,
        clearance: vehicle.enSoldes || false,
        image: vehicle.image || "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop",
        features: vehicle.options?.map(opt => opt.nom) || [],
        rating: 4.5, // Valeur par défaut
        location: vehicle.localisation || "Douala",
        fuel: vehicle.typeCarburant,
        transmission: vehicle.transmission || "Automatique",
        km: vehicle.kilometrage || 0,
        promo: vehicle.enPromotion || false,
        badge: vehicle.nouveau ? "Nouveau" : null,
        hasAnimation: true,
        animationType: vehicle.typeCarburant === "Électrique" ? "electric" : "gas"
      }))

      setVehicles(formattedVehicles)
      setFilteredVehicles(formattedVehicles)

    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error)
      // En cas d'erreur, utiliser des données par défaut vides
      setVehicles([])
      setFilteredVehicles([])
    } finally {
      setLoading(false)
    }
  }

  // Fonction de filtrage corrigée
  const applyFilters = (vehiclesList) => {
    let result = [...vehiclesList] // Utiliser un nom différent

    // Appliquer les filtres de base
    if (filters.type) {
      result = result.filter(v => v.type.toLowerCase().includes(filters.type.toLowerCase()))
    }
    
    if (filters.price) {
      const maxPrice = parseInt(filters.price)
      result = result.filter(v => v.price <= maxPrice)
    }
    
    if (filters.km) {
      const maxKm = parseInt(filters.km)
      result = result.filter(v => v.km <= maxKm)
    }
    
    if (filters.brand) {
      result = result.filter(v => v.brand.toLowerCase().includes(filters.brand.toLowerCase()))
    }
    
    if (filters.fuel) {
      result = result.filter(v => v.fuel.toLowerCase().includes(filters.fuel.toLowerCase()))
    }
    
    // Appliquer la recherche avancée
    result = applyAdvancedSearch(result)
    
    return result
  }

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    if (vehicles.length > 0) {
      const filtered = applyFilters(vehicles)
      setFilteredVehicles(filtered)
      setCurrentPage(1) // Retourner à la première page après filtrage
    }
  }, [filters, vehicles, searchQuery, searchOperator])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    setSearchParams(params)
  }

  const handleSearch = () => {
    handleFilterChange('keywords', searchQuery)
  }

  const clearFilters = () => {
    const newFilters = {
      type: '',
      price: '',
      km: '',
      keywords: '',
      brand: '',
      year: '',
      fuel: '',
      transmission: ''
    }
    setFilters(newFilters)
    setSearchQuery('')
    setSearchParams({})
    setFilteredVehicles(vehicles) // Réinitialiser aux véhicules d'origine
  }

  const activeFiltersCount = Object.values(filters).filter(v => v).length

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex)

  // Grille adaptative selon vehiclesPerRow
  const gridColsClass = () => {
    if (viewMode === 'list') return 'grid-cols-1'
    if (vehiclesPerRow === 1) return 'grid-cols-1'
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pattern africain en haut */}
      <div className="absolute top-10 left-0 w-full h-14 md:h-26 lg:h-24 bg-repeat-x pointer-events-none" 
           style={{ backgroundImage: 'url(/african-pattern-border.png)', backgroundSize: 'auto 80px' }}></div>

      <div className="container mx-auto px-4 py-8">
        {/* Header avec effet visuel */}
        <div className="text-center mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-orange-800 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-pulse">
            Catalogue Véhicules
          </h1>
          <p className="text-xl opacity-90">
            Découvrez notre sélection de {filteredVehicles.length} véhicules disponibles
          </p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500 opacity-20 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Barre de recherche avancée */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher par mots-clés (ex: 'SUV bleu automatique')"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <select
                value={searchOperator}
                onChange={(e) => setSearchOperator(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="AND">ET (tous les mots)</option>
                <option value="OR">OU (au moins un mot)</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <FaSearch />
                Rechercher
              </button>
            </div>
          </div>
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

              {/* Bouton pour changer le nombre de véhicules par ligne */}
              {viewMode === 'grid' && (
                <button
                  onClick={toggleVehiclesPerRow}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                >
                  {vehiclesPerRow === 3 ? '1 par ligne' : '3 par ligne'}
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-lg font-medium text-gray-700">
                {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''}
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
                    <option value="electrique">Électrique</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix maximum
                  </label>
                  <input
                    type="number"
                    value={filters.price}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
                    placeholder="Ex: 30000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilométrage max
                  </label>
                  <input
                    type="number"
                    value={filters.km}
                    onChange={(e) => handleFilterChange('km', e.target.value)}
                    placeholder="Ex: 50000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carburant
                  </label>
                  <select
                    value={filters.fuel}
                    onChange={(e) => handleFilterChange('fuel', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Tous</option>
                    <option value="essence">Essence</option>
                    <option value="diesel">Diesel</option>
                    <option value="electrique">Électrique</option>
                    <option value="hybride">Hybride</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Carrousel de véhicules en vedette avec contrôle d'animation */}
        {!loading && filteredVehicles.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Véhicules en vedette</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {isAutoScrolling ? <FaPause /> : <FaPlay />}
                  {isAutoScrolling ? 'Pause' : 'Lecture'}
                </button>
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
              {filteredVehicles.slice(0, 5).map(vehicle => (
                <div key={vehicle.id} className="min-w-[350px] flex-shrink-0 relative">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Animation du véhicule si disponible */}
                    {vehicle.hasAnimation && (
                      <VehicleAnimation 
                        vehicle={vehicle}
                        type={vehicle.animationType}
                        isVisible={true}
                      />
                    )}
                    
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

        {/* Grille principale des véhicules avec option 1 ou 3 par ligne */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            <div className={`grid ${gridColsClass()} gap-6 mb-12`}>
              {currentVehicles.length > 0 ? (
                currentVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="animate-fade-in">
                    {/* Wrapper pour les animations (Observer pattern) */}
                    <div className="relative">
                      <VehicleCard
                        vehicle={vehicle}
                        layout={viewMode}
                        onViewDetails={() => window.location.href = `/vehicule/${vehicle.id}`}
                        onAddToCart={() => handleAddToCart(vehicle)}
                      />
                      {/* Afficher l'animation en overlay si disponible */}
                      {vehicle.hasAnimation && viewMode === 'grid' && (
                        <div className="absolute top-2 right-2 z-10">
                          <button 
                            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                            onClick={() => {
                              // Lancer l'animation
                              console.log(`Lancer animation pour ${vehicle.name}`)
                            }}
                          >
                            <FaPlay size={14} />
                          </button>
                        </div>
                      )}
                    </div>
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