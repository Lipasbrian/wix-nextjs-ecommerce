import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  try {
    const ads = await prisma.ad.findMany();
    return NextResponse.json(ads);
  } catch (err) {
    console.error('Failed to fetch ads:', err);
    return NextResponse.json(
      { error: 'Failed to fetch ads data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const ad = await prisma.ad.create({ data });
    return NextResponse.json(ad);
  } catch (err) {
    console.error('Failed to create ad:', err);
    return NextResponse.json(
      { error: 'Failed to create ad' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const ad = await prisma.ad.update({
      where: { id },
      data
    });
    return NextResponse.json(ad);
  } catch (err) {
    console.error('Failed to update ad:', err);
    return NextResponse.json(
      { error: 'Failed to update ad' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.ad.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete ad:', err);
    return NextResponse.json(
      { error: 'Failed to delete ad' },
      { status: 500 }
    );
  }
}