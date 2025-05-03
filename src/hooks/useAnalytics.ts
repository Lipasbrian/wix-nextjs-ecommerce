import { useState, useEffect } from 'react';
import type { VendorAnalytics, AnalyticsError } from '@/types/analytics';

interface AnalyticsState {
  data: VendorAnalytics | null;
  error: AnalyticsError | null;
  loading: boolean;
}

export function useAnalytics(vendorId: string): AnalyticsState {
  const [state, setState] = useState<AnalyticsState>({
    data: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics?vendorId=${vendorId}`);
        const data = await response.json();

        if (!response.ok) {
          setState({ data: null, error: data as AnalyticsError, loading: false });
          return;
        }

        setState({ data: data as VendorAnalytics, error: null, loading: false });
      } catch (err) { // Changed from error to err
        console.error('Analytics error:', err);
        setState({
          data: null,
          error: {
            error: err instanceof Error ? err.message : 'Failed to fetch analytics'
          },
          loading: false
        });
      }
    };

    fetchAnalytics();
  }, [vendorId]);

  return state;
}
