import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { VendorAnalytics, AnalyticsError } from "@/types/analytics";
import { getServerSession } from "next-auth";  // Changed from @auth/nextjs
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/analytics
 * Fetches analytics data for a specific vendor
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      const error: AnalyticsError = {
        error: 'Vendor ID is required',
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Query VendorAnalytics instead of Analytics
    const analyticsData = await prisma.vendorAnalytics.findFirst({
      where: {
        vendorId: vendorId
      },
      orderBy: {
        date: 'desc'
      }
    });

    if (!analyticsData) {
      return NextResponse.json({ error: 'No analytics found' }, { status: 404 });
    }

    // Transform to match your VendorAnalytics type
    const response: VendorAnalytics = {
      vendorId: analyticsData.vendorId,
      impressions: analyticsData.impressions,
      clicks: analyticsData.clicks,
      ctr: analyticsData.ctr,
      revenue: analyticsData.revenue,
      lastUpdated: analyticsData.date,
      // Add aggregated data
      daily: await getAggregatedData(vendorId, 'day'),
      weekly: await getAggregatedData(vendorId, 'week'),
      monthly: await getAggregatedData(vendorId, 'month')
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    const analyticsError: AnalyticsError = {
      error: 'Failed to fetch analytics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
    return NextResponse.json(analyticsError, { status: 500 });
  }
}

async function getAggregatedData(vendorId: string, timeframe: 'day' | 'week' | 'month') {
  const dateFilter = {
    day: new Date(Date.now() - 24 * 60 * 60 * 1000),
    week: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    month: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  };

  const aggregated = await prisma.vendorAnalytics.aggregate({
    where: {
      vendorId,
      date: {
        gte: dateFilter[timeframe]
      }
    },
    _sum: {
      impressions: true,
      clicks: true,
      revenue: true
    }
  });

  const sum = aggregated._sum;
  return {
    impressions: sum.impressions || 0,
    clicks: sum.clicks || 0,
    revenue: sum.revenue || 0,
    ctr: sum.clicks && sum.impressions ? (sum.clicks / sum.impressions) * 100 : 0
  };
}

// Helper function to predict future values using linear regression
function predictLinearTrend(data: number[]): number {
  if (data.length < 2) return data[0] || 0;

  // Simple linear regression
  const n = data.length;
  const indices = Array.from({ length: n }, (_, i) => i);

  // Calculate means
  const meanX = indices.reduce((sum, x) => sum + x, 0) / n;
  const meanY = data.reduce((sum, y) => sum + y, 0) / n;

  // Calculate slope (m) and y-intercept (b)
  const numerator = indices.reduce((sum, x, i) => sum + (x - meanX) * (data[i] - meanY), 0);
  const denominator = indices.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0);

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;

  // Predict next value
  return intercept + slope * n;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isLimited, remaining, resetAt } = rateLimit(session.user.id);
    if (isLimited) {
      return new NextResponse("Too many requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": MAX_REQUESTS_PER_MINUTE.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": resetAt.toString()
        }
      });
    }

    const body = await request.json();
    const { impressions, clicks, timeframe } = body;

    // Generate forecasts
    const forecastedImpressions = Math.round(predictLinearTrend(impressions));
    const forecastedClicks = Math.round(predictLinearTrend(clicks));
    const forecastedCTR = forecastedImpressions > 0
      ? (forecastedClicks / forecastedImpressions) * 100
      : 0;

    // Generate insights
    let insights = "";

    // Trend analysis
    const impressionsTrend = impressions[impressions.length - 1] > impressions[0] ? "increasing" : "decreasing";
    const clicksTrend = clicks[clicks.length - 1] > clicks[0] ? "increasing" : "decreasing";

    insights += `Based on your ${timeframe} data, your impressions are ${impressionsTrend} and clicks are ${clicksTrend}. `;

    // Performance insights
    const avgCTR: number = impressions.reduce((sum: number, imp: number, i: number) => sum + (imp > 0 ? (clicks[i] / imp) : 0), 0) / impressions.length * 100;

    if (avgCTR < 1) {
      insights += `Your click-through rate is below average (${avgCTR.toFixed(2)}%). Consider improving your product descriptions or images. `;
    } else if (avgCTR > 3) {
      insights += `Your click-through rate is excellent (${avgCTR.toFixed(2)}%)! Your products are engaging customers effectively. `;
    } else {
      insights += `Your click-through rate is average (${avgCTR.toFixed(2)}%). There's room for improvement in your product visibility. `;
    }

    // Recommendations
    insights += "AI recommends: ";

    if (impressions.reduce((sum: number, val: number) => sum + val, 0) < 1000) {
      insights += "Consider increasing your product visibility through promotions. ";
    }

    if (clicksTrend === "decreasing") {
      insights += "Review your product listings to make them more appealing. ";
    }

    return NextResponse.json({
      forecast: {
        impressions: forecastedImpressions,
        clicks: forecastedClicks,
        ctr: forecastedCTR
      },
      insights
    });
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return new NextResponse("Error generating insights", { status: 500 });
  }
}

// Add this improved rate limit implementation
const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10;
const ratelimits = new Map();

function rateLimit(identifier: string) {
  const now = Date.now();

  const userRateLimit = ratelimits.get(identifier) || {
    count: 0,
    resetAt: now + RATE_LIMIT_DURATION
  };

  // Reset if window has passed
  if (now > userRateLimit.resetAt) {
    userRateLimit.count = 0;
    userRateLimit.resetAt = now + RATE_LIMIT_DURATION;
  }

  userRateLimit.count += 1;
  ratelimits.set(identifier, userRateLimit);

  return {
    isLimited: userRateLimit.count > MAX_REQUESTS_PER_MINUTE,
    remaining: Math.max(0, MAX_REQUESTS_PER_MINUTE - userRateLimit.count),
    resetAt: userRateLimit.resetAt
  };
}

