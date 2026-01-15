import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section 
      className="relative bg-cover bg-center py-20 md:py-32"
      style={{ 
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/hero-image.jpg')"
      }}
    >
      <div className="container-zamba relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Acheter votre véhicule en toute confiance
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Individuel ou entreprise, trouvez le bon véhicule au bon prix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/catalog" className="btn-zamba-orange text-lg">
              Voir le catalogue
            </Link>
            <Link to="/achat-flotte" className="btn-zamba-blue text-lg">
              Achat flotte
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;