"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/Context/Theme/ThemeContext";
import { useRef } from "react";

const CategoryList = () => {
  const { theme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Add a slug property to each category
  const categories = [
    {
      name: "Laptops",
      slug: "laptops",
      image:
        "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    },
    {
      name: "Smartphones",
      slug: "smartphones",
      image:
        "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg",
    },
    // Add more categories with slugs
  ];

  return (
    <div
      ref={scrollContainerRef}
      className={`px-4 overflow-x-scroll scrollbar-hide transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="flex gap-4 md:gap-8 py-4 w-full overflow-x-auto">
        {categories.map((category, index) => (
          <Link
            key={index}
            className="flex-shrink-0 group relative w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            href={`/category/${category.slug}`}
          >
            <div
              className={`
              relative w-full h-96 overflow-hidden rounded-lg
              transition-all duration-300 ease-in-out
              ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}
            `}
            >
              <div
                className={`
                absolute inset-0 transition-opacity duration-300
                ${theme === "dark" ? "bg-black/40" : "bg-black/10"}
                group-hover:bg-black/0
              `}
              />
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`
                  object-cover transition-all duration-300
                  group-hover:scale-105
                  ${
                    theme === "dark"
                      ? "brightness-90 contrast-100"
                      : "brightness-100 contrast-100"
                  }
                `}
                priority={index < 2}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
            </div>
            <h2
              className={`
              mt-4 text-lg font-medium tracking-wide
              transition-colors duration-300
              ${
                theme === "dark"
                  ? "text-gray-200 group-hover:text-white"
                  : "text-gray-900 group-hover:text-black"
              }
            `}
            >
              {category.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
