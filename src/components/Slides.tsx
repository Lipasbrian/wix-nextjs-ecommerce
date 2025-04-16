"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Summer Sale Collection",
    description: "Sale! Up to 50% Off!",
    img: "/summer-banner.jpg",
    url: "/",
  },
  {
    id: 2,
    title: "Winter Sale Collection",
    description: "Sale! Up to 60% Off!",
    img: "/winter-banner.jpg",
    url: "/",
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) =>
        current === slides.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((current) =>
      current === slides.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  return (
    <div className="relative w-full h-[600px]">
      {/* Main Slider Container */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Slides Wrapper */}
        <div
          className="absolute top-0 left-0 w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {/* Individual Slides */}
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative w-full h-full flex-shrink-0 overflow-hidden"
            >
              {/* Background Image */}
              <div className="relative w-full h-full">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Slide Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className="max-w-4xl mx-auto">
                  <p className="text-2xl md:text-4xl text-white font-light mb-4 opacity-0 animate-fadeIn">
                    {slide.description}
                  </p>
                  <h2
                    className="text-4xl md:text-6xl text-white font-bold mb-8 opacity-0 animate-fadeIn"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {slide.title}
                  </h2>
                  <Link
                    href={slide.url}
                    className="inline-block bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100 transition-colors opacity-0 animate-fadeIn"
                    style={{ animationDelay: "0.4s" }}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-4 rounded-full transition-all"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-4 rounded-full transition-all"
          aria-label="Next slide"
        >
          →
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
