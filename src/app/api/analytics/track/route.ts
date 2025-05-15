import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
    try {
        // Parse the request body
        const body = await request.json();
        console.log("[Analytics] Received tracking request:", body);

        const { eventType, productId, vendorId, adId, _position, _adTitle, _metadata } = body;

        // Add detailed validation messages
        if (!eventType) {
            console.log("[Analytics] Missing eventType");
            return NextResponse.json(
                { error: 'Event type is required' },
                { status: 400 }
            );
        }

        // Special handling for ad-related events
        if (eventType === 'adImpression' || eventType === 'adClick') {
            if (!adId) {
                console.log("[Analytics] Missing adId");
                return NextResponse.json(
                    { error: 'Ad ID is required for ad events' },
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

            // Get the current user from session (optional)
            const session = await getServerSession(authOptions);
            const _userId = session?.user?.id;

            // For ad events, update the Analytics table
            try {
                const updateType = eventType === 'adImpression' ? 'impressions' : 'clicks';

                // Generate a unique ID using adId
                const analyticsId = `analytics-${adId}`;

                // Find the ad analytics record or create if it doesn't exist
                const _adAnalytics = await prisma.analytics.upsert({
                    where: {
                        id: analyticsId
                    },
                    update: {
                        [updateType]: { increment: 1 }
                    },
                    create: {
                        id: analyticsId,
                        userId: session?.user?.id || 'anonymous', // Provide the required userId field
                        adId: adId,
                        impressions: eventType === 'adImpression' ? 1 : 0,
                        clicks: eventType === 'adClick' ? 1 : 0
                    }
                });

                console.log(`[Analytics] Ad ${updateType} recorded successfully for ad: ${adId}`);
                return NextResponse.json({ success: true });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`[Analytics] Error tracking ad ${eventType}:`, error);
                return NextResponse.json(
                    { error: `Failed to track ad ${eventType}`, details: errorMessage },
                    { status: 500 }
                );
            }
        }

        // Standard product-related event handling (your existing code)
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
            console.log("[Analytics] Product not found:", productId);
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Verify the vendor exists
        const vendor = await prisma.user.findFirst({
            where: {
                id: vendorId,
                role: 'VENDOR'
            }
        });

        if (!vendor) {
            console.log("[Analytics] Vendor not found:", vendorId);
            return NextResponse.json(
                { error: 'Vendor not found' },
                { status: 404 }
            );
        }

        // Get the current user from session (optional)
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        console.log("[Analytics] Creating event:", {
            eventType,
            productId,
            vendorId,
            userId: userId || "anonymous"
        });

        // Record the event using connect syntax for relations
        const event = await prisma.analyticsEvent.create({
            data: {
                eventType,
                timestamp: new Date(), // Add server-side timestamp
                product: {
                    connect: { id: productId }
                },
                vendor: {
                    connect: { id: vendorId }
                },
                user: userId ? {
                    connect: { id: userId }
                } : undefined,
                // If metadata isn't part of the Prisma schema, remove it or add it to the schema
                // metadata: metadata || {}
                // Additional data can be added here if needed
            }
        });

        console.log("[Analytics] Event recorded successfully:", event.id);
        return NextResponse.json({ success: true, eventId: event.id });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("[Analytics] Error tracking event:", error);
        return NextResponse.json(
            { error: 'Failed to track event', details: errorMessage },
            { status: 500 }
        );
    }
}