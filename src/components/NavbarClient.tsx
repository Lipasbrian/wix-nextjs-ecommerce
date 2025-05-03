// components/NavbarClient.tsx
'use client';

import { useCart } from '@/app/Context/CartContext';
import { useState, FC } from 'react';
import dynamic from 'next/dynamic';
import NavbarShell from './NavbarShell';

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

const Cart = dynamic(() => import('./Cart'), {
  ssr: false,
  loading: () => <p className="text-black">Loading cart...</p>,
});

const NavbarClient: FC = () => {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = cart.reduce((sum: number, item: CartItem) => {
    return sum + item.quantity;
  }, 0);

  return (
    <>
      <NavbarShell
        itemCount={totalItems}
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
          <Cart onClose={() => setIsCartOpen(false)} showCart={isCartOpen} />
        </>
      )}
    </>
  );
};

export default NavbarClient;
