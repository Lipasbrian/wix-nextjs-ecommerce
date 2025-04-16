"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Sign Out
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/profile"
          className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-center"
        >
          Profile Settings
        </Link>
        {session?.user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center"
          >
            Admin Dashboard
          </Link>
        )}
        {session?.user?.role === "VENDOR" && (
          <Link
            href="/vendor"
            className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-center"
          >
            Vendor Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
