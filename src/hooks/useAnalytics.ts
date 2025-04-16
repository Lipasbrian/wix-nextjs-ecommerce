// hooks/useAnalytics.ts
import { useState, useEffect } from "react";

interface AnalyticsData {
  timeSeriesData: any[] | undefined;
  impressions: number;
  clicks: number;
  ctr: number;
}

export function useVendorAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/vendor/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
