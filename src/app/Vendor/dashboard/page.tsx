'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  customer: string;
  amount: number;
  date: string;
  status: string;
}

export default function VendorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalProducts: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
  }>({
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [_orders, _setOrders] = useState<Order[]>([]);

  // Authorization check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'VENDOR') {
      router.push('/dashboard');
    }
  }, [session, router, status]);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      if (status !== 'authenticated' || session.user.role !== 'VENDOR') return;

      try {
        // These would be actual API calls in a real implementation
        // For now, we'll use placeholder data
        setStats({
          totalProducts: 12,
          pendingOrders: 5,
          totalRevenue: 2850.75,
          recentOrders: [
            {
              id: 'ord123',
              customer: 'John Doe',
              amount: 125.99,
              date: '2025-05-07',
              status: 'Delivered',
            },
            {
              id: 'ord124',
              customer: 'Jane Smith',
              amount: 89.5,
              date: '2025-05-07',
              status: 'Processing',
            },
            {
              id: 'ord125',
              customer: 'Bob Johnson',
              amount: 199.99,
              date: '2025-05-06',
              status: 'Shipped',
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [session, status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Total Products
          </h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
          <Link
            href="/vendor/products"
            className="text-blue-500 text-sm mt-2 block"
          >
            Manage Products →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Pending Orders
          </h3>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
          <Link
            href="/vendor/orders"
            className="text-blue-500 text-sm mt-2 block"
          >
            View Orders →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          <Link
            href="/vendor/analytics"
            className="text-blue-500 text-sm mt-2 block"
          >
            View Analytics →
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order: Order) => (
              <div
                key={order.id}
                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {order.customer} • {order.date}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <span
                    className={`px-2 py-1 rounded text-xs mr-3 ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-medium">
                    ${order.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No recent orders
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-right">
          <Link
            href="/vendor/orders"
            className="text-blue-500 hover:text-blue-700"
          >
            View all orders →
          </Link>
        </div>
      </div>
    </div>
  );
}
