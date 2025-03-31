// components/NavbarClient.tsx
"use client"

import { useCart } from '@/app/Context/CartContext'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import NavbarShell from './NavbarShell'

const Cart = dynamic(() => import('./Cart'), {
  ssr: false,
  loading: () => <p className="text-black">Loading cart...</p>
})

export default function NavbarClient() {
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <NavbarShell 
        itemCount={itemCount} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      {isCartOpen && (
        <>
          {/* Overlay with click handler */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
          />
          
          {/* Cart component with proper props */}
          <Cart 
            onClose={() => setIsCartOpen(false)} 
            showCart={isCartOpen}
          />
        </>
      )}
    </>
  )
}