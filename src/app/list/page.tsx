'use client';
import { useSearchParams } from 'next/navigation';
import Filter, { FilterState } from '@/components/Filter';
import ProductList from '@/components/ProductList';
import Image from 'next/image';
import { useTheme } from '@/app/Context/Theme/ThemeContext';
import { Product } from '@/app/types';
import { useState } from 'react';

const ListPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query')?.toLowerCase() || '';
  const { theme: _theme } = useTheme(); // Prefix with underscore to indicate intentionally unused

  // Add state for filters and sorting
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    type: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    category: '',
  });
  const [sortOrder, setSortOrder] = useState<string>('default');

  const handleFilterChange = (filter: FilterState) => {
    setActiveFilters(filter);
  };

  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
  };

  const allProducts: Product[] = [
    {
      id: '1',
      name: 'Running Shoes',
      price: 4500,
      description: 'Premium comfort running shoes',
      href: '/product/1',
      category: 'Sports',
      size: '42',
      color: 'Black',
      images: {
        primary: '/images/products/running-shoes-1.jpg',
        hover: '/images/products/running-shoes-2.jpg',
      },
    },
    {
      id: '2',
      name: 'Formal Shoes',
      price: 4500,
      description: 'Taekwood Leathers formal shoes',
      href: '/product/2',
      category: 'Formal',
      size: '43',
      color: 'Brown',
      images: {
        primary: '/images/products/formal-shoes-1.jpg',
        hover: '/images/products/formal-shoes-2.jpg',
      },
    },
  ];

  const filterProducts = (products: Product[]) => {
    return products.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query);
      const matchesCategory =
        !activeFilters.category || product.category === activeFilters.category;
      const matchesPrice =
        (!activeFilters.minPrice ||
          product.price >= parseInt(activeFilters.minPrice)) &&
        (!activeFilters.maxPrice ||
          product.price <= parseInt(activeFilters.maxPrice));
      const matchesSize =
        !activeFilters.size || product.size === activeFilters.size;
      const matchesColor =
        !activeFilters.color || product.color === activeFilters.color;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesPrice &&
        matchesSize &&
        matchesColor
      );
    });
  };

  const sortProducts = (products: Product[]) => {
    switch (sortOrder) {
      case 'price-asc':
        return [...products].sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc':
        return [...products].sort((a, b) => Number(b.price) - Number(a.price));
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  };

  const filteredAndSortedProducts = sortProducts(filterProducts(allProducts));

  return (
    <div
      className={`
        px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 
        bg-white dark:bg-gray-900 
        transition-colors duration-200
    `}
    >
      {/* Campaign Banner - Add dark mode support */}
      <div className="hidden bg-pink-50 dark:bg-pink-900 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700 dark:text-gray-200">
            Grab up to 50% off on <br /> Selected Products
          </h1>
          <button
            className="rounded-3xl bg-lama text-white w-max py-3 px-5 text-sm 
                    hover:bg-opacity-90 transition-all duration-200"
          >
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* Theme-aware content */}
      <div className="text-gray-900 dark:text-gray-100">
        {query && filteredAndSortedProducts.length === 0 ? (
          <div className="mt-8 p-4 rounded-lg bg-red-50 dark:bg-gray-800">
            <p className="text-red-600 dark:text-red-300">
              No results found for{' '}
              <span className="font-semibold">&quot;{query}&quot;</span>
            </p>
          </div>
        ) : (
          <h1 className="mt-12 text-xl font-semibold">
            {query ? `Results for "${query}"` : 'Shoes for You!'}
          </h1>
        )}
      </div>

      <Filter
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <ProductList products={filteredAndSortedProducts} />
    </div>
  );
};

export default ListPage;
