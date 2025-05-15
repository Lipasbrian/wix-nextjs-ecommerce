'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/app/Context/CartContext'; // Assuming you have a cart context
import { Product } from '@/app/types';
import { trackEvent, EventTypes } from '@/lib/analytics';

// Improved type definitions for product details
interface ProductDetail {
  title: string;
  content: string;
}

interface Props {
  product: Product;
  relatedProducts?: Product[];
}

const SinglePage = ({ product, relatedProducts = [] }: Props) => {
  // State management
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Cart context (mock implementation if you don't have one)
  const { addToCart } = useCart();

  // Filter valid image URLs
  const validImages = Object.values(product?.images || {}).filter(
    (image): image is string => typeof image === 'string' && image.length > 0
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) =>
          prev > 0 ? prev - 1 : validImages.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) =>
          prev < validImages.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [validImages.length]);

  // Set focus to the selected thumbnail
  useEffect(() => {
    if (imgRefs.current[selectedImage]) {
      imgRefs.current[selectedImage]?.focus();
    }
  }, [selectedImage]);

  // Loading state handler
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Image zoom functionality
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  // Quantity handlers
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Track view when component mounts
  useEffect(() => {
    if (product?.id) {
      // For vendorId, either update your Product type or use a default
      const vendorId = product.vendorId || 'default-vendor-id';
      trackEvent(EventTypes.VIEW_PRODUCT, product.id, vendorId);
    }
  }, [product]);

  // Add to cart handler
  const handleAddToCart = () => {
    addToCart(product, quantity);

    // Track the event
    const vendorId = product.vendorId || 'default-vendor-id';
    trackEvent(EventTypes.ADD_TO_CART, product.id, vendorId, {
      quantity,
      price: product.price,
    });
  };

  // Loading/Error states
  if (!product) {
    return (
      <div
        className="flex justify-center items-center h-[400px]"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      {/* Left - Images */}
      <div className="md:w-1/2" aria-label="Product images">
        <div
          className="relative h-[500px] mb-4 overflow-hidden cursor-zoom-in"
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
          role="img"
          aria-label={`${product.name} main image`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          )}

          <Image
            src={validImages[selectedImage] || '/placeholder-product.png'}
            alt={product.name}
            fill
            className={`object-contain transition-transform duration-200 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : {}
            }
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={selectedImage === 0} // Prioritize the first image
          />
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {validImages.map((image, index: number) => (
            <div
              key={index}
              ref={(el) => {
                imgRefs.current[index] = el;
              }} // Fix: Don't return anything
              className={`relative w-20 h-20 cursor-pointer border-2 ${
                selectedImage === index
                  ? 'border-blue-500'
                  : 'border-transparent'
              } hover:border-blue-300 transition-colors`}
              onClick={() => setSelectedImage(index)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(index)}
              role="tab"
              tabIndex={0}
              aria-selected={selectedImage === index}
              aria-controls={`image-${index}`}
              aria-label={`Product image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right - Product Info */}
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        {/* Product rating - if available */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= 4 ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
          </div>
        </div>

        <p className="text-2xl font-semibold mb-4">
          ${Number(product.price).toFixed(2)}
        </p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        {/* Quantity selector */}
        <div className="flex items-center mb-6">
          <label htmlFor="quantity" className="mr-4 text-gray-700">
            Quantity:
          </label>
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={decreaseQuantity}
              className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-12 text-center py-1 bg-white focus:outline-none"
              aria-label="Product quantity"
            />
            <button
              onClick={increaseQuantity}
              className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          onClick={handleAddToCart}
          aria-label={`Add ${quantity} ${product.name} to cart`}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Add to Cart
        </button>

        {/* Product Details */}
        {product.details &&
          product.details.map((detail: ProductDetail, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium">{detail.title}</h3>
              <p className="text-gray-600">{detail.content}</p>
            </div>
          ))}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 w-full">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((relatedProduct, _index) => (
              <div
                key={relatedProduct.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={
                      relatedProduct.images &&
                      Object.values(relatedProduct.images).length > 0
                        ? Object.values(relatedProduct.images).filter(
                            (image): image is string =>
                              typeof image === 'string'
                          )[0]
                        : relatedProduct.imageUrl || '/placeholder-product.png'
                    }
                    alt={relatedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-1 truncate">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-blue-600">
                    ${Number(relatedProduct.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePage;
