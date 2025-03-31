import { NextResponse } from 'next/server'
import { connectToDB } from '@/app/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vendorId = searchParams.get('vendorId')
  
  try {
    const db = await connectToDB()
    const analytics = await db.collection('vendor_analytics')
      .findOne({ vendorId })
    
    return NextResponse.json(analytics || {
      impressions: 0,
      clicks: 0,
      ctr: 0
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}