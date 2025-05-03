import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Define types for your data structures
interface ProductSaleData {
    productId: string;
    name: string;
    totalSold: number;
    revenue: number;
}

interface ProductViewData {
    productId: string;
    name: string;
    views: number;
    conversionRate: number;
}

interface CartEventData {
    productId: string;
    name: string;
    count: number;
    conversionRate: number;
}

interface OrderItem {
    productId: string;
    product: {
        vendorId: string;
        name: string;
    };
    price: number;
    quantity: number;
}

interface Order {
    orderItems: OrderItem[];
}

interface AnalyticsEvent {
    productId: string;
    product: {
        id: string;
        name: string;
    };
}

// Rest of your code with proper typing
export async function POST(request: Request) {
    try {
        // Validate cron key if needed
        const { headers } = request;
        const cronKey = headers.get('x-cron-key');

        if (process.env.CRON_SECRET_KEY && cronKey !== process.env.CRON_SECRET_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all vendors
        const vendors = await prisma.user.findMany({
            where: { role: 'VENDOR' },
            select: { id: true },
        });

        for (const vendor of vendors) {
            await aggregateVendorAnalytics(vendor.id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error aggregating analytics:', error);
        return NextResponse.json({ error: 'Failed to aggregate analytics' }, { status: 500 });
    }
}

async function aggregateVendorAnalytics(vendorId: string) {
    // Get time period (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get order data
    const orderData = await prisma.order.findMany({
        where: {
            orderItems: {
                some: {
                    product: {
                        vendorId,
                    },
                },
            },
            createdAt: {
                gte: thirtyDaysAgo,
            },
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    // Calculate order metrics
    let totalRevenue = 0;
    const totalOrders = orderData.length;
    const productSales = new Map<string, ProductSaleData>();

    orderData.forEach((order: Order) => {
        order.orderItems.forEach((item: OrderItem) => {
            if (item.product.vendorId === vendorId) {
                const revenue = item.price * item.quantity;
                totalRevenue += revenue;

                // Track product sales
                const productId = item.productId;
                if (!productSales.has(productId)) {
                    productSales.set(productId, {
                        productId,
                        name: item.product.name,
                        totalSold: 0,
                        revenue: 0,
                    });
                }

                const productData = productSales.get(productId);
                if (productData) {
                    productData.totalSold += item.quantity;
                    productData.revenue += revenue;
                }
            }
        });
    });

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get top selling products
    const topSellingProducts = Array.from(productSales.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

    // Get analytics events data
    const productViewEvents = await prisma.analyticsEvent.findMany({
        where: {
            vendorId,
            eventType: 'productView',
            timestamp: {
                gte: thirtyDaysAgo,
            },
        },
        include: {
            product: {
                select: { id: true, name: true },
            },
        },
    });

    const addToCartEvents = await prisma.analyticsEvent.findMany({
        where: {
            vendorId,
            eventType: 'addToCart',
            timestamp: {
                gte: thirtyDaysAgo,
            },
        },
        include: {
            product: {
                select: { id: true, name: true },
            },
        },
    });

    // Process product views
    const productViews = new Map<string, ProductViewData>();
    productViewEvents.forEach((event: AnalyticsEvent) => {
        const productId = event.productId;
        if (!productViews.has(productId)) {
            productViews.set(productId, {
                productId,
                name: event.product.name,
                views: 0,
                conversionRate: 0,
            });
        }

        const viewData = productViews.get(productId);
        if (viewData) {
            viewData.views += 1;
        }
    });

    // Process add to cart events
    const cartEvents = new Map<string, CartEventData>();
    addToCartEvents.forEach((event: AnalyticsEvent) => {
        const productId = event.productId;
        if (!cartEvents.has(productId)) {
            cartEvents.set(productId, {
                productId,
                name: event.product.name,
                count: 0,
                conversionRate: 0,
            });
        }

        const cartData = cartEvents.get(productId);
        if (cartData) {
            cartData.count += 1;
        }
    });

    // Calculate conversion rates - using Array.from for type safety
    Array.from(productViews.entries()).forEach(([productId, viewData]) => {
        const sales = productSales.get(productId);
        viewData.conversionRate = sales && viewData.views > 0
            ? sales.totalSold / viewData.views
            : 0;
    });

    Array.from(cartEvents.entries()).forEach(([productId, cartData]) => {
        const sales = productSales.get(productId);
        cartData.conversionRate = sales && cartData.count > 0
            ? sales.totalSold / cartData.count
            : 0;
    });

    // Get monthly sales data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const salesByMonth = await prisma.$queryRaw`
    SELECT 
      DATE_FORMAT(o.createdAt, '%Y-%m') as month,
      SUM(oi.price * oi.quantity) as revenue
    FROM Order o
    JOIN OrderItem oi ON o.id = oi.orderId
    JOIN Product p ON oi.productId = p.id
    WHERE p.vendorId = ${vendorId}
    AND o.createdAt >= ${sixMonthsAgo}
    GROUP BY month
    ORDER BY month ASC
  `;

    // Store the aggregated data
    await prisma.vendorAnalytics.upsert({
        where: { vendorId },
        update: {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            topSellingProducts: topSellingProducts,
            mostViewedProducts: Array.from(productViews.values())
                .sort((a, b) => b.views - a.views)
                .slice(0, 10),
            addToCartEvents: Array.from(cartEvents.values())
                .sort((a, b) => b.count - a.count)
                .slice(0, 10),
            salesByMonth,
            updatedAt: new Date(),
        },
        create: {
            vendorId,
            totalRevenue,
            totalOrders,
            averageOrderValue,
            topSellingProducts: topSellingProducts,
            mostViewedProducts: Array.from(productViews.values())
                .sort((a, b) => b.views - a.views)
                .slice(0, 10),
            addToCartEvents: Array.from(cartEvents.values())
                .sort((a, b) => b.count - a.count)
                .slice(0, 10),
            salesByMonth,
        },
    });
}