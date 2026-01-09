import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

const SearchBar = () => {
  const [searchParams, setSearchParams] = useState({
    type: '',
    price: '',
    km: ''
  })
  const navigate = useNavigate()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchParams.type) params.append('type', searchParams.type)
    if (searchParams.price) params.append('price', searchParams.price)
    if (searchParams.km) params.append('km', searchParams.km)
    
    navigate(`/catalogue?${params.toString()}`)
  }

  return (
    <section className="py-4 md:py-6 bg-gray-50">
      <div className="w-full px-4">
        <div className="w-full max-w-5xl mx-auto">
          {/* Titre minimaliste */}
          <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-3 text-center">
            Recherche
          </h3>
          
          {/* Grille compacte avec labels en haut */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="hidden md:grid md:grid-cols-4 md:divide-x md:divide-gray-200">
              {/* Colonne 1: Tous types */}
              <div className="p-3">
                <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Tous types
                </div>
                <select
                  value={searchParams.type}
                  onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choisir type</option>
                  <option value="suv">SUV</option>
                  <option value="citadine">Citadine</option>
                  <option value="berline">Berline</option>
                  <option value="utilitaire">Utilitaire</option>
                </select>
              </div>
              
              {/* Colonne 2: Tous prix */}
              <div className="p-3">
                <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Tous prix
                </div>
                <select
                  value={searchParams.price}
                  onChange={(e) => setSearchParams({...searchParams, price: e.target.value})}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choisir prix</option>
                  <option value="10000">-10 000€</option>
                  <option value="20000">-20 000€</option>
                  <option value="30000">-30 000€</option>
                </select>
              </div>
              
              {/* Colonne 3: Tous PEX */}
              <div className="p-3">
                <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Tous PEX
                </div>
                <select
                  value={searchParams.km}
                  onChange={(e) => setSearchParams({...searchParams, km: e.target.value})}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choisir km</option>
                  <option value="50000">-50k km</option>
                  <option value="100000">-100k km</option>
                  <option value="150000">+100k km</option>
                </select>
              </div>
              
              {/* Colonne 4: Bouton */}
              <div className="p-3 flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded text-sm flex items-center justify-center gap-2"
                >
                  <FaSearch className="w-3.5 h-3.5" />
                  Rechercher
                </button>
              </div>
            </div>

            {/* Version mobile verticale */}
            <div className="md:hidden">
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Tous types
                  </div>
                  <select className="w-full p-2 text-sm border border-gray-300 rounded">
                    <option>Choisir type</option>
                    <option>SUV</option>
                    <option>Citadine</option>
                    <option>Berline</option>
                  </select>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Tous prix
                  </div>
                  <select className="w-full p-2 text-sm border border-gray-300 rounded">
                    <option>Choisir prix</option>
                    <option>-10 000€</option>
                    <option>-20 000€</option>
                    <option>-30 000€</option>
                  </select>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Tous PEX
                  </div>
                  <select className="w-full p-2 text-sm border border-gray-300 rounded">
                    <option>Choisir km</option>
                    <option>-50k km</option>
                    <option>-100k km</option>
                    <option>+100k km</option>
                  </select>
                </div>
                
                <button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 rounded text-sm flex items-center justify-center gap-2">
                  <FaSearch className="w-4 h-4" />
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchBar