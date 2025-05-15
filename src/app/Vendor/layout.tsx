'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'VENDOR') {
      router.push('/dashboard');
    }
  }, [session, router, status]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'authenticated' && session.user.role === 'VENDOR') {
    return (
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 bg-gray-800 text-white p-4 md:min-h-screen">
          <h2 className="text-xl font-bold mb-6">Vendor Dashboard</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/vendor/dashboard"
                  className="block py-2 px-3 rounded hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/products"
                  className="block py-2 px-3 rounded hover:bg-gray-700"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/orders"
                  className="block py-2 px-3 rounded hover:bg-gray-700"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/analytics"
                  className="block py-2 px-3 rounded hover:bg-gray-700 bg-gray-700"
                >
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/settings"
                  className="block py-2 px-3 rounded hover:bg-gray-700"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return null;
}
