"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();

  const renderRoleSpecificContent = () => {
    switch (session?.user?.role) {
      case "ADMIN":
        return (
          <div className="grid gap-4">
            <Link
              href="/admin/users"
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              User Management
            </Link>
            <Link
              href="/admin/products"
              className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Product Management
            </Link>
          </div>
        );
      case "VENDOR":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/vendor/products"
              className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              My Products
            </Link>
            <Link
              href="/vendor/analytics"
              className="p-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Analytics Dashboard
            </Link>
          </div>
        );
      default:
        return (
          <div className="grid gap-4">
            <Link
              href="/profile"
              className="p-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Profile Settings
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome, {session?.user?.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full text-sm capitalize bg-gray-100">
            {session?.user?.role?.toLowerCase()}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {renderRoleSpecificContent()}
      </div>
    </div>
  );
}
