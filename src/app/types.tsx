// src/app/types.tsx
export interface ProductDetail {
    title: string;
    content: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: string[]; // Array of image URLs
    details: ProductDetail[];
  }