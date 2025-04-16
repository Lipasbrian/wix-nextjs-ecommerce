"use client";

import { useVendorAnalytics } from "@/hooks/useAnalytics";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  impressions: number;
  clicks: number;
  ctr: number;
  timeSeriesData?: {
    date: string;
    impressions: number;
    clicks: number;
  }[];
}

export default function AnalyticsDashboard() {
  const { data, loading, error } = useVendorAnalytics();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (loading || isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Advertisement Analytics</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Advertisement Analytics</h1>
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Advertisement Analytics</h1>
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Advertisement Analytics</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-600">Impressions</h3>
          <p className="text-3xl font-bold mt-2">
            {data.impressions.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-600">Clicks</h3>
          <p className="text-3xl font-bold mt-2">
            {data.clicks.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-600">CTR</h3>
          <p className="text-3xl font-bold mt-2">{data.ctr.toFixed(2)}%</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Performance Over Time</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.timeSeriesData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                padding={{ left: 30, right: 30 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="impressions"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
