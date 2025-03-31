import { NextResponse } from 'next/server'
import { connectToDB } from '@/app/lib/db'

export async function GET() {
  try {
    const db = await connectToDB()
    const ads = await db.collection('vendor_ads').find().toArray()
    return NextResponse.json(ads)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ads data' },
      { status: 500 }
    )
  }
}