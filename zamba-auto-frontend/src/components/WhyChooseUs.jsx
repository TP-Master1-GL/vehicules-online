const WhyChooseUs = () => {
    const points = [
      "Large choix de véhicules neufs et d'occasion",
      "Financement et crédit adapté",
      "Service après-vente garanti",
      "Livraison dans tout le Cameroun",
      "Transactions sécurisées et transparentes"
    ]
  
    return (
      <section className="py-16 bg-gradient-to-r from-blue-50 to-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title text-left">Pourquoi Choisir ZAMBA Auto ?</h2>
              <p className="text-gray-700 mb-6">
                ZAMBA Auto est votre marketplace de référence pour l'achat de véhicules 
                particuliers et de flottes d'entreprise au Cameroun. Nous vous accompagnons 
                à chaque étape de votre projet automobile.
              </p>
              
              <ul className="space-y-3">
                {points.map((point, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-emerald-500 mr-3">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <button className="btn btn-primary mr-4">En savoir plus</button>
                <button className="btn btn-outline">Nos garanties</button>
              </div>
            </div>
            
            <div className="bg-blue-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-2">500+</div>
                  <div className="text-gray-600">Véhicules en stock</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-2">98%</div>
                  <div className="text-gray-600">Clients satisfaits</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-2">15+</div>
                  <div className="text-gray-600">Marques disponibles</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-2">24h</div>
                  <div className="text-gray-600">Réponse garantie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default WhyChooseUs