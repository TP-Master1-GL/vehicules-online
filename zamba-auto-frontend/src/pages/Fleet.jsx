const Fleet = () => {
    return (
      <div className="py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Achat Flotte Entreprise</h1>
          <p className="text-gray-600 mb-8">Solutions de mobilité adaptées à votre entreprise</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <div className="bg-white p-8 rounded-xl shadow">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">Demander un devis flotte</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nom de l'entreprise</label>
                  <input type="text" className="w-full p-3 border rounded-lg" />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Nombre de véhicules</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>1-5 véhicules</option>
                    <option>5-10 véhicules</option>
                    <option>10-20 véhicules</option>
                    <option>Plus de 20 véhicules</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Type de véhicules</label>
                  <div className="space-y-2">
                    {['Voitures', 'Utilitaires', 'Scooters', 'Mixte'].map(type => (
                      <label key={type} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Budget estimé</label>
                  <input type="range" min="10000" max="500000" step="10000" className="w-full" />
                </div>
                
                <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-700 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-lg transition-all hover:shadow-lg disabled:opacity-70">
                  Demander un devis
                </button>
              </form>
            </div>
            
            {/* Avantages */}
            <div>
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white p-8 rounded-xl mb-6">
                <h3 className="text-xl font-bold mb-4">Avantages pour les entreprises</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Réduction volume importante
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Livraison sur site
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Maintenance incluse
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Assistance 24/7
                  </li>
                </ul>
              </div>
              
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                <h3 className="text-lg font-bold text-emerald-800 mb-2">Service dédié entreprises</h3>
                <p className="text-emerald-700">
                  Un conseiller dédié vous accompagne dans votre projet de flotte automobile.
                  Contactez-nous pour un audit gratuit de vos besoins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Fleet