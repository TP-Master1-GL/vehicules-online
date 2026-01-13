import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaMapMarkerAlt, 
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaStar
} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#1E1A17]">

      {/* Pattern africain – transition haute */}
      <div
        className="absolute top-0 left-0 w-full h-16 md:h-20 lg:h-24
                   bg-repeat-x pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/african-pattern-border.png)',
          backgroundSize: 'auto 100%',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 90%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 90%)'
        }}
      />

      {/* Contenu principal */}
      <div className="relative z-10 text-[#F5F5F5] pt-24 pb-8">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Brand & Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-30 bg-[#241F1B] rounded-xl flex items-center justify-center shadow-lg">
                  <img
                    src="/logo-zamba.png"
                    alt="ZAMBA Auto"
                    className="w-35 h-30 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-[#CFCFCF] text-sm mt-1">
                    L'excellence automobile camerounaise
                  </h3>
                </div>
              </div>

              <p className="text-[#CFCFCF] leading-relaxed mb-6 max-w-xl">
                Votre marketplace de confiance pour l'achat de véhicules particuliers 
                et de flottes d'entreprise au Cameroun. Transparence, qualité et sérieux 
                depuis plus de 15 ans.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: FaShieldAlt, text: "Garantie 12 mois" },
                  { icon: FaCheckCircle, text: "Véhicules vérifiés" },
                  { icon: FaStar, text: "15 ans d'expertise" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-[#241F1B] px-4 py-2 rounded-lg border border-[#F2C28B]/20"
                  >
                    <item.icon className="w-4 h-4 text-[#F28C28]" />
                    <span className="text-sm text-[#CFCFCF]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xl font-bold mb-6 pb-3 border-b border-[#F2C28B]/30">
                Navigation
              </h4>
              <ul className="space-y-3">
                {[
                  { to: "/", label: "Accueil" },
                  { to: "/catalogue", label: "Catalogue" },
                  { to: "/achat-flotte", label: "Achat flotte" },
                  { to: "/a-propos", label: "À propos" },
                  { to: "/contact", label: "Contact" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-2 text-[#CFCFCF] hover:text-[#F57C00]
                                 transition-all hover:translate-x-1 group"
                    >
                      <span className="w-2 h-2 bg-[#F28C28] rounded-full opacity-0 group-hover:opacity-100" />
                      {link.label}
                      <FaArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xl font-bold mb-6 pb-3 border-b border-[#F2C28B]/30">
                Nous contacter
              </h4>
              <ul className="space-y-4">
                {[
                  { icon: FaPhone, label: "Téléphone", value: "+222 6 06 00 08 09" },
                  { icon: FaEnvelope, label: "Email", value: "contact@zamba-auto.com" },
                  { icon: FaClock, label: "Horaires", value: "Lun - Ven, 8h - 18h" },
                  { icon: FaMapMarkerAlt, label: "Localisation", value: "Douala, Cameroun" }
                ].map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="w-10 h-10 bg-[#241F1B] rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#F28C28]" />
                    </div>
                    <div>
                      <div className="text-[#F5F5F5] font-medium">{item.label}</div>
                      <div className="text-[#CFCFCF]">{item.value}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Footer bottom */}
          <div className="mt-12 pt-8 border-t border-[#F2C28B]/30 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-[#CFCFCF]">
              © {new Date().getFullYear()} ZAMBA Auto. Tous droits réservés.
            </p>

            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-[#241F1B] rounded-lg flex items-center justify-center
                             hover:bg-[#F28C28]/20 transition"
                >
                  <Icon className="w-5 h-5 text-[#F5F5F5]" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bande finale */}
      <div className="w-full h-1 bg-gradient-to-r from-[#E27A1B] via-[#F28C58] to-[#F2C78B]" />
    </footer>
  )
}

export default Footer
