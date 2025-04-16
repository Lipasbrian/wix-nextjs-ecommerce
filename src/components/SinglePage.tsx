"use client";
import React from "react";
import { Product } from "@/app/types";
import { useState } from "react";
import Image from "next/image";

interface Props {
  product: Product;
}

const SinglePage = ({ product }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      {/* Left - Images */}
      <div className="md:w-1/2">
        <div className="relative h-[500px] mb-4">
          <Image
            src={
              Object.values(product.images).filter(
                (image): image is string => typeof image === "string"
              )[selectedImage]
            }
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {Object.values(product.images)
            .filter((image): image is string => typeof image === "string")
            .map((image, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 cursor-pointer border-2 ${
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Right - Product Info */}
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl font-semibold mb-4">
          ${Number(product.price).toFixed(2)}
        </p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        {/* Add to Cart Button */}
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => {
            // Add to cart functionality here
            console.log("Added to cart:", product);
          }}
        >
          Add to Cart
        </button>

        {/* Product Details */}
        {product.details && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            {product.details.map(
              (
                detail: {
                  title:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<React.AwaitedReactNode>
                    | null
                    | undefined;
                  content:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<React.AwaitedReactNode>
                    | null
                    | undefined;
                },
                index: React.Key | null | undefined
              ) => (
                <div key={index} className="mb-4">
                  <h3 className="font-medium">{detail.title}</h3>
                  <p className="text-gray-600">{detail.content}</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePage;
