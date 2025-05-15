import { Product } from '@/app/types';

export const sampleProducts: Product[] = [
  {
    id: "running-shoes",
    name: "Premium Running Shoes",
    price: 4500,
    description: "Lightweight performance shoes",
    stock: 10, // Add required stock field
    images: {
      main: "/shoes/main.jpg",
      hover: "/shoes/hover.jpg"
    }, // Change from array to object with named keys
    details: [
      { title: "Material", content: "Breathable mesh" },
      { title: "Sizes", content: "38-45" }
    ]
  }
];