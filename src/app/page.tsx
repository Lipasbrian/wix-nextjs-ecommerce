import CatergoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Slider from "@/components/Slides";
import AdPreview from "@/components/AdPreview";
import { Product } from "@/app/types";
import { getFeaturedProducts, getNewArrivals } from "@/app/lib/products";

export default async function Home() {
  // Fetch products using the functions we created
  const featuredProducts = await getFeaturedProducts();
  const newArrivals = await getNewArrivals();

  const ad = [
    {
      title: "Quality Swords",
      description: "Shinobi sword",
      image: "/bb.png",
      targetLocation: "Japan",
      budget: 1000,
    },
    {
      title: "Samurai Armor",
      description: "Battle-ready replicas",
      image: "/armor.png",
      targetLocation: "Kyoto",
      budget: 2500,
    },
    {
      title: "Ninja Gear",
      description: "Professional stealth equipment",
      image: "/buze.png",
      targetLocation: "Tokyo",
      budget: 1500,
    },
    {
      title: "Traditional Katanas",
      description: "Master-crafted swords",
      image: "/katana.png",
      targetLocation: "Osaka",
      budget: 3000,
    },
  ];

  return (
    <div className="min-h-screen">
      <Slider />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
        <ProductList products={featuredProducts} />
      </div>

      <div className="mt-24">
        <h2 className="text-2xl font-bold px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12">
          Categories
        </h2>
        <CatergoryList />
      </div>

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h2 className="text-2xl font-bold mb-8">New Arrivals</h2>
        <ProductList products={newArrivals} />
      </div>

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative pb-8">
        <h2 className="text-2xl font-bold mb-8">Special Offers</h2>
        <AdPreview ad={ad} />
      </div>
    </div>
  );
}
