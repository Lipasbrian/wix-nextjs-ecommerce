'use client'

import { createContext, useState, ReactNode, useContext } from 'react'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type CartContextType = {
  cartItems: CartItem[]
  showCart: boolean
  toggleCart: () => void
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  cartTotal: number
}


const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  const toggleCart = () => setShowCart(prev => !prev)
  
  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        showCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}