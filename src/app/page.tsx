import CatergoryList from "@/components/CatergoryList";
import ProductList from "@/components/ProductList";
import Slider from "@/components/Slides";
import AdPreview from "@/components/AdPreview";

const HomePage = () => {
  const ad = {
    title: "Quality Swords",
    description: "Shinobi sword",
    image: "/bb.png", // or provide a valid image URL
    targetLocation: "Japan",
    budget: 1000,
  };
  const products = [
    {
      id: "1",
      name: "Product 1",
      price: "Ksh 1000",
      description: "Description of Product 1",
      images: {
        primary:
          "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
        hover:
          "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
      },
      href: "/product/1",
    },
    {
      id: "2",
      name: "Product 2",
      price: "Ksh 2000",
      description: "Description of Product 2",
      images: {
        primary:
          "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
        hover:
          "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
      },
      href: "/product/2",
    },
  ];
  return (
    <div className="">
      <Slider />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <ProductList products={products} />
      </div>

      <div className="mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 mb-12">
          Categories
        </h1>
        <CatergoryList />
      </div>

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <ProductList />
      </div>
      <div>
        <AdPreview ad={ad} />
      </div>
    </div>
  );
};

export default HomePage;
