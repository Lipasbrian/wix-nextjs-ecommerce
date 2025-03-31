// components/Cart.tsx
"use client"

import { useCart } from '@/app/Context/CartContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type CartProps = {
  onClose: () => void;
  showCart: boolean;
};

export default function Cart({ onClose, showCart }: CartProps) {
  const { cartItems } = useCart()
  const router = useRouter()

  // Close cart when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!showCart) return null

  return (
    <div 
      className="fixed right-4 top-16 bg-white p-4 shadow-lg rounded-lg w-64 z-50"
      aria-modal="true"
      role="dialog"
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        aria-label="Close cart"
      >
        &times;
      </button>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500">Your cart is empty</p>
          <button 
            onClick={() => {
              router.push('/products')
              onClose()
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="font-bold text-lg mb-2">Your Items</h3>
          {cartItems.map(item => (
            <div key={item.id} className="border-b pb-2">
              <p>{item.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity} × ${item.price}
              </p>
            </div>
          ))}
          <button 
            onClick={() => {
              router.push('/checkout')
              onClose()
            }}
            className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}