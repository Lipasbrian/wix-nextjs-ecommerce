export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title skeleton */}
      <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="border rounded-lg overflow-hidden">
            {/* Image skeleton */}
            <div className="h-64 bg-gray-200 animate-pulse"></div>

            {/* Content skeleton */}
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
