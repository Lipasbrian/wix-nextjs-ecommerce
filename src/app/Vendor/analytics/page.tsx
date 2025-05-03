'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
import type { ChartData, ChartOptions } from 'chart.js';
import {
  DollarSign,
  ShoppingCart,
  Eye,
  MousePointer,
  ShoppingBag,
} from 'lucide-react';

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

// Existing TimeSeriesData interface
interface TimeSeriesData {
  impressions: number[];
  clicks: number[];
  ctr: number[];
  dates: string[];
}

// Existing AnalyticsItem interface
interface AnalyticsItem {
  impressions: number;
  clicks: number;
  ctr: number;
  date: string;
}

// Existing Forecast interface
interface Forecast {
  impressions: number;
  clicks: number;
  ctr: number;
}

// Add new interfaces for product analytics
interface ProductAnalytics {
  id: string;
  name: string;
  views: number;
  cartAdds: number;
  sales: number;
  revenue: number;
}

// Add new interfaces for ad analytics
interface AdAnalytics {
  id: string;
  title: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

// Define top selling product structure from API
interface TopSellingProduct {
  productId: string;
  name: string;
  views: number;
  cartAdds: number;
  totalSold: number;
  revenue: number;
}

// Define top performing ad structure from API
interface TopPerformingAd {
  adId: string;
  title: string;
  impressions: number;
  clicks: number;
  clickThroughRate: number;
}

// Existing ChartConfig interface
interface ChartConfig {
  data: ChartData<'line'>;
  options: ChartOptions<'line'>;
}

// The existing createChartConfig function
const createChartConfig = (data: TimeSeriesData): ChartConfig => {
  return {
    data: {
      labels: data.dates,
      datasets: [
        {
          label: 'Impressions',
          data: data.impressions,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Clicks',
          data: data.clicks,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'CTR',
          data: data.ctr,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: false,
        },
      },
    },
  };
};

const VendorAnalyticsPage: React.FC = () => {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<TimeSeriesData>({
    impressions: [],
    clicks: [],
    ctr: [],
    dates: [],
  });
  const [productData, setProductData] = useState<ProductAnalytics[]>([]);
  const [adData, setAdData] = useState<AdAnalytics[]>([]);
  const [overviewMetrics, setOverviewMetrics] = useState({
    totalImpressions: 0,
    totalClicks: 0,
    avgCTR: 0,
    totalViews: 0,
    totalCartAdds: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'ads'>(
    'overview'
  );
  const [timeframe, setTimeframe] = useState('week');
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [insightMessage, setInsightMessage] = useState('');

  // Keep your existing generateAIInsights function
  const generateAIInsights = useCallback(
    async (impressions: number[], clicks: number[], dates: string[]) => {
      if (impressions.length === 0) return;

      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            impressions,
            clicks,
            dates,
            timeframe,
          }),
        });

        if (!response.ok) throw new Error('Failed to generate insights');
        const data = await response.json();

        setForecast(data.forecast);
        setInsightMessage(data.insights);
      } catch (error) {
        console.error('Error generating insights:', error);
      }
    },
    [timeframe]
  );

  // Updated fetchAnalytics to get comprehensive data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Get original analytics data
        const response = await fetch(
          `/api/vendor/analytics?timeframe=${timeframe}`
        );
        if (!response.ok) throw new Error('Failed to fetch analytics');

        const data = (await response.json()) as AnalyticsItem[];

        // Set the original time series data
        const timeSeriesData = {
          impressions: data.map((item) => item.impressions),
          clicks: data.map((item) => item.clicks),
          ctr: data.map((item) => item.ctr),
          dates: data.map((item) => new Date(item.date).toLocaleDateString()),
        };
        setAnalyticsData(timeSeriesData);

        // Fetch extended analytics data
        const extendedResponse = await fetch(
          `/api/analytics?timeframe=${timeframe}`
        );
        if (extendedResponse.ok) {
          const extendedData = await extendedResponse.json();

          // Set product data
          if (extendedData.topSellingProducts) {
            setProductData(
              extendedData.topSellingProducts.map((p: TopSellingProduct) => ({
                id: p.productId,
                name: p.name,
                views: p.views || 0,
                cartAdds: p.cartAdds || 0,
                sales: p.totalSold || 0,
                revenue: p.revenue || 0,
              }))
            );
          }

          // Set ad data
          if (extendedData.topPerformingAds) {
            setAdData(
              extendedData.topPerformingAds.map((a: TopPerformingAd) => ({
                id: a.adId,
                title: a.title,
                impressions: a.impressions || 0,
                clicks: a.clicks || 0,
                ctr: a.clickThroughRate || 0,
              }))
            );
          }

          // Set overview metrics
          setOverviewMetrics({
            totalImpressions: extendedData.productViews || 0,
            totalClicks: extendedData.adClicks || 0,
            avgCTR: extendedData.conversionRate || 0,
            totalViews: extendedData.productViews || 0,
            totalCartAdds: extendedData.addToCartEvents || 0,
            totalSales: extendedData.totalOrders || 0,
            totalRevenue: extendedData.totalRevenue || 0,
          });
        }

        // After getting analytics data, fetch AI insights
        await generateAIInsights(
          timeSeriesData.impressions,
          timeSeriesData.clicks,
          timeSeriesData.dates
        );
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe, generateAIInsights]);

  const chartConfig = createChartConfig(analyticsData);

  // Create product performance chart
  const productChartData = {
    labels: productData.slice(0, 5).map((p) => p.name),
    datasets: [
      {
        label: 'Views',
        data: productData.slice(0, 5).map((p) => p.views),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Added to Cart',
        data: productData.slice(0, 5).map((p) => p.cartAdds),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
      {
        label: 'Sales',
        data: productData.slice(0, 5).map((p) => p.sales),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  // Create conversion funnel chart
  const funnelChartData = {
    labels: ['Product Views', 'Added to Cart', 'Purchased'],
    datasets: [
      {
        data: [
          overviewMetrics.totalViews,
          overviewMetrics.totalCartAdds,
          overviewMetrics.totalSales,
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Analytics Dashboard</h1>

      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div className="text-sm text-gray-500">
          Showing data for: {session?.user?.email}
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
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1 rounded ${
                activeTab === 'products'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-3 py-1 rounded ${
                activeTab === 'ads'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Ads
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <p className="ml-2">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Total Impressions
                  </h3>
                  <p className="text-3xl font-bold text-indigo-600">
                    {overviewMetrics.totalImpressions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-2">Total Clicks</h3>
                  <p className="text-3xl font-bold text-emerald-600">
                    {overviewMetrics.totalClicks.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-2">Average CTR</h3>
                  <p className="text-3xl font-bold text-amber-600">
                    {(overviewMetrics.avgCTR * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Metrics Over Time
                  </h3>
                  <div className="h-64">
                    <Line
                      options={chartConfig.options}
                      data={chartConfig.data}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Customer Journey
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

              {/* AI Insights Section */}
              {insightMessage && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-indigo-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold">
                      AI-Generated Insights
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {insightMessage}
                  </p>

                  {forecast && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">
                        Forecasted Next 7 Days:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                          <p className="text-sm text-gray-500">
                            Expected Impressions
                          </p>
                          <p className="font-semibold">
                            {forecast.impressions}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                          <p className="text-sm text-gray-500">
                            Expected Clicks
                          </p>
                          <p className="font-semibold">{forecast.clicks}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                          <p className="text-sm text-gray-500">Expected CTR</p>
                          <p className="font-semibold">
                            {forecast.ctr.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
                        {overviewMetrics.totalViews.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-full mr-4">
                      <ShoppingCart className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Cart Additions
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {overviewMetrics.totalCartAdds.toLocaleString()}
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
                        Total Sales
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {overviewMetrics.totalSales.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full mr-4">
                      <DollarSign className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Revenue
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        ${overviewMetrics.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Top Products Performance
                  </h3>
                  <div className="h-72">
                    <Bar
                      data={productChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                        scales: {
                          x: {
                            stacked: false,
                          },
                          y: {
                            stacked: false,
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Top Selling Products
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Product
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
                            Sales
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {productData.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                              {product.views.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                              {product.sales.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                              ${product.revenue.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Ads Tab */}
          {activeTab === 'ads' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mr-4">
                      <Eye className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Impressions
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {adData
                          .reduce((sum, ad) => sum + ad.impressions, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full mr-4">
                      <MousePointer className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Clicks
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {adData
                          .reduce((sum, ad) => sum + ad.clicks, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-full mr-4">
                      <svg
                        className="h-5 w-5 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Average CTR
                      </h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {adData.length > 0
                          ? (
                              (adData.reduce((sum, ad) => sum + ad.ctr, 0) /
                                adData.length) *
                              100
                            ).toFixed(2)
                          : '0.00'}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Ad Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Ad Title
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Impressions
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Clicks
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          CTR
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {adData.map((ad) => (
                        <tr key={ad.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {ad.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            {ad.impressions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            {ad.clicks.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            {(ad.ctr * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default VendorAnalyticsPage;
