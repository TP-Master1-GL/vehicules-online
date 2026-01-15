import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug: afficher le rôle de l'utilisateur
  useEffect(() => {
    if (user) {
      console.log('🔐 Navbar - User:', user);
      console.log('🔐 Navbar - Role:', user.role, 'Type:', typeof user.role);
      console.log('🔐 Navbar - Is Admin?', user.role === 'ADMIN' || user.role?.toUpperCase?.() === 'ADMIN');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="african-pattern-top"></div>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/logo-zamba.png" 
                alt="ZAMBA Auto" 
                className="h-10 mr-2"
              />
              <span className="text-2xl font-bold text-gray-900">ZAMBA Auto</span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/catalogue" className="text-gray-700 hover:text-orange-500 font-medium">
                Catalogue
              </Link>
              <Link to="/achat-flotte" className="text-gray-700 hover:text-orange-500 font-medium">
                Achat flotte
              </Link>
              <Link to="/a-propos" className="text-gray-700 hover:text-orange-500 font-medium">
                À propos
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-500 font-medium">
                Contact
              </Link>

              {/* Cart */}
              <Link to="/panier" className="relative">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-4">
                  {(user.role === 'ADMIN' || user.role?.toUpperCase?.() === 'ADMIN') && (
                    <Link
                      to="/admin/dashboard"
                      className="text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Administration
                    </Link>
                  )}
                  <Link
                    to={user.customerType === 'company' || user.customerType === 'professional' ? '/entreprise/dashboard' : '/panier'}
                    className="text-gray-700 hover:text-orange-500 font-medium"
                  >
                    Mon compte
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="btn-primary py-2 px-4"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-orange-500 font-medium">
                    Connexion
                  </Link>
                  <Link to="/register" className="btn-primary py-2 px-4">
                    Inscription
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col space-y-4 mt-4">
                <Link to="/catalogue" className="text-gray-700 hover:text-orange-500 font-medium">
                  Catalogue
                </Link>
                <Link to="/achat-flotte" className="text-gray-700 hover:text-orange-500 font-medium">
                  Achat flotte
                </Link>
                <Link to="/a-propos" className="text-gray-700 hover:text-orange-500 font-medium">
                  À propos
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-orange-500 font-medium">
                  Contact
                </Link>

                {user ? (
                  <>
                    {(user.role === 'ADMIN' || user.role?.toUpperCase?.() === 'ADMIN') && (
                      <Link
                        to="/admin/dashboard"
                        className="text-orange-600 hover:text-orange-700 font-semibold"
                      >
                        Administration
                      </Link>
                    )}
                    <Link
                      to={user.customerType === 'company' || user.customerType === 'professional' ? '/entreprise/dashboard' : '/panier'}
                      className="text-gray-700 hover:text-orange-500 font-medium"
                    >
                      Mon compte
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="btn-primary py-2 px-4 text-left"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 hover:text-orange-500 font-medium">
                      Connexion
                    </Link>
                    <Link to="/register" className="btn-primary py-2 px-4 text-center">
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;