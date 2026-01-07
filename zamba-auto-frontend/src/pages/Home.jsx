import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaCar, FaBuilding, FaShieldAlt } from 'react-icons/fa'
import SearchBar from '../components/sections/SearchBar'
import ServicesSection from '../components/sections/ServicesSection'
import BestOffersSection from '../components/sections/BestOffersSection'
import StatsSection from '../components/sections/StatsSection'
import CTAButtons from '../components/sections/CTAButtons'
import WhyChooseUs from '../components/sections/WhyChooseUs'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec hero-image.jpg */}
      <section 
        className="relative text-white py-20 md:py-32"
        style={{
          backgroundImage: `
            
            url('/hero-image.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top'

        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Acheter votre véhicule en toute confiance
            </h2>
            <p className="text-xl md:text-2xl  opacity-95 mb-12">
              Individuel ou entreprise, trouvez le bon véhicule au bon prix.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <button 
                onClick={() => navigate('/catalogue')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105 shadow-lg"
              >
                Voir le catalogue
              </button>
              <span className="text-white/70 text-xl">-</span>
              <button 
                onClick={() => navigate('/achat-flotte')}
                className="bg-blue-700 hover:bg-blue-600 text-white-900  font-bold py-4 px-10 rounded-lg text-lg transition-all hover:scale-105 shadow-lg"
              >
                Achat flotte
              </button>
            </div>
          </div>
        </div>
         {/* Pattern africain collé à l’image */}
  <div
    className="absolute bottom-0 left-0 w-full
               h-16 md:h-20 lg:h-24
               bg-repeat-x pointer-events-none"
    style={{
      backgroundImage: 'url(/african-pattern-border.png)',
      backgroundSize: 'auto 100%',
      maskImage: 'linear-gradient(to top, transparent, black)',
      WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 90%)'
    }}
  />
      </section>

     

      {/* Search Bar */}
        <SearchBar />
      {/* Best Offers avec les images des véhicules */}
      <BestOffersSection />
      
      {/* Services Section avec les images spécifiques */}
      <ServicesSection />



   

       {/* CTA Buttons */}
       <CTAButtons />

      {/* Why Choose Us */}
     
      <WhyChooseUs />
     
    </div>
  )
}

export default Home