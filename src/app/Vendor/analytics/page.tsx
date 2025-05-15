'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  impressions: number;
  clicks: number;
  ctr: number;
  revenue: number;
  date?: Date;
}

interface AggregatedData {
  daily: AnalyticsData;
  weekly: AnalyticsData;
  monthly: AnalyticsData;
}

interface AnalyticsInsights {
  trends: {
    impressions: string;
    clicks: string;
    revenue: string;
  };
  forecast: {
    impressions: number;
    clicks: number;
    revenue: number;
  };
  insights: string;
}

export default function VendorAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AggregatedData | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsights | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Authorization check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'VENDOR') {
      router.push('/dashboard');
    }
  }, [session, router, status]);

  // Fetch analytics data
  useEffect(() => {
    async function fetchAnalytics() {
      if (status !== 'authenticated' || session.user.role !== 'VENDOR') return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const analyticsData = await response.json();
        setData(analyticsData);

        // Fetch insights
        const insightsResponse = await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ timeframe: 'week' }),
        });

        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          setInsights(insightsData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load analytics'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [session, status]);

  // Prepare chart data
  const getChartData = (): ChartData<'line'> => {
    // This is a placeholder - in a real implementation you would have time series data
    // For now we'll just use some basic data based on the aggregates
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Impressions',
          data: [
            data?.[timeframe]?.impressions
              ? data[timeframe].impressions / 7
              : 0,
            data?.[timeframe]?.impressions
              ? data[timeframe].impressions / 6
              : 0,
            data?.[timeframe]?.impressions
              ? data[timeframe].impressions / 5
              : 0,
            data?.[timeframe]?.impressions
              ? data[timeframe].impressions / 4
              : 0,
            data?.[timeframe]?.impressions
              ? data[timeframe].impressions / 3
              : 0,
            data?.[timeframe]?.impressions
              ? data[timeframe].impressions / 2
              : 0,
            data?.[timeframe]?.impressions ? data[timeframe].impressions : 0,
          ],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Clicks',
          data: [
            data?.[timeframe]?.clicks ? data[timeframe].clicks / 7 : 0,
            data?.[timeframe]?.clicks ? data[timeframe].clicks / 6 : 0,
            data?.[timeframe]?.clicks ? data[timeframe].clicks / 5 : 0,
            data?.[timeframe]?.clicks ? data[timeframe].clicks / 4 : 0,
            data?.[timeframe]?.clicks ? data[timeframe].clicks / 3 : 0,
            data?.[timeframe]?.clicks ? data[timeframe].clicks / 2 : 0,
            data?.[timeframe]?.clicks ? data[timeframe].clicks : 0,
          ],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Vendor Analytics</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Analytics</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-6">{error}</div>
      )}

      <div className="mb-6">
        <div className="tabs">
          <button
            onClick={() => setTimeframe('daily')}
            className={`tab ${
              timeframe === 'daily' ? 'tab-active' : ''
            } mr-2 px-4 py-2 rounded-t-lg ${
              timeframe === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`tab ${
              timeframe === 'weekly' ? 'tab-active' : ''
            } mr-2 px-4 py-2 rounded-t-lg ${
              timeframe === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`tab ${
              timeframe === 'monthly' ? 'tab-active' : ''
            } px-4 py-2 rounded-t-lg ${
              timeframe === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Impressions
          </h3>
          <p className="text-3xl font-bold">
            {data?.[timeframe]?.impressions || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Clicks</h3>
          <p className="text-3xl font-bold">{data?.[timeframe]?.clicks || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-500 mb-2">CTR</h3>
          <p className="text-3xl font-bold">
            {data?.[timeframe]?.ctr?.toFixed(2) || 0}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Revenue</h3>
          <p className="text-3xl font-bold">
            ${data?.[timeframe]?.revenue?.toFixed(2) || 0}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
        <div className="h-64">{data && <Line data={getChartData()} />}</div>
      </div>

      {insights && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Current Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Impressions</p>
                <p
                  className={`font-medium ${
                    insights.trends.impressions === 'increasing'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {insights.trends.impressions === 'increasing'
                    ? '↑ Increasing'
                    : '↓ Decreasing'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Clicks</p>
                <p
                  className={`font-medium ${
                    insights.trends.clicks === 'increasing'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {insights.trends.clicks === 'increasing'
                    ? '↑ Increasing'
                    : '↓ Decreasing'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p
                  className={`font-medium ${
                    insights.trends.revenue === 'increasing'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {insights.trends.revenue === 'increasing'
                    ? '↑ Increasing'
                    : '↓ Decreasing'}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Forecast (Next 7 Days)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Impressions</p>
                <p className="font-medium">
                  {Math.round(insights.forecast.impressions)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Clicks</p>
                <p className="font-medium">
                  {Math.round(insights.forecast.clicks)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="font-medium">
                  ${insights.forecast.revenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Recommendations</h3>
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded">
              <p>{insights.insights}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
