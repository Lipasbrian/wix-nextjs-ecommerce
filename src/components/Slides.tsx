"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = {
  id: number;
  title: string;
  description: string;
  img: string;
  url: string;
  bg: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Summer Sale Collection",
    description: "Sale! Up to 50% Off!",
    img: "/winter-banner.jpg",
    url: "/summer-banner",
    bg: "bg-gradient-to-r from-yellow-50/70 to-pink-70/50",
  },
  {
    id: 2,
    title: "Winter Sale Collection",
    description: "Sale! Up to 60% Off!",
    img: "/winter-banner.jpg",
    url: "/winter-banner",
    bg: "bg-gradient-to-r from-pink-50/70 to-blue-70/50",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  // Debugging: Log slide changes
  useEffect(() => {
    console.log("Current slide:", current, slides[current].title);
  }, [current]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden z-0">
      {/* Debugging border - remove in production */}
      <div
        className="absolute inset-0 border-4 border-red-500 pointer-events-none z-30"
        style={{
          display: "none" /* Set to 'block' to visualize container bounds */,
        }}
      />

      {/* Slides Container */}
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative"
            style={{
              minWidth: "100%",
              // Debug border - remove in production
            }}
          >
            {/* Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                className="object-cover"
                priority
                onLoadingComplete={() =>
                  console.log(`${slide.title} image loaded`)
                }
              />
            </div>

            {/* Content */}
            <div
              className={`absolute inset-0 z-10 ${slide.bg} flex items-center justify-center`}
            >
              <div className="text-center p-4 max-w-4xl">
                <h2 className="text-xl md:text-3xl font-medium text-gray-800 mb-2">
                  {slide.description}
                </h2>
                <h1 className="text-3xl md:text-6xl font-bold text-gray-900 mb-6">
                  {slide.title} {/* Debug: Current slide ID: {slide.id} */}
                </h1>
                <Link href={slide.url}>
                  <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition">
                    SHOP NOW
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              console.log("Manually switched to slide:", index + 1);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              current === index ? "bg-black scale-125" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
