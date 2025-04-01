"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/Context/Theme/ThemeContext";

const CategoryList = () => {
  const { theme } = useTheme();

  const categories = [
    {
      name: "Laptops",
      image:
        "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    },
    {
      name: "Shoes",
      image:
        "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    },
    {
      name: "Doors",
      image:
        "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    },
    {
      name: "Cables",
      image:
        "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    },
    {
      name: "Home appliances",
      image:
        "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    },
    {
      name: "School uniforms",
      image:
        "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    },
  ];

  return (
    <div
      className={`px-4 overflow-x-scroll scrollbar-hide ${
        theme === "dark" ? "bg-gray-900" : "bg-black"
      }`}
    >
      <div className="flex gap-4 md:gap-8 py-4 w-full overflow-x-auto">
        {categories.map((category, index) => (
          <Link
            key={index}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            href="/list"
          >
            <div
              className={`
              relative w-full h-96 
              ${theme === "dark" ? "bg-gray-900" : "bg-slate-100"}
            `}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="20vw"
                className={`
                  object-cover 
                  ${
                    theme === "dark"
                      ? "border-0 brightness-[0.85] contrast-[1.15]"
                      : ""
                  }
                `}
              />
            </div>
            <h1
              className={`
              mt-8 tracking-wide 
              ${theme === "dark" ? "text-white-200" : "text-black-800"}
            `}
            >
              {category.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
