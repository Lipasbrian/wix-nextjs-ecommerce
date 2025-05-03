// src/app/[slug]/page.tsx
import type { Product } from '../../types';
import { sampleProducts } from './productData';
import SinglePage from '@/components/SinglePage';

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // Type annotation to use the Product type
  const product: Product | undefined = sampleProducts.find(
    (p) => p.id === slug
  );

  if (!product) {
    return <div className="p-4 text-red-500">Product not found {slug}</div>;
  }

  // Pass product to client component for event tracking
  return <SinglePage product={product} />;
}
