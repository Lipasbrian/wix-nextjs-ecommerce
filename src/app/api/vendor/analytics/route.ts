import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Get timeframe from URL query parameters
        const { searchParams } = new URL(request.url)
        const timeframe = searchParams.get("timeframe") || "week"

        // Calculate date range based on timeframe
        const today = new Date()
        let startDate: Date

        switch (timeframe) {
            case "year":
                startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
                break
            case "month":
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
                break
            case "week":
            default:
                startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
                break
        }

        // Query analytics data
        const analyticsData = await prisma.vendorAnalytics.findMany({
            where: {
                vendorId: session.user.id,
                date: {
                    gte: startDate
                }
            },
            orderBy: {
                date: "asc"
            }
        })

        return NextResponse.json(analyticsData)
    } catch (error) {
        console.error("Error fetching analytics:", error)
        return new NextResponse("Error fetching analytics", { status: 500 })
    }
}