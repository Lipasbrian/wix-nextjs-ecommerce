'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/Context/CartContext';
import toast from 'react-hot-toast';
import { Product } from '@/app/types';

// Update the component to handle the type
const ProductList = ({ products }: { products: Product[] }) => {
  const [sortOrder, setSortOrder] = useState('default');

  // Get cart context
  const { addToCart } = useCart();

  // Sort products based on selected order with proper type handling
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOrder) {
      case 'price-asc':
        return Number(a.price) - Number(b.price);
      case 'price-desc':
        return Number(b.price) - Number(a.price);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    try {
      addToCart(product, 1);
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div>
      {/* Sort controls */}
      <div className="mb-6 flex justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded shadow-sm"
        >
          <option value="default">Default sorting</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product image with link */}
            <Link href={`/products/${product.id}`} className="block">
              <div className="relative h-64 bg-gray-100">
                {/* Handle image source with fallbacks */}
                <Image
                  src={
                    product.imageUrl ||
                    (product.images && Object.values(product.images)[0]) ||
                    '/placeholder-product.png'
                  }
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </Link>

            {/* Product details */}
            <div className="p-4">
              <Link href={`/products/${product.id}`} className="block">
                <h2 className="text-lg font-medium hover:text-blue-600 transition-colors">
                  {product.name}
                </h2>
              </Link>
              <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                {product.description}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-lg font-bold">
                  ${Number(product.price).toFixed(2)}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
