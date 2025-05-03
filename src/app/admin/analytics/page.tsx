'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  DollarSign,
  ShoppingCart,
  Eye,
  Users,
  ShoppingBag,
} from 'lucide-react';
import { redirect } from 'next/navigation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Interface for vendor summary
interface VendorSummary {
  id: string;
  name: string;
  email: string;
  totalRevenue: number;
  totalSales: number;
  productViews: number;
  conversionRate: number;
}

// Interface for platform summary
interface PlatformSummary {
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalProductViews: number;
  totalCartAdds: number;
  totalUsers: number;
  averageOrderValue: number;
  platformConversionRate: number;
}

const AdminAnalyticsPage = () => {
  const { data: session, status } = useSession();
  const [platformData, setPlatformData] = useState<PlatformSummary>({
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProductViews: 0,
    totalCartAdds: 0,
    totalUsers: 0,
    averageOrderValue: 0,
    platformConversionRate: 0,
  });
  const [vendorData, setVendorData] = useState<VendorSummary[]>([]);
  const [revenueTimeSeries, setRevenueTimeSeries] = useState<{
    dates: string[];
    values: number[];
  }>({ dates: [], values: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'vendors' | 'products'
  >('overview');

  // Redirect if not admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      redirect('/');
    }
  }, [session, status]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAdminAnalytics = async () => {
      if (status !== 'authenticated') return;

      setIsLoading(true);
      try {
        // Fetch platform-wide analytics
        const response = await fetch(
          `/api/admin/analytics?timeframe=${timeframe}`
        );
        if (!response.ok) throw new Error('Failed to fetch analytics');

        const data = await response.json();

        // Set platform summary data
        setPlatformData({
          totalVendors: data.totalVendors || 0,
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          totalProductViews: data.totalProductViews || 0,
          totalCartAdds: data.totalCartAdds || 0,
          totalUsers: data.totalUsers || 0,
          averageOrderValue: data.averageOrderValue || 0,
          platformConversionRate: data.platformConversionRate || 0,
        });

        // Set vendor summary data
        if (data.vendorSummaries) {
          setVendorData(data.vendorSummaries);
        }

        // Set revenue time series
        if (data.revenueTimeSeries) {
          setRevenueTimeSeries({
            dates: data.revenueTimeSeries.dates || [],
            values: data.revenueTimeSeries.values || [],
          });
        }
      } catch (error) {
        console.error('Error fetching admin analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminAnalytics();
  }, [timeframe, session, status]);

  // Create vendor performance chart
  const vendorPerformanceData = {
    labels: vendorData.slice(0, 5).map((vendor) => vendor.name || vendor.email),
    datasets: [
      {
        label: 'Revenue',
        data: vendorData.slice(0, 5).map((vendor) => vendor.totalRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Sales',
        data: vendorData.slice(0, 5).map((vendor) => vendor.totalSales),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  // Create revenue over time chart
  const revenueChartData = {
    labels: revenueTimeSeries.dates,
    datasets: [
      {
        label: 'Revenue',
        data: revenueTimeSeries.values,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Create conversion funnel chart
  const funnelChartData = {
    labels: ['Product Views', 'Added to Cart', 'Purchased'],
    datasets: [
      {
        data: [
          platformData.totalProductViews,
          platformData.totalCartAdds,
          platformData.totalOrders,
        ],
        backgroundColor: [
          'rgba(53, 162, 235, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgb(53, 162, 235)',
          'rgb(255, 159, 64)',
          'rgb(75, 192, 192)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Create vendor distribution chart
  const vendorDistributionData = {
    labels: vendorData.slice(0, 5).map((vendor) => vendor.name || vendor.email),
    datasets: [
      {
        data: vendorData.slice(0, 5).map((vendor) => vendor.totalRevenue),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Platform Analytics Dashboard</h1>

      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div className="text-sm text-gray-500">
          Admin view: platform-wide analytics
        </div>

        <div className="flex gap-6">
          {/* Timeframe selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 rounded ${
                timeframe === 'week'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded ${
                timeframe === 'month'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 rounded ${
                timeframe === 'year'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Year
            </button>
          </div>

          {/* Tab selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded ${
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-3 py-1 rounded ${
                activeTab === 'vendors'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Vendors
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1 rounded ${
                activeTab === 'products'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Products
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <p className="ml-2">Loading platform analytics...</p>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mr-4">
                      <DollarSign className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Revenue
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        ${platformData.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full mr-4">
                      <ShoppingBag className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Orders
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {platformData.totalOrders.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mr-4">
                      <Eye className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Product Views
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {platformData.totalProductViews.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full mr-4">
                      <Users className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Users
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {platformData.totalUsers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Revenue Over Time
                  </h3>
                  <div className="h-64">
                    <Line
                      data={revenueChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Conversion Funnel
                  </h3>
                  <div className="h-64">
                    <Doughnut
                      data={funnelChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Platform Stats</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Vendors
                      </span>
                      <span className="font-medium">
                        {platformData.totalVendors}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Products
                      </span>
                      <span className="font-medium">
                        {platformData.totalProducts}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Avg. Order Value
                      </span>
                      <span className="font-medium">
                        ${platformData.averageOrderValue.toFixed(2)}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Conversion Rate
                      </span>
                      <span className="font-medium">
                        {(platformData.platformConversionRate * 100).toFixed(2)}
                        %
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-1 text-orange-500" />
                        Cart Additions
                      </span>
                      <span className="font-medium">
                        {platformData.totalCartAdds.toLocaleString()}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 col-span-3">
                  <h3 className="text-lg font-semibold mb-4">
                    Top Vendor Performance
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={vendorPerformanceData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Vendors Tab */}
          {activeTab === 'vendors' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Revenue Distribution
                  </h3>
                  <div className="h-64">
                    <Pie
                      data={vendorDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Vendor Conversion Rates
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: vendorData
                          .slice(0, 5)
                          .map((v) => v.name || v.email),
                        datasets: [
                          {
                            label: 'Conversion Rate (%)',
                            data: vendorData
                              .slice(0, 5)
                              .map((v) => v.conversionRate * 100),
                            backgroundColor: 'rgba(255, 159, 64, 0.5)',
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Conversion Rate (%)',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Vendor Performance
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Vendor
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Revenue
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Orders
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Views
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Conv. Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {vendorData.map((vendor) => (
                        <tr key={vendor.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {vendor.name || vendor.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            ${vendor.totalRevenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            {vendor.totalSales.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            {vendor.productViews.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            {(vendor.conversionRate * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Products Tab - Similar structure to Vendors tab but with product data */}
          {activeTab === 'products' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Product Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed product analytics can be implemented here, showing
                top-selling products across all vendors, product views,
                conversion rates, and other relevant metrics.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
