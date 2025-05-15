'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { trackAdClick } from '@/services/analytics';

interface AdType {
  title: string;
  description: string;
  image: string | null;
  targetLocation: string;
  budget: number;
  vendorId?: string;
}

interface AdPreviewProps {
  ad: AdType[];
  autoPlayInterval?: number;
}

export default function AdPreview({
  ad,
  autoPlayInterval = 5000,
}: AdPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentAd = ad[currentIndex];

  // Use useCallback to memoize the trackAdImpression function
  const trackAdImpression = useCallback(
    async (adId: string, position: number, title: string) => {
      // Now we can access currentAd directly
      const vendorId = currentAd?.vendorId || 'system';

      try {
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: 'adImpression',
            adId,
            position,
            adTitle: title,
            vendorId,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          console.error('Failed to track ad impression');
        }
      } catch (error) {
        console.error('Error tracking ad impression:', error);
      }
    },
    [currentAd]
  );

  // Track ad impressions when ad changes
  useEffect(() => {
    if (currentAd) {
      // Create a unique ID for the ad since it doesn't have one
      const adId = `ad-${currentAd.title.toLowerCase().replace(/\s+/g, '-')}`;

      // Track the impression
      trackAdImpression(adId, currentIndex, currentAd.title);
    }
  }, [currentIndex, currentAd, trackAdImpression]);

  // Auto advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ad.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [ad.length, autoPlayInterval]);

  // Handle ad click
  const handleAdClick = () => {
    if (currentAd) {
      const adId = `ad-${currentAd.title.toLowerCase().replace(/\s+/g, '-')}`;
      trackAdClick(adId, currentIndex, currentAd.title);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto border rounded-lg p-6 bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700">
      {/* Wrap in Link for clickability */}
      <Link
        href={`/products?search=${encodeURIComponent(currentAd.title)}`}
        onClick={handleAdClick}
        className="block"
      >
        {/* Image Section */}
        {currentAd.image && !imageError ? (
          <div className="relative h-48 mb-4 overflow-hidden">
            <Image
              src={currentAd.image}
              alt={`Advertisement for ${currentAd.title}`}
              fill
              className="object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">
              No Image Available
            </span>
          </div>
        )}

        {/* Content Section */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <h3 className="text-2x1 md:text-3xl font-semibold text-gray-900 dark:text-white">
            {currentAd.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            {currentAd.description}
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p className="flex items-center gap-2">
              <span role="img" aria-label="Location">
                📍
              </span>
              {currentAd.targetLocation}
            </p>
            <p className="flex items-center gap-3">
              <span role="img" aria-label="Price" className="text-2xl">
                💰
              </span>
              KES {currentAd.budget.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>

      {/* Navigation Dots */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {ad.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${
                index === currentIndex
                  ? 'bg-blue-500 w-6'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
