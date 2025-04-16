import Image from "next/image";
import { useState } from "react";

interface ProductImagesProps {
  images: string[];
  altText?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
}

const ProductImages = ({
  images,
  altText = "Product image",
  aspectRatio = "square",
}: ProductImagesProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle missing or empty images array
  if (!images?.length) {
    return (
      <div className="relative w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  return (
    <div
      className={`relative w-full ${aspectRatioClasses[aspectRatio]} min-h-[320px]`}
    >
      {/* Loading state overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
      )}

      {/* Primary Image */}
      <Image
        src={images[0]}
        alt={`${altText} - Main view`}
        fill
        priority
        className={`
          object-cover rounded-md z-10 
          hover:opacity-0 transition-opacity duration-500 ease-in-out
          ${isLoading ? "opacity-0" : "opacity-100"}
        `}
        onLoadingComplete={() => setIsLoading(false)}
      />

      {/* Secondary Image (if available) */}
      {images[1] && (
        <Image
          src={images[1]}
          alt={`${altText} - Alternative view`}
          fill
          className="absolute object-cover rounded-md"
          priority={false}
        />
      )}
    </div>
  );
};

export default ProductImages;
