import { NextResponse } from 'next/server'
import { prisma } from "@/app/lib/prisma"

export async function POST(request: Request) {
  const data = await request.json()

  try {
    await prisma.vendorSurvey.create({
      data: {
        ...data,
        createdAt: new Date(),
        processed: false
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      { message: 'Failed to submit survey' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request) {
  try {
    // ...existing code...
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}