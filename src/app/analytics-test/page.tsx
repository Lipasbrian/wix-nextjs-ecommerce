'use client';

import { useState, useEffect } from 'react';
import { trackEvent, EventTypes } from '@/lib/analytics';

// Define types for products and vendors
interface Product {
  id: string;
  name: string;
  price?: number;
  description?: string;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
}

export default function AnalyticsTestPage() {
  const [productId, setProductId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [eventType, setEventType] = useState(EventTypes.VIEW_PRODUCT);
  const [status, setStatus] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Load sample products and vendors
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load samples via API to avoid server component issues
        const productsRes = await fetch('/api/products?limit=5');
        const productsData = await productsRes.json();
        setProducts(productsData);

        if (productsData.length > 0) {
          setProductId(productsData[0].id);
        }

        const vendorsRes = await fetch('/api/admin/users?role=VENDOR&limit=5');
        const vendorsData = await vendorsRes.json();
        setVendors(vendorsData);

        if (vendorsData.length > 0) {
          setVendorId(vendorsData[0].id);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';

        console.error('Failed to load data:', errorMessage);
        setStatus(`Error loading data: ${errorMessage}`);
      }
    };

    loadData();
  }, []);

  const handleTrackEvent = async () => {
    setStatus('Sending event...');

    if (!productId) {
      setStatus('Error: Product ID is required');
      return;
    }

    if (!vendorId) {
      setStatus('Error: Vendor ID is required');
      return;
    }

    try {
      const result = await trackEvent(eventType, productId, vendorId);

      if (result) {
        setStatus('Event tracked successfully!');
      } else {
        setStatus('Failed to track event.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';

      setStatus(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Testing Page</h1>

      <div className="bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label className="block mb-2">Event Type:</label>
          <select
            className="w-full border p-2 rounded"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            {Object.entries(EventTypes).map(([key, value]) => (
              <option key={key} value={value}>
                {key}: {value}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Product:</label>
          <select
            className="w-full border p-2 rounded"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2">Vendor:</label>
          <select
            className="w-full border p-2 rounded"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
          >
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name} ({vendor.email})
              </option>
            ))}
          </select>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleTrackEvent}
        >
          Track Event
        </button>

        {status && (
          <div
            className={`mt-4 p-3 rounded ${
              status.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
