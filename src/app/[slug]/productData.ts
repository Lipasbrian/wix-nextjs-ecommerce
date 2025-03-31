import { Product } from '@/app/types';

export const sampleProducts: Product[] = [
  {
    id: "running-shoes",
    name: "Premium Running Shoes",
    price: 4500,
    description: "Lightweight performance shoes",
    images: ["/shoes/main.jpg", "/shoes/hover.jpg"],
    details: [
      { title: "Material", content: "Breathable mesh" },
      { title: "Sizes", content: "38-45" }
    ]
  }
];