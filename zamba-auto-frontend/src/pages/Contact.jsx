const Contact = () => {
    return (
      <div className="py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Contactez-nous</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            {/* Informations de contact */}
            <div>
              <div className="bg-white p-8 rounded-xl shadow mb-6">
                <h2 className="text-2xl font-bold text-blue-800 mb-6">Nos coordonnées</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <span className="text-blue-800">📞</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Téléphone</h3>
                      <p className="text-gray-600">+237 600 000 086</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <span className="text-blue-800">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Email</h3>
                      <p className="text-gray-600">contact@zamba-auto.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <span className="text-blue-800">🕒</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Horaires</h3>
                      <p className="text-gray-600">Lun - Ven, 8h - 18h</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Carte (placeholder) */}
              <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Carte de localisation</p>
              </div>
            </div>
            
            {/* Formulaire de contact */}
            <div className="bg-white p-8 rounded-xl shadow">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">Envoyez-nous un message</h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Nom *</label>
                    <input type="text" required className="w-full p-3 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Prénom *</label>
                    <input type="text" required className="w-full p-3 border rounded-lg" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input type="email" required className="w-full p-3 border rounded-lg" />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Téléphone</label>
                  <input type="tel" className="w-full p-3 border rounded-lg" />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Sujet</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>Demande d'information</option>
                    <option>Devis véhicule</option>
                    <option>Devis flotte</option>
                    <option>Service après-vente</option>
                    <option>Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Message *</label>
                  <textarea rows="4" required className="w-full p-3 border rounded-lg"></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary w-full">
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Contact