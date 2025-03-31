// src/components/ProductImages.tsx
import Image from "next/image";

interface Props {
  images: string[];
}

const ProductImages = ({ images }: Props) => {
  return (
    <>
      <div className="relative w-full h-80">
        <Image
          src={images[0]}
          alt="Main product image"
          fill
          className="object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
        />
        {images[1] && (
          <Image
            src={images[1]}
            alt="Alternate product view"
            fill
            className="absolute object-cover rounded-md"
          />
        )}
      </div>
    </>
  );
};

export default ProductImages;
