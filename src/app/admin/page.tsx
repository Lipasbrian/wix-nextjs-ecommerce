"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
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
        </div>
      </div>
    </div>
  );
}
