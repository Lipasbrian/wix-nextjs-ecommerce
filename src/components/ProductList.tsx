"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/Context/CartContext";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  images: {
    primary: string;
    hover: string;
  };
  href: string;
}

const ProductList = ({ products }: { products?: Product[] }) => {
  const { addToCart } = useCart();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingId(product.id);

    try {
      // Convert price from string to number (remove "Ksh " and commas)
      const price = Number(product.price.replace(/[^\d]/g, ""));

      // Add to cart context
      addToCart({
        id: product.id,
        name: product.name,
        price: price,
        quantity: 1,
      });

      // Call API endpoint
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: price,
          image: product.images.primary,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      // You might want to show a toast notification here
    } finally {
      setLoadingId(null);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="mt-12 text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap mb-12">
      {products.map((product) => (
        <Link
          key={product.id}
          href={product.href}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] z-0"
        >
          {/* Image hover effect */}
          <div className="relative w-full h-80">
            <Image
              src={product.images.hover}
              alt={product.name}
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
            />
            <Image
              src={product.images.primary}
              alt={product.name}
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md"
            />
          </div>

          {/* Product info */}
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">{product.price}</span>
          </div>
          <div className="text-sm text-gray-500">{product.description}</div>

          {/* Add to Cart button */}
          <button
            onClick={(e) => handleAddToCart(product, e)}
            disabled={loadingId === product.id}
            className={`rounded-2xl ring-1 ring-lama text-lama py-2 px-4 w-max text-xs hover:bg-lama hover:text-white transition-colors ${
              loadingId === product.id ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingId === product.id ? "Adding..." : "Add To Cart"}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
