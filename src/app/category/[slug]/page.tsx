import { notFound } from "next/navigation";
import ProductList from "@/components/ProductList";
import ProductFilter from "@/components/ProductFilter";
import Pagination from "@/components/Pagination";
import { getProductsByCategory } from "@/app/lib/products";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return {
    title: `${categoryName} - Your Store Name`,
    description: `Browse our collection of ${categoryName.toLowerCase()} products.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get the category slug from the URL
  const { slug } = params;

  // Get pagination and sort parameters
  const page =
    typeof searchParams.page === "string"
      ? parseInt(searchParams.page) || 1
      : 1;
  const sortBy =
    typeof searchParams.sort === "string" ? searchParams.sort : "default";
  const pageSize = 6; // Products per page

  // Fetch all products for this category
  const allProducts = await getProductsByCategory(slug);

  // If no products are found, show the 404 page
  if (!allProducts || allProducts.length === 0) {
    notFound();
  }

  // Apply sorting
  const sortedProducts = [...allProducts];
  if (sortBy !== "default") {
    sortedProducts.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }

  // Apply pagination
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  // Determine category name based on slug (or fetch from DB)
  const getCategoryName = (slug: string) => {
    const formattedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
    return formattedSlug.replace(/-/g, " ");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{getCategoryName(slug)}</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <p className="text-gray-600 mb-2 md:mb-0">
          Showing {totalProducts > 0 ? startIndex + 1 : 0}-
          {Math.min(startIndex + pageSize, totalProducts)} of {totalProducts}{" "}
          products
        </p>

        {/* Add the ProductFilter component */}
        <ProductFilter categorySlug={slug} />
      </div>

      {/* Display products */}
      <ProductList products={paginatedProducts} />

      {/* Add pagination if there's more than one page */}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
