import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  FaFilter, FaSort, FaThLarge, FaList, FaSearch, FaTimes, 
  FaArrowLeft, FaArrowRight, FaPlay, FaPause, FaImage, 
  FaTag, FaStar, FaBolt, FaPercent, FaNewspaper, FaFire 
} from 'react-icons/fa'
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
    keywords: searchParams.get('keywords') || '',
    brand: '',
    energie: '',
    status: ''
  })
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keywords') || '')
  const [searchOperator, setSearchOperator] = useState('AND')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const [vehiclesPerRow, setVehiclesPerRow] = useState(3)
  const scrollContainerRef = useRef(null)
  
  // Calcul dynamique des items par page
  const getItemsPerPage = () => {
    if (viewMode === 'list') return 6
    return vehiclesPerRow === 1 ? 4 : 9
  }
  
  const itemsPerPage = getItemsPerPage()

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
      toast.success(`${vehicle.nom || vehicle.name} ajouté au panier !`)
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier')
    }
  }

  // Effet de défilement automatique
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
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoScrolling, scrollPosition, filteredVehicles.length])

  useEffect(() => {
    fetchVehicles()
  }, [searchParams, vehiclesPerRow])

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
      const searchableText = `${vehicle.nom || vehicle.name} ${vehicle.marque || vehicle.brand} ${vehicle.typeVehicule || vehicle.type} ${vehicle.energie || vehicle.fuel} ${vehicle.descriptionComplete || ''}`.toLowerCase()
      
      if (searchOperator === 'AND') {
        return keywords.every(keyword => searchableText.includes(keyword))
      } else {
        return keywords.some(keyword => searchableText.includes(keyword))
      }
    })
  }

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      
      let vehiclesData = []
      
      // Utiliser le bon service selon le mode d'affichage
      if (vehiclesPerRow === 1) {
        // Mode une ligne - récupère les véhicules décorés
        console.log('📱 Mode une ligne: chargement des véhicules décorés')
        vehiclesData = await vehiculesService.getCatalogueUneLigne()
      } else {
        // Mode trois lignes - récupère les DTO complets
        console.log('💻 Mode trois lignes: chargement des DTO complets')
        vehiclesData = await vehiculesService.getCatalogueTroisLignes()
      }

      // Formater les véhicules pour le frontend
      const formattedVehicles = vehiclesData.map(vehicle => {
        // Fonction pour récupérer l'URL de l'image principale
        const getMainImageUrl = (vehicle) => {
          if (vehicle.imageUrl) return vehicle.imageUrl
          if (vehicle.images && vehicle.images.length > 0) {
            const mainImage = vehicle.images.find(img => img.isMain) || vehicle.images[0]
            return mainImage.fileUrl || mainImage.url || vehicle.imageUrl
          }
          return "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop"
        }

        // Fonction pour récupérer les URLs d'images
        const getAllImageUrls = (vehicle) => {
          if (vehicle.images && vehicle.images.length > 0) {
            return vehicle.images.map(img => img.fileUrl || img.url)
          }
          return [getMainImageUrl(vehicle)]
        }

        const mainImageUrl = getMainImageUrl(vehicle)
        const allImages = getAllImageUrls(vehicle)
        
        // Déterminer le badge selon les décorateurs
        let badge = null
        if (vehicle.nouveau) badge = "Nouveau"
        else if (vehicle.enSolde) badge = "Solde"
        else if (vehicle.populaire) badge = "Populaire"
        else if (vehicle.electrique) badge = "Électrique"
        
        // Déterminer le type d'animation
        const animationType = vehicle.electrique ? "electric" : 
                             vehicle.typeVehicule === 'SCOOTER' ? "scooter" : "gas"
        
        return {
          // ID et identifiants
          id: vehicle.id,
          
          // Nom et marque
          name: vehicle.nom || vehicle.name || `${vehicle.marque} ${vehicle.modele}`,
          nom: vehicle.nom || vehicle.name || `${vehicle.marque} ${vehicle.modele}`,
          brand: vehicle.marque || vehicle.brand,
          marque: vehicle.marque || vehicle.brand,
          modele: vehicle.modele,
          
          // Type et caractéristiques
          type: vehicle.typeVehicule || vehicle.type,
          typeVehicule: vehicle.typeVehicule || vehicle.type,
          typeCarburant: vehicle.energie || vehicle.fuel,
          energie: vehicle.energie || vehicle.fuel,
          
          // Prix et promotions
          price: vehicle.prixFinal || vehicle.price || vehicle.prix,
          prix: vehicle.prixFinal || vehicle.price || vehicle.prix,
          prixBase: vehicle.prixBase,
          prixFinal: vehicle.prixFinal,
          oldPrice: vehicle.prixBase && vehicle.prixFinal && vehicle.prixBase > vehicle.prixFinal 
                    ? vehicle.prixBase 
                    : null,
          enSolde: vehicle.enSolde || false,
          pourcentageSolde: vehicle.pourcentageSolde,
          
          // Décorateurs
          nouveau: vehicle.nouveau || false,
          populaire: vehicle.populaire || false,
          electrique: vehicle.electrique || false,
          avecOptions: vehicle.avecOptions || false,
          
          // Images
          image: mainImageUrl,
          imageUrl: mainImageUrl,
          images: vehicle.images || [],
          allImages: allImages,
          
          // Caractéristiques supplémentaires
          features: vehicle.options?.map(opt => opt.nom) || vehicle.features || [],
          options: vehicle.options || [],
          rating: 4.5,
          location: "Douala",
          fuel: vehicle.energie || vehicle.fuel,
          transmission: "Automatique",
          km: vehicle.kilometrage || 0,
          kilometrage: vehicle.kilometrage || 0,
          annee: vehicle.annee || new Date().getFullYear() - 2,
          
          // Badge et statut
          badge: badge,
          clearance: vehicle.enSolde || false,
          promo: vehicle.enSolde || false,
          quantite: 1,
          
          // Pour les animations
          hasAnimation: true,
          animationType: animationType,
          
          // Description décorée
          descriptionComplete: vehicle.descriptionComplete || '',
          shortDescription: vehicle.descriptionComplete 
            ? vehicle.descriptionComplete.substring(0, 100) + '...' 
            : `${vehicle.marque} ${vehicle.modele} - ${vehicle.typeVehicule}`
        }
      })

      console.log('✅ Véhicules formatés:', formattedVehicles.map(v => ({ 
        id: v.id, 
        name: v.name, 
        type: v.typeVehicule,
        enSolde: v.enSolde,
        nouveau: v.nouveau,
        image: v.image 
      })))

      setVehicles(formattedVehicles)
      setFilteredVehicles(formattedVehicles)

    } catch (error) {
      console.error('❌ Erreur lors du chargement des véhicules:', error)
      toast.error('Erreur lors du chargement des véhicules')
      setVehicles([])
      setFilteredVehicles([])
    } finally {
      setLoading(false)
    }
  }

  // Fonction de filtrage
  const applyFilters = (vehiclesList) => {
    let result = [...vehiclesList]

    // Appliquer les filtres de base
    if (filters.type) {
      const filterType = filters.type.toLowerCase()
      result = result.filter(v => {
        const vehicleType = (v.typeVehicule || v.type || '').toLowerCase()
        return vehicleType.includes(filterType)
      })
    }
    
    if (filters.price) {
      const maxPrice = parseInt(filters.price)
      result = result.filter(v => (v.prix || v.price) <= maxPrice)
    }
    
    if (filters.brand) {
      const filterBrand = filters.brand.toLowerCase()
      result = result.filter(v => {
        const vehicleBrand = (v.brand || v.marque || '').toLowerCase()
        return vehicleBrand.includes(filterBrand)
      })
    }
    
    if (filters.energie) {
      const filterEnergie = filters.energie.toLowerCase()
      result = result.filter(v => {
        const vehicleEnergie = (v.typeCarburant || v.energie || v.fuel || '').toLowerCase()
        return vehicleEnergie.includes(filterEnergie)
      })
    }
    
    if (filters.status) {
      if (filters.status === 'nouveau') {
        result = result.filter(v => v.nouveau)
      } else if (filters.status === 'solde') {
        result = result.filter(v => v.enSolde)
      } else if (filters.status === 'populaire') {
        result = result.filter(v => v.populaire)
      } else if (filters.status === 'electrique') {
        result = result.filter(v => v.electrique)
      }
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
      setCurrentPage(1)
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
      keywords: '',
      brand: '',
      energie: '',
      status: ''
    }
    setFilters(newFilters)
    setSearchQuery('')
    setSearchParams({})
    setFilteredVehicles(vehicles)
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
    if (vehiclesPerRow === 1) return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-1'
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  }

  // Fonction pour obtenir le texte de badge
  const getBadgeText = (vehicle) => {
    if (vehicle.nouveau) return { text: "Nouveau", icon: <FaNewspaper />, color: 'bg-blue-500' }
    if (vehicle.enSolde) return { text: `-${vehicle.pourcentageSolde || 10}%`, icon: <FaPercent />, color: 'bg-red-500' }
    if (vehicle.populaire) return { text: "Populaire", icon: <FaFire />, color: 'bg-orange-500' }
    if (vehicle.electrique) return { text: "Électrique", icon: <FaBolt />, color: 'bg-green-500' }
    return null
  }

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    if (!price) return '0 FCFA'
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Pattern africain en haut */}
      <div className="absolute top-10 left-0 w-full h-14 md:h-26 lg:h-24 bg-repeat-x pointer-events-none" 
           style={{ backgroundImage: 'url(/african-pattern-border.png)', backgroundSize: 'auto 80px' }}></div>

      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header avec effet visuel */}
        <div className="text-center mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-orange-600 to-blue-800 p-8 text-white shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-pulse">
             Catalogue Véhicules
          </h1>
          <p className="text-xl opacity-90">
            Découvrez notre sélection de {filteredVehicles.length} véhicules disponibles
            {vehiclesPerRow === 1 ? ' (affichage une ligne)' : ' (affichage trois lignes)'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">🆕 Nouveautés</span>
            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">⭐ En promotion</span>
            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">🔥 Populaires</span>
            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">⚡ Électriques</span>
          </div>
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
                placeholder="Rechercher par marque, modèle, type (ex: 'Toyota SUV électrique')"
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
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
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
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-medium hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl"
              >
                <FaFilter />
                Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
              
              <select 
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                onChange={(e) => handleFilterChange('status', e.target.value)}
                value={filters.status || ''}
              >
                <option value="">Tous les statuts</option>
                <option value="nouveau">Nouveautés</option>
                <option value="solde">En solde</option>
                <option value="populaire">Populaires</option>
                <option value="electrique">Électriques</option>
              </select>

              {/* Bouton pour changer le nombre de véhicules par ligne */}
              {viewMode === 'grid' && (
                <button
                  onClick={toggleVehiclesPerRow}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm hover:bg-gray-50"
                  title={vehiclesPerRow === 3 ? 'Passer à 1 véhicule par ligne' : 'Passer à 3 véhicules par ligne'}
                >
                  {vehiclesPerRow === 3 ? (
                    <> 3 par ligne</>
                  ) : (
                    <> 1 par ligne</>
                  )}
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-lg font-medium text-gray-700">
                {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} trouvé{filteredVehicles.length > 1 ? 's' : ''}
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-white shadow-lg scale-105 text-orange-600' : 'hover:bg-gray-200 text-gray-600'}`}
                  title="Vue grille"
                >
                  <FaThLarge className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">Grille</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white shadow-lg scale-105 text-orange-600' : 'hover:bg-gray-200 text-gray-600'}`}
                  title="Vue liste"
                >
                  <FaList className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">Liste</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel avec animation */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 animate-slide-down">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaFilter /> Filtres avancés
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  <FaTimes /> Tout effacer
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de véhicule
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Tous types</option>
                    <option value="automobile">Automobile</option>
                    <option value="scooter">Scooter</option>
                    <option value="suv">SUV</option>
                    <option value="citadine">Citadine</option>
                    <option value="berline">Berline</option>
                    <option value="utilitaire">Utilitaire</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix maximum (FCFA)
                  </label>
                  <input
                    type="number"
                    value={filters.price}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
                    placeholder="Ex: 10000000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marque
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Toutes marques</option>
                    <option value="toyota">Toyota</option>
                    <option value="peugeot">Peugeot</option>
                    <option value="renault">Renault</option>
                    <option value="bmw">BMW</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Énergie
                  </label>
                  <select
                    value={filters.energie}
                    onChange={(e) => handleFilterChange('energie', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Toutes énergies</option>
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

        {/* Carrousel de véhicules en vedette */}
        {!loading && filteredVehicles.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaStar className="text-orange-500" /> Véhicules en vedette
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all"
                >
                  {isAutoScrolling ? <FaPause /> : <FaPlay />}
                  {isAutoScrolling ? 'Pause' : 'Lecture auto'}
                </button>
                <button 
                  onClick={() => setScrollPosition(prev => Math.max(0, prev - 300))}
                  className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all"
                >
                  <FaArrowLeft />
                </button>
                <button 
                  onClick={() => {
                    const maxScroll = scrollContainerRef.current?.scrollWidth - scrollContainerRef.current?.clientWidth || 0
                    setScrollPosition(prev => Math.min(maxScroll, prev + 300))
                  }}
                  className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all"
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
              {filteredVehicles
                .filter(v => v.enSolde || v.nouveau || v.populaire)
                .slice(0, 6)
                .map(vehicle => {
                  const badge = getBadgeText(vehicle)
                  
                  return (
                    <div key={vehicle.id} className="min-w-[320px] flex-shrink-0 relative">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                        {/* Animation du véhicule si disponible */}
                        {vehicle.hasAnimation && viewMode === 'grid' && (
                          <div className="absolute top-4 right-4 z-10">
                            <VehicleAnimation 
                              vehicle={vehicle}
                              type={vehicle.animationType}
                              isVisible={true}
                              compact={true}
                            />
                          </div>
                        )}
                        
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          {vehicle.image ? (
                            <img 
                              src={vehicle.image} 
                              alt={vehicle.nom}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop"
                                e.target.className = "w-full h-full object-cover"
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                              <FaImage className="text-gray-400 text-5xl mb-2" />
                              <span className="text-gray-500">Image en chargement...</span>
                            </div>
                          )}
                          
                          {badge && (
                            <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color} text-white flex items-center gap-1 shadow-md`}>
                                {badge.icon}
                                {badge.text}
                              </span>
                            </div>
                          )}
                          
                          {/* Overlay d'options */}
                          {vehicle.avecOptions && (
                            <div className="absolute bottom-4 right-4">
                              <span className="px-2 py-1 bg-gray-900 bg-opacity-70 text-white text-xs rounded-full">
                                ⚙️ Options
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-5">
                          <h3 className="text-lg font-bold mb-2 text-gray-800">{vehicle.nom}</h3>
                          <div className="mb-3 text-sm text-gray-600 flex flex-wrap gap-1">
                            <span className="px-2 py-1 bg-gray-100 rounded">{vehicle.marque}</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">{vehicle.typeVehicule}</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">{vehicle.energie}</span>
                            {vehicle.annee && (
                              <span className="px-2 py-1 bg-gray-100 rounded">{vehicle.annee}</span>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-2xl font-bold text-orange-500">
                                {formatPrice(vehicle.prix)}
                              </span>
                              {vehicle.oldPrice && vehicle.oldPrice > vehicle.prix && (
                                <div className="text-sm text-gray-400 line-through">
                                  {formatPrice(vehicle.oldPrice)}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Link 
                                to={`/vehicule/${vehicle.id}`}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all text-sm"
                              >
                                Détails
                              </Link>
                              <button
                                onClick={() => handleAddToCart(vehicle)}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all text-sm"
                              >
                                Panier
                              </button>
                            </div>
                          </div>
                          
                          {/* Description décorée (truncated) */}
                          {vehicle.descriptionComplete && (
                            <div className="mt-3 text-xs text-gray-500 italic border-t border-gray-100 pt-3">
                              {vehicle.descriptionComplete.substring(0, 80)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Grille principale des véhicules */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500 mb-6"></div>
            <p className="text-gray-600 text-lg">Chargement des véhicules...</p>
            <p className="text-gray-500 text-sm mt-2">
              {vehiclesPerRow === 1 ? 'Mode une ligne (décorateurs activés)' : 'Mode trois lignes (affichage détaillé)'}
            </p>
          </div>
        ) : (
          <>
            <div className={`grid ${gridColsClass()} gap-6 mb-12`}>
              {currentVehicles.length > 0 ? (
                currentVehicles.map((vehicle) => {
                  const badge = getBadgeText(vehicle)
                  
                  return (
                    <div key={vehicle.id} className="animate-fade-in">
                      <div className="relative h-full">
                        <VehicleCard
                          vehicle={{
                            ...vehicle,
                            // Formatage compatible
                            image: vehicle.image || vehicle.imageUrl,
                            imageUrl: vehicle.image || vehicle.imageUrl,
                            brand: vehicle.brand || vehicle.marque,
                            type: vehicle.type || vehicle.typeVehicule,
                            price: vehicle.price || vehicle.prix,
                            name: vehicle.name || vehicle.nom,
                            // Badge
                            badge: badge?.text || null,
                            badgeColor: badge?.color,
                            badgeIcon: badge?.icon,
                            // Description
                            description: vehicle.shortDescription,
                            // Options
                            features: vehicle.features || vehicle.options?.map(opt => opt.nom) || []
                          }}
                          layout={viewMode}
                          onViewDetails={() => window.location.href = `/vehicule/${vehicle.id}`}
                          onAddToCart={() => handleAddToCart(vehicle)}
                          compact={vehiclesPerRow === 1}
                        />
                        
                        {/* Indicateur de mode d'affichage */}
                        {viewMode === 'grid' && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className={`text-xs px-2 py-1 rounded-full ${vehiclesPerRow === 1 ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}`}>
                              {vehiclesPerRow === 1 ? '1 ligne' : '3 lignes'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-16">
                  <FaSearch className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Aucun véhicule trouvé</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Aucun véhicule ne correspond à vos critères de recherche.
                    {vehiclesPerRow === 1 ? ' Essayez en mode "3 par ligne" pour plus de résultats.' : ''}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={clearFilters}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Réinitialiser les filtres
                    </button>
                    <button
                      onClick={toggleVehiclesPerRow}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                      {vehiclesPerRow === 3 ? 'Passer à 1 par ligne' : 'Passer à 3 par ligne'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-8 border-t border-gray-200">
                <div className="text-gray-600">
                  Page {currentPage} sur {totalPages} • {filteredVehicles.length} véhicules
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <FaArrowLeft /> Précédent
                  </button>
                  
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1
                      // Afficher seulement les pages proches de la page courante
                      if (
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={i} className="px-2 text-gray-400">...</span>
                      }
                      return null
                    })}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Suivant <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Section informations
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border border-blue-100">
          <h3 className="text-xl font-bold mb-4 text-gray-800">ℹ️ À propos de l'affichage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">Mode "1 par ligne"</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Utilise le pattern <strong>Decorator</strong> pour enrichir l'affichage</li>
                <li>• Affiche les badges: 🆕 NEUF, ⭐ PROMOTION, 🔥 POPULAIRE</li>
                <li>• Texte unique généré dynamiquement</li>
                <li>• Optimisé pour mobile</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-orange-600">Mode "3 par ligne"</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Utilise les DTO complets du backend</li>
                <li>• Affichage détaillé avec toutes les informations</li>
                <li>• Images haute résolution</li>
                <li>• Optimisé pour desktop</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Catalog