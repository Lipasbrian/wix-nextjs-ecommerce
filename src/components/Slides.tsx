"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useReducer, useCallback } from "react";
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

// Define reducer actions for better state management
type SliderAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO"; payload: number }
  | { type: "PAUSE" }
  | { type: "RESUME" };

type SliderState = {
  currentSlide: number;
  isPaused: boolean;
};

const sliderReducer = (
  state: SliderState,
  action: SliderAction
): SliderState => {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        currentSlide:
          state.currentSlide === slides.length - 1 ? 0 : state.currentSlide + 1,
      };
    case "PREV":
      return {
        ...state,
        currentSlide:
          state.currentSlide === 0 ? slides.length - 1 : state.currentSlide - 1,
      };
    case "GOTO":
      return {
        ...state,
        currentSlide: action.payload,
      };
    case "PAUSE":
      return {
        ...state,
        isPaused: true,
      };
    case "RESUME":
      return {
        ...state,
        isPaused: false,
      };
    default:
      return state;
  }
};

export default function Slider() {
  const [state, dispatch] = useReducer(sliderReducer, {
    currentSlide: 0,
    isPaused: false,
  });
  const { currentSlide, isPaused } = state;

  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Memoized navigation functions
  const goToSlide = useCallback((index: number) => {
    dispatch({ type: "GOTO", payload: index });
  }, []);

  const nextSlide = useCallback(() => {
    dispatch({ type: "NEXT" });
  }, []);

  const prevSlide = useCallback(() => {
    dispatch({ type: "PREV" });
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      dispatch({ type: "NEXT" });
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 75) {
      // Swipe left
      nextSlide();
    } else if (touchStartX.current - touchEndX.current < -75) {
      // Swipe right
      prevSlide();
    }
  };

  return (
    <div
      className="relative w-full h-[600px]"
      onMouseEnter={() => dispatch({ type: "PAUSE" })}
      onMouseLeave={() => dispatch({ type: "RESUME" })}
      onFocus={() => dispatch({ type: "PAUSE" })}
      onBlur={() => dispatch({ type: "RESUME" })}
      ref={sliderRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products carousel"
    >
      {/* Main Slider Container */}
      <div
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Wrapper */}
        <div
          className="absolute top-0 left-0 w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {/* Individual Slides */}
          {slides.map((slide, index) => {
            const isVisible = Math.abs(currentSlide - index) <= 1; // Only fully render visible and adjacent slides

            return (
              <div
                key={slide.id}
                className="relative w-full h-full flex-shrink-0 overflow-hidden"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
                aria-hidden={currentSlide !== index}
              >
                {/* Background Image with optimization */}
                <div className="relative w-full h-full">
                  {isVisible ? (
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0} // Only prioritize first slide
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                      sizes="100vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Only render content if slide is visible or adjacent for performance */}
                {isVisible && (
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
                        className="inline-block bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100 transition-colors opacity-0 animate-fadeIn focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
                        style={{ animationDelay: "0.4s" }}
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          aria-label="Next slide"
        >
          →
        </button>

        {/* Navigation Dots */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3"
          role="tablist"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              } focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={currentSlide === index}
              role="tab"
              tabIndex={currentSlide === index ? 0 : -1}
            />
          ))}
        </div>

        {/* Pause/Play indicator (optional) */}
        {isPaused && (
          <div className="absolute top-4 right-4 bg-black/30 text-white text-sm px-2 py-1 rounded">
            Paused
          </div>
        )}
      </div>
    </div>
  );
}
