/**
 * Represents analytics data for a vendor
 */
export interface VendorAnalytics {
  id?: string;
  /** Unique identifier for the vendor */
  vendorId: string;
  date?: Date;
  /** Number of times vendor's content was viewed */
  impressions: number;
  /** Number of clicks on vendor's content */
  clicks: number;
  /** Click-through rate (clicks/impressions) */
  ctr: number;
  revenue?: number;
  /** Last time analytics were updated */
  lastUpdated?: Date;
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
