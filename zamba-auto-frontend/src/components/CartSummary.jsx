import React from 'react'
import { useCart } from '../hooks/useCart'
import { Link } from 'react-router-dom'

const CartSummary = () => {
  const { cart, total } = useCart()
  
  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Votre panier</h3>
        <p className="text-gray-500 mb-6">Votre panier est vide</p>
        <Link 
          to="/catalogue"
          className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-medium hover:bg-orange-600"
        >
          Voir le catalogue
        </Link>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-6">
      <h3 className="text-lg font-bold mb-6">Récapitulatif</h3>
      
      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{item.vehicle.name}</div>
              <div className="text-sm text-gray-500">
                {item.quantity} × {item.unitPrice.toLocaleString()} €
              </div>
            </div>
            <div className="font-bold">
              {(item.quantity * item.unitPrice).toLocaleString()} €
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Sous-total</span>
          <span className="font-bold">{total.toLocaleString()} €</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Livraison</span>
          <span className="font-bold">Gratuite</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">TVA (20%)</span>
          <span className="font-bold">{(total * 0.2).toLocaleString()} €</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-2xl text-orange-500">
              {(total * 1.2).toLocaleString()} €
            </span>
          </div>
        </div>
      </div>
      
      <Link 
        to="/checkout"
        className="block w-full mt-6 bg-orange-500 text-white text-center py-3 rounded-lg font-medium hover:bg-orange-600"
      >
        Procéder au paiement
      </Link>
    </div>
  )
}

export default CartSummary