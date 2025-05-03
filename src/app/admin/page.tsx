'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  BarChart2,
  ArrowRight,
  Users,
  ShoppingBag,
  Settings,
} from 'lucide-react'; // Add Users, ShoppingBag, and Settings
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
            <h2 className="font-semibold mb-2">User Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
            <h2 className="font-semibold mb-2">System Settings</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Configure system preferences
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                <BarChart2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Analytics & Insights
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  View platform-wide data, vendor performance, and sales metrics
                </p>
                <div className="mt-4">
                  <Link
                    href="/admin/analytics"
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View Analytics Dashboard
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {session?.user?.role === 'ADMIN' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-500 mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    User Management
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage users, vendors, and permissions
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/admin/users"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Manage Users
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-500 mr-4">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Product Management
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage products, categories, and inventory
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/admin/products"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Manage Products
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-500 mr-4">
                  <Settings size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    System Settings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure platform settings and preferences
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/admin/settings"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Manage Settings
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
