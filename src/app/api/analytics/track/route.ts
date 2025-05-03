import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
    try {
        // Parse the request body
        const body = await request.json();
        console.log("[Analytics] Received tracking request:", body);

        const { eventType, productId, vendorId, metadata } = body;

        // Add detailed validation messages
        if (!eventType) {
            console.log("[Analytics] Missing eventType");
            return NextResponse.json(
                { error: 'Event type is required' },
                { status: 400 }
            );
        }

        if (!productId) {
            console.log("[Analytics] Missing productId");
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        if (!vendorId) {
            console.log("[Analytics] Missing vendorId");
            return NextResponse.json(
                { error: 'Vendor ID is required' },
                { status: 400 }
            );
        }

        // Verify the product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Verify the vendor exists
        const vendor = await prisma.user.findUnique({
            where: { id: vendorId, role: 'VENDOR' }
        });

        if (!vendor) {
            return NextResponse.json(
                { error: 'Vendor not found' },
                { status: 404 }
            );
        }

        // Get the current user from session (optional)
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        // Record the event
        await prisma.analyticsEvent.create({
            data: {
                eventType,
                product: {
                    connect: { id: productId }
                },
                vendor: {
                    connect: { id: vendorId }
                },
                user: userId ? {
                    connect: { id: userId }
                } : undefined,
                metadata: metadata || {}
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Analytics] Error tracking event:", error);
        return NextResponse.json(
            { error: 'Failed to track event' },
            { status: 500 }
        );
    }
}