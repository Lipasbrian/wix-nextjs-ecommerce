import React, { useState } from 'react';

interface FilterState {
  type: string;
  minPrice: string;
  maxPrice: string;
  size: string;
  color: string;
  category: string;
}

interface FilterProps {
  onFilterChange: (filter: FilterState) => void;
  onSortChange: (sort: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, onSortChange }) => {
  // Local state to manage filter values
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    category: '',
  });

  // Available options for filters
  const categories = ['Sneakers', 'Formal', 'Casual', 'Sports'];
  const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44'];
  const colors = ['Black', 'White', 'Brown', 'Blue', 'Red'];
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
  ];

  // Handle individual filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Filters</h2>

      {/* Sort Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sort By
        </label>
        <select
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <select
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Size
        </label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className={`px-3 py-1 rounded-md text-sm ${
                filters.size === size
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => handleFilterChange('size', size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`px-3 py-1 rounded-md text-sm ${
                filters.color === color
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => handleFilterChange('color', color)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filters Button */}
      <button
        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        onClick={() => {
          const resetFilters = {
            type: '',
            minPrice: '',
            maxPrice: '',
            size: '',
            color: '',
            category: '',
          };
          setFilters(resetFilters);
          onFilterChange(resetFilters);
          onSortChange('default');
        }}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filter;
export type { FilterState };
export type { FilterProps };
