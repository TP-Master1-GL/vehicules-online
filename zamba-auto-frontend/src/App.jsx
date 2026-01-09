import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { CompanyProvider } from './context/CompagnyContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import VehicleDetail from './pages/VehicleDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Fleet from './pages/Fleet'
import FleetDashboard from './pages/FleetDashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import './styles/global.css'

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <CompanyProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalog />} />
                <Route path="/vehicule/:id" element={<VehicleDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/panier" element={<Cart />} /> {/* Note: /panier */}
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/achat-flotte" element={<Fleet />} />
                <Route path="/dashboard-flotte" element={<FleetDashboard />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CompanyProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App