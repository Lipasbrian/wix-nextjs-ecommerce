import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Define types for our data
interface OrderItem {
    price: number;
    quantity: number;
    product: {
        vendorId: string;
    };
}

interface Order {
    orderItems: OrderItem[];
}

interface DailyRevenue {
    createdAt: Date;
    _sum: {
        total: number | null;
    };
}

interface VendorInfo {
    id: string;
    name: string | null;
    email: string;
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Ensure user is authenticated and is an admin
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe') || 'month';

        // Set timeframe date
        const today = new Date();
        let startDate: Date;

        switch (timeframe) {
            case "year":
                startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                break;
            case "month":
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                break;
            case "week":
            default:
                startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                break;
        }

        // Get platform-wide statistics
        // 1. Count total vendors, users and products
        const [totalVendors, totalUsers, totalProducts] = await Promise.all([
            prisma.user.count({ where: { role: 'VENDOR' } }),
            prisma.user.count(),
            prisma.product.count(),
        ]);

        // 2. Get orders and calculate revenue
        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                vendorId: true,
                            },
                        },
                    },
                },
            },
        });

        // 3. Calculate total revenue and orders
        let totalRevenue = 0;
        const totalOrders = orders.length;

        orders.forEach((order: Order) => {
            order.orderItems.forEach((item: OrderItem) => {
                totalRevenue += item.price * item.quantity;
            });
        });

        // 4. Get product views and cart additions
        const [totalProductViews, totalCartAdds] = await Promise.all([
            prisma.analyticsEvent.count({
                where: {
                    eventType: 'productView',
                    timestamp: { gte: startDate },
                },
            }),
            prisma.analyticsEvent.count({
                where: {
                    eventType: 'addToCart',
                    timestamp: { gte: startDate },
                },
            }),
        ]);

        // 5. Calculate platform metrics
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const platformConversionRate = totalProductViews > 0 ? totalOrders / totalProductViews : 0;

        // 6. Get daily revenue for the selected timeframe
        const dailyRevenue = await prisma.order.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: { gte: startDate },
            },
            _sum: {
                total: true,
            },
        });

        // Format daily revenue for chart
        const revenueTimeSeries = {
            dates: dailyRevenue.map((day: DailyRevenue) => new Date(day.createdAt).toLocaleDateString()),
            values: dailyRevenue.map((day: DailyRevenue) => day._sum.total || 0),
        };

        // 7. Get vendor performance summaries
        const vendors = await prisma.user.findMany({
            where: {
                role: 'VENDOR',
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        // 8. Calculate metrics for each vendor
        const vendorSummaries = await Promise.all(
            vendors.map(async (vendor: VendorInfo) => {
                // Get vendor's products
                const products = await prisma.product.findMany({
                    where: {
                        vendorId: vendor.id,
                    },
                    select: {
                        id: true,
                    },
                });

                const productIds = products.map((p: { id: string }) => p.id);

                // Get total sales and revenue
                const vendorOrders = orders.filter((order: Order) =>
                    order.orderItems.some((item: OrderItem) =>
                        item.product.vendorId === vendor.id
                    )
                );

                let vendorRevenue = 0;
                let vendorSales = 0;

                vendorOrders.forEach((order: Order) => {
                    order.orderItems.forEach((item: OrderItem) => {
                        if (item.product.vendorId === vendor.id) {
                            vendorRevenue += item.price * item.quantity;
                            vendorSales += item.quantity;
                        }
                    });
                });

                // Get product views
                const productViews = await prisma.analyticsEvent.count({
                    where: {
                        eventType: 'productView',
                        productId: { in: productIds },
                        timestamp: { gte: startDate },
                    },
                });

                // Calculate conversion rate
                const conversionRate = productViews > 0 ? vendorOrders.length / productViews : 0;

                return {
                    id: vendor.id,
                    name: vendor.name,
                    email: vendor.email,
                    totalRevenue: vendorRevenue,
                    totalSales: vendorSales,
                    productViews,
                    conversionRate,
                };
            })
        );

        // Sort vendors by revenue
        vendorSummaries.sort((a, b) => b.totalRevenue - a.totalRevenue);

        // Return the aggregated data
        return NextResponse.json({
            // Platform metrics
            totalVendors,
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            totalProductViews,
            totalCartAdds,
            averageOrderValue,
            platformConversionRate,

            // Time series data
            revenueTimeSeries,

            // Vendor data
            vendorSummaries,
        });
    } catch (error) {
        console.error('Error fetching admin analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
}