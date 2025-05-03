'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardShell } from '@/components/dashboard/shell';
import { ProductsTable } from '@/components/admin/products-table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

// Define the Product type
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  // Add other properties as needed
}

export default function AdminProductsPage() {
  // Use the correct type for products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/admin/products');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          // Handle case where API returns object instead of array
          setProducts(data.products || []);
          console.error('Expected array but got:', data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
        // Initialize with empty array on error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [toast]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Product Management"
        text="View and manage all products in your store."
      >
        <Button>Add New Product</Button>
      </DashboardHeader>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading products...</span>
        </div>
      ) : // Check if products is an array before mapping
      Array.isArray(products) && products.length > 0 ? (
        <ProductsTable products={products} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
    </DashboardShell>
  );
}
