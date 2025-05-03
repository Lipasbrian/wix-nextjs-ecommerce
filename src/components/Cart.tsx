'use client';

import { useCart } from '@/app/Context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Product } from '@/app/types';
import { trackAddToCart, trackRemoveFromCart } from '@/services/analytics';

// Define the CartItem type
interface CartItem extends Product {
  quantity: number;
}

type CartProps = {
  onClose: () => void;
  showCart: boolean;
};

export default function Cart({ onClose, showCart }: CartProps) {
  // Fix: use cart instead of cartItems to match your context
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  // Fix: add proper types to reduce function
  const cartTotal = cart.reduce(
    (total: number, item: CartItem) =>
      total + Number(item.price) * item.quantity,
    0
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Enhanced handler for quantity updates that tracks analytics
  const handleQuantityUpdate = (
    itemId: string,
    newQuantity: number,
    currentQuantity: number
  ) => {
    // Track the change in quantity
    const quantityDelta = newQuantity - currentQuantity;

    if (quantityDelta > 0) {
      // If increasing quantity, track as add to cart
      trackAddToCart(itemId, quantityDelta);
    } else if (quantityDelta < 0 && newQuantity > 0) {
      // If decreasing quantity but not removing, track as remove from cart
      trackRemoveFromCart(itemId, Math.abs(quantityDelta));
    }

    // Call the original updateQuantity function
    updateQuantity(itemId, newQuantity);
  };

  // Enhanced handler for removing items that tracks analytics
  const handleRemoveFromCart = (itemId: string, quantity: number) => {
    // Track the removal
    trackRemoveFromCart(itemId, quantity);

    // Call the original removeFromCart function
    removeFromCart(itemId);
  };

  if (!showCart) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className="fixed right-4 top-16 bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg w-80 z-50"
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            Shopping Cart
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-gray-500 dark:text-gray-300">
              Your cart is empty
            </p>
            <button
              onClick={() => {
                router.push('/products');
                onClose();
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items */}
            <div className="max-h-[60vh] overflow-y-auto space-y-3">
              {cart.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-3 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(Number(item.price))} each
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleQuantityUpdate(
                            item.id,
                            Math.max(0, item.quantity - 1),
                            item.quantity
                          )
                        }
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                      >
                        -
                      </button>
                      <span className="text-gray-900 dark:text-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityUpdate(
                            item.id,
                            item.quantity + 1,
                            item.quantity
                          )
                        }
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          handleRemoveFromCart(item.id, item.quantity)
                        }
                        className="ml-auto text-red-500 hover:text-red-600"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between mb-4">
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  Total
                </span>
                <span className="text-gray-900 dark:text-gray-100 font-bold">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
              <button
                onClick={() => {
                  router.push('/checkout');
                  onClose();
                }}
                className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
