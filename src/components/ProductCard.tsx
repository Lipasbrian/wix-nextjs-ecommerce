'use client';

import Image from 'next/image';
import type { Product } from '@/app/types';
import { FC } from 'react';
import { trackAddToCart, trackProductClick } from '@/services/analytics';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Enhanced handler to track add to cart events
  const handleAddToCart = (product: Product) => {
    // Track the event
    trackAddToCart(product.id, 1);

    // Call the original handler
    onAddToCart(product);
  };

  // Handler for product clicks
  const handleProductClick = () => {
    trackProductClick(product.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Link href={`/products/${product.id}`} onClick={handleProductClick}>
        <div className="relative h-48">
          <Image
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`} onClick={handleProductClick}>
          <h3 className="text-lg font-semibold">{product.name}</h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400">${product.price}</p>
        <button
          onClick={() => handleAddToCart(product)}
          className="mt-2 w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
