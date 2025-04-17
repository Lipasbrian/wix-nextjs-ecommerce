"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilter({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current sort value from URL
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "default");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);

    // Create new search params
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove sort parameter
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    // Reset to page 1 when sorting changes
    params.delete("page");

    // Update URL with new parameters
    const queryString = params.toString();
    router.push(
      `/category/${categorySlug}${queryString ? `?${queryString}` : ""}`
    );
  };

  return (
    <div className="mb-6 flex justify-end">
      <div className="flex items-center">
        <label htmlFor="sort" className="mr-2 text-gray-600">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={handleSortChange}
          className="border rounded p-2"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}
