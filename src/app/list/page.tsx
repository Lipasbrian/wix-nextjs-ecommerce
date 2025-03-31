'use client'
import { useSearchParams } from 'next/navigation'
import Filter from "@/components/Filter"
import ProductList from "@/components/ProductList"
import Image from "next/image"
import { useTheme } from '@/app/Context/Theme/ThemeContext'

const ListPage = () => {
  const searchParams = useSearchParams()
  const query = searchParams?.get('query')?.toLowerCase() || ''
  const { theme } = useTheme()

  const allProducts = [
    {
      id: "1",
      name: "Running Shoes",
      price: "Ksh 4500",
      description: "Premium comfort",
      href: "/product/1",
      images: {
        primary: "https://www.runnersworld.com/gear/a26028922/running-shoes-for-men/",
        hover: "https://www.runnersworld.com/gear/a26028922/running-shoes-for-men/"
      }
    },
    {
      id: "2", 
      name: "Formal shoes",
      price: "Ksh 4500",
      description: "Taekwood Leathers",
      href: "/product/2",
      images: {
        primary: "https://teakwoodleathers.com/products/men-black-solid-genuine-leather-formal-loafers-1",
        hover: "https://teakwoodleathers.com/products/men-black-solid-genuine-leather-formal-loafers-1"
      }
    },
  ]

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(query)
  )

  return (
    <div className={`px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-white dark:bg-gray-900`}>
      {/* Campaign Banner - Fixed colors */}
      <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on <br/> Selected Products
          </h1>
          <button className="rounded-3xl bg-lama text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* Theme-aware content */}
      <div className="text-gray-900 dark:text-gray-100">
        {query && filteredProducts.length === 0 ? (
          <div className="mt-8 p-4 rounded-lg bg-red-50 dark:bg-gray-800">
            <p className="text-red-600 dark:text-red-300">
              No results found for <span className="font-semibold">"{query}"</span>
            </p>
          </div>
        ) : (
          <h1 className="mt-12 text-xl font-semibold">
            {query ? `Results for "${query}"` : "Shoes for You!"}
          </h1>
        )}
      </div>

      <Filter />
      <ProductList products={filteredProducts} />
    </div>
  )
}

export default ListPage