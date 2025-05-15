// src/app/api/admin/analytics/check/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check recent analytics events
        const recentEvents = await prisma.analyticsEvent.findMany({
            take: 10,
            orderBy: {
                timestamp: 'desc'
            },
            include: {
                product: true,
                vendor: true
            }
        });

        return NextResponse.json({
            status: 'ok',
            eventCount: recentEvents.length,
            recentEvents
        });
    } catch (error) {
        console.error("[Analytics Check] Error:", error);

        // Type guard for error
        const errorMessage = error instanceof Error
            ? error.message
            : 'An unknown error occurred';

        return NextResponse.json(
            {
                status: 'error',
                message: errorMessage,
                // Safe stringification of error
                details: String(error)
            },
            { status: 500 }
        );
    }
}