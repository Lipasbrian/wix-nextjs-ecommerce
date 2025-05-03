/**
 * Represents analytics data for a vendor
 */
export interface VendorAnalytics {
  vendorId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  revenue: number;
  lastUpdated: Date;
  daily: AnalyticsData;
  weekly: AnalyticsData;
  monthly: AnalyticsData;
}

export interface AnalyticsError {
  /** Error message */
  error: string;
  /** Additional error details (only in development) */
  details?: string;
}

export interface AnalyticsForecast {
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface AnalyticsResponse {
  forecast: AnalyticsForecast;
  insights: string;
}

export interface AnalyticsData {
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Replace any with proper types
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Use instead of any
export type ApiData = Record<string, JsonValue>;
