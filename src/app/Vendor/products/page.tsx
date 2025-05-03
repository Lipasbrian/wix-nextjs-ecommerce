'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean; // Add active property
}

const emptyProduct = {
  id: '',
  name: '',
  description: '',
  price: 0,
  active: true, // Add default value
};

export default function VendorProductsPage() {
  const { data: _session } = useSession(); // Prefix unused session
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/vendor/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      // Rename error to err to use it
      const message =
        err instanceof Error ? err.message : 'Error fetching products';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentProduct) return;

    try {
      const response = await fetch('/api/vendor/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct),
      });

      if (!response.ok) throw new Error('Failed to save product');

      await fetchProducts();
      setIsEditing(false);
      setCurrentProduct(null);
      setShowForm(false);
      toast.success(
        `Product ${isEditing ? 'updated' : 'created'} successfully`
      );
    } catch (err) {
      // Rename error to err to use it
      const message =
        err instanceof Error
          ? err.message
          : `Error ${isEditing ? 'updating' : 'creating'} product`;
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/vendor/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((p) => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete product';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleProductUpdate = async (id: string, data: Partial<Product>) => {
    try {
      const response = await fetch(`/api/vendor/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Refresh products list
      const updatedProduct = await response.json();
      setProducts(products.map((p) => (p.id === id ? updatedProduct : p)));
      toast.success('Product updated successfully');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update product';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleAddNew = () => {
    setCurrentProduct({ ...emptyProduct });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentProduct(null);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <button
          onClick={handleAddNew}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Same form fields as admin product page */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven&apos;t added any products yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">${product.price}</p>
                  <p className="text-xs text-gray-500">
                    Status: {product.active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    onClick={() =>
                      handleProductUpdate(product.id, {
                        active: !product.active,
                      })
                    }
                  >
                    {product.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
    </div>
  );
}
