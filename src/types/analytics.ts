/**
 * Represents analytics data for a vendor
 */
export interface VendorAnalytics {
  /** Unique identifier for the vendor */
  vendorId: string;
  /** Number of times vendor's content was viewed */
  impressions: number;
  /** Number of clicks on vendor's content */
  clicks: number;
  /** Click-through rate (clicks/impressions) */
  ctr: number;
  /** Last time analytics were updated */
  lastUpdated?: Date;
}

export type AnalyticsError = {
  /** Error message */
  error: string;
  /** Additional error details (only in development) */
  details?: string;
};
