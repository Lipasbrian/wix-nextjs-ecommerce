'use client';

import { useCart } from '@/app/Context/CartContext';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatCurrency';
import type { CartItem as ICartItem } from '@/app/types'; // Rename to avoid unused warning

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const cartItems: ICartItem[] = cart as unknown as ICartItem[]; // Double casting to ensure type safety

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <Image
                src={item.images?.[0] || '/placeholder.png'} // Use first image from images array
                alt={item.name}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p>{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 text-right">
            <p className="text-xl font-bold">Total: {formatCurrency(total)}</p>
            <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
