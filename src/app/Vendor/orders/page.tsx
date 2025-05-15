'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function VendorOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');

  // Authorization check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'VENDOR') {
      router.push('/dashboard');
    }
  }, [session, router, status]);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      if (status !== 'authenticated' || session.user.role !== 'VENDOR') return;

      try {
        // This would be an actual API call in a real implementation
        // For now, we'll use placeholder data
        setOrders([
          {
            id: 'ord001',
            customer: { name: 'Alice Smith', email: 'alice@example.com' },
            date: '2025-05-08',
            total: 129.99,
            status: 'pending',
            items: [
              {
                id: 'itm1',
                name: 'Premium Headphones',
                quantity: 1,
                price: 129.99,
              },
            ],
          },
          {
            id: 'ord002',
            customer: { name: 'Bob Johnson', email: 'bob@example.com' },
            date: '2025-05-07',
            total: 169.97,
            status: 'processing',
            items: [
              { id: 'itm2', name: 'Wireless Mouse', quantity: 1, price: 39.99 },
              { id: 'itm3', name: 'USB-C Hub', quantity: 1, price: 49.99 },
              { id: 'itm4', name: 'Mousepad XL', quantity: 1, price: 79.99 },
            ],
          },
          {
            id: 'ord003',
            customer: { name: 'Carol Davis', email: 'carol@example.com' },
            date: '2025-05-06',
            total: 199.99,
            status: 'shipped',
            items: [
              { id: 'itm5', name: 'Smart Watch', quantity: 1, price: 199.99 },
            ],
          },
          {
            id: 'ord004',
            customer: { name: 'David Wilson', email: 'david@example.com' },
            date: '2025-05-05',
            total: 89.99,
            status: 'delivered',
            items: [
              {
                id: 'itm6',
                name: 'Mechanical Keyboard',
                quantity: 1,
                price: 89.99,
              },
            ],
          },
          {
            id: 'ord005',
            customer: { name: 'Eve Brown', email: 'eve@example.com' },
            date: '2025-05-04',
            total: 39.99,
            status: 'cancelled',
            items: [
              { id: 'itm7', name: 'Wireless Mouse', quantity: 1, price: 39.99 },
            ],
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [session, status]);

  // Filter orders
  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.status === filter);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-6">{error}</div>
      )}

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-2 rounded ${
              filter === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-3 py-2 rounded ${
              filter === 'processing'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`px-3 py-2 rounded ${
              filter === 'shipped'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-3 py-2 rounded ${
              filter === 'delivered'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-2 rounded ${
              filter === 'cancelled'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {order.date} • {order.customer.name} •{' '}
                      {order.customer.email}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center">
                    <StatusBadge status={order.status} />
                    <span className="font-medium ml-3">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-end">
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        Process Order
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">
                        Mark as Shipped
                      </button>
                    )}
                    {(order.status === 'pending' ||
                      order.status === 'processing') && (
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                        Cancel Order
                      </button>
                    )}
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No orders found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
