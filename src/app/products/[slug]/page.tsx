// src/app/[slug]/page.tsx
import { Product } from "../../types";
import { sampleProducts } from "./productData";
import SinglePage from "@/components/SinglePage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = sampleProducts.find((p) => p.id === slug);

  if (!product) {
    return <div className="p-4 text-red-500">Product not found {slug}</div>;
  }

  return <SinglePage product={product} />;
}
