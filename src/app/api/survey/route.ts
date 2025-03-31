import { NextResponse } from 'next/server'
import { connectToDB } from '@/app/lib/db'

export async function POST(request: Request) {
  const data = await request.json()
  
  try {
    const db = await connectToDB()
    await db.collection('vendor_surveys').insertOne({
      ...data,
      createdAt: new Date(),
      processed: false
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit survey' },
      { status: 500 }
    )
  }
}