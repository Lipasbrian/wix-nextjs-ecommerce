"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

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
  impressions: number[];
  clicks: number[];
  ctr: number[];
  dates: string[];
}

interface Forecast {
  impressions: number;
  clicks: number;
  ctr: number;
}

export default function VendorAnalyticsPage() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    impressions: [],
    clicks: [],
    ctr: [],
    dates: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("week");
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [insightMessage, setInsightMessage] = useState("");

  const generateAIInsights = useCallback(
    async (impressions: number[], clicks: number[], dates: string[]) => {
      if (impressions.length === 0) return;

      try {
        const response = await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            impressions,
            clicks,
            dates,
            timeframe,
          }),
        });

        if (!response.ok) throw new Error("Failed to generate insights");
        const data = await response.json();

        setForecast(data.forecast);
        setInsightMessage(data.insights);
      } catch (error) {
        console.error("Error generating insights:", error);
      }
    },
    [timeframe]
  ); // timeframe is the only dependency

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/vendor/analytics?timeframe=${timeframe}`
        );
        if (!response.ok) throw new Error("Failed to fetch analytics");

        const data = await response.json();

        setAnalyticsData({
          impressions: data.map((item: any) => item.impressions),
          clicks: data.map((item: any) => item.clicks),
          ctr: data.map((item: any) => item.ctr),
          dates: data.map((item: any) =>
            new Date(item.date).toLocaleDateString()
          ),
        });

        // After getting analytics data, fetch AI insights
        await generateAIInsights(
          data.map((item: any) => item.impressions),
          data.map((item: any) => item.clicks),
          data.map((item: any) => new Date(item.date).toLocaleDateString())
        );
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe, generateAIInsights]); // Added generateAIInsights to dependency array

  const impressionsChartData = {
    labels: analyticsData.dates,
    datasets: [
      {
        label: "Impressions",
        data: analyticsData.impressions,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const clicksChartData = {
    labels: analyticsData.dates,
    datasets: [
      {
        label: "Clicks",
        data: analyticsData.clicks,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const calculateTotals = () => {
    const totalImpressions = analyticsData.impressions.reduce(
      (sum, val) => sum + val,
      0
    );
    const totalClicks = analyticsData.clicks.reduce((sum, val) => sum + val, 0);
    const avgCTR =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return { totalImpressions, totalClicks, avgCTR };
  };

  const { totalImpressions, totalClicks, avgCTR } = calculateTotals();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing data for: {session?.user?.email}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe("week")}
            className={`px-3 py-1 rounded ${
              timeframe === "week"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`px-3 py-1 rounded ${
              timeframe === "month"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe("year")}
            className={`px-3 py-1 rounded ${
              timeframe === "year"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Impressions</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {totalImpressions.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Clicks</h3>
              <p className="text-3xl font-bold text-emerald-600">
                {totalClicks.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Average CTR</h3>
              <p className="text-3xl font-bold text-amber-600">
                {avgCTR.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Impressions</h3>
              <div className="h-64">
                <Line options={chartOptions} data={impressionsChartData} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Clicks</h3>
              <div className="h-64">
                <Line options={chartOptions} data={clicksChartData} />
              </div>
            </div>
          </div>

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
                <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {insightMessage}
              </p>

              {forecast && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Forecasted Next 7 Days:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">
                        Expected Impressions
                      </p>
                      <p className="font-semibold">{forecast.impressions}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">Expected Clicks</p>
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
    </div>
  );
}
