// src/app/[slug]/page.tsx
import { Product } from '../types';
import { sampleProducts } from './productData';
import SinglePage from '@/components/SinglePage';

export default function Page({ params }: { params: { slug: string } }) {
  const product = sampleProducts.find(p => p.id === params.slug);

  if (!product) {
    return (
      <div className="p-4 text-red-500">
        Product not found
      </div>
    );
  }

  return <SinglePage product={product} />;
}