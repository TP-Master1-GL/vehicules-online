const ContactSection = () => {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Besoin d'aide ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions 
              et vous accompagner dans votre choix de véhicule.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-lg mb-2">Par téléphone</h3>
              <p className="text-gray-600 mb-4">Appelez-nous du lundi au vendredi</p>
              <a href="tel:+222606000809" className="text-blue-800 font-bold hover:underline">
                +222 6 06 00 08 09
              </a>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="font-bold text-lg mb-2">Par email</h3>
              <p className="text-gray-600 mb-4">Réponse sous 24h ouvrées</p>
              <a href="mailto:contact@zamba-auto.com" className="text-blue-800 font-bold hover:underline">
                contact@zamba-auto.com
              </a>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-bold text-lg mb-2">Chat en direct</h3>
              <p className="text-gray-600 mb-4">Du lundi au samedi, 9h-19h</p>
              <button className="btn btn-primary">
                Démarrer le chat
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default ContactSection