// app/vendor/analytics/page.tsx
'use client'
import { useVendorAnalytics } from '@/hooks/useAnalytics'

export default function AnalyticsDashboard() {
  const { data, loading, error } = useVendorAnalytics()

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Advertisement Analytics</h1>
        <p>Loading analytics data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Advertisement Analytics</h1>
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Advertisement Analytics</h1>
        <p>No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Advertisement Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Impressions</h3>
          <p className="text-3xl">{data.impressions.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Clicks</h3>
          <p className="text-3xl">{data.clicks.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">CTR</h3>
          <p className="text-3xl">{data.ctr.toFixed(2)}%</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
        <div className="h-64 bg-gray-100 flex items-center justify-center">
          Chart Visualization Area
        </div>
      </div>
    </div>
  )
}