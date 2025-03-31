// src/components/SinglePage.tsx
import { Product, ProductDetail } from '@/app/types'; // Import both interfaces
import Add from "@/components/Cart";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";

interface Props {
  product: Product;
}

const SinglePage = ({ product }: Props) => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 relative flex flex-col lg:flex-row gap-16 mb-12">
      {/* IMG */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages images={product.images} />
      </div>

      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        {/* ... other product fields ... */}

        {product.details.map((detail: ProductDetail, index: number) => (
          <div key={index} className="text-sm">
            <h4 className="font-medium mb-4">{detail.title}</h4>
            <p>{detail.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePage;