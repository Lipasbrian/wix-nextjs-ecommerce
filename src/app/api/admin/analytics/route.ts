import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Order, Prisma, User } from "@prisma/client";

// Define types matching your actual Prisma schema
interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    price: number;
    quantity: number;
    product: {
        id: string;
        name: string;
        vendorId: string; // Based on your schema, this likely exists directly on product
    };
}

// Update Order interface to match the actual structure returned by Prisma
interface OrderWithRelations extends Order {
    items: OrderItem[];
    user: User;
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
        // Add this at the start of your GET function to debug the schema
        try {
            // Log a sample product to see its structure
            const sampleProduct = await prisma.product.findFirst();
            console.log("Sample product structure:",
                JSON.stringify(sampleProduct, null, 2)
            );

            // Log the database schema for Product
            const productModel = await prisma.$queryRaw`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'Product'
            `;
            console.log("Product table schema:", productModel);
        } catch (error) {
            console.error("Schema inspection error:", error);
        }

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
                items: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        }) as unknown as OrderWithRelations[];

        // 3. Calculate total revenue and orders
        let totalRevenue = 0;
        const totalOrders = orders.length;

        // Type assertion to help TypeScript understand our data structure
        (orders as OrderWithRelations[]).forEach((order) => {
            if (order.items) {
                order.items.forEach((item) => {
                    totalRevenue += item.price * item.quantity;
                });
            }
        });

        // 4. Get product views and cart additions
        const [totalProductViews, totalCartAdds] = await Promise.all([
            prisma.analyticsEvent.count({
                where: {
                    eventType: 'product_view',
                    timestamp: { gte: startDate },
                },
            }),
            prisma.analyticsEvent.count({
                where: {
                    eventType: 'add_to_cart',
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

        // Replace the existing product query section with this more targeted approach

        // 8. Calculate metrics for each vendor
        const vendorSummaries = await Promise.all(
            vendors.map(async (vendor: VendorInfo) => {
                // Use a more robust approach to find products
                let productIds: string[] = [];

                try {
                    // Log the column names first to understand the schema
                    const productColumns = await prisma.$queryRaw<Array<{ column_name: string }>>`
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name = 'Product'
                    `;

                    console.log(`Available Product columns:`,
                        productColumns.map(col => col.column_name).join(', ')
                    );

                    // Try to find vendor-related fields
                    const vendorFields = productColumns
                        .filter(col => col.column_name.toLowerCase().includes('vendor') ||
                            col.column_name.toLowerCase().includes('user') ||
                            col.column_name.toLowerCase().includes('creator'))
                        .map(col => col.column_name);

                    console.log(`Found potential vendor relation fields:`, vendorFields);

                    // Try different approaches to find products
                    // Approach 1: Find products using the order items
                    const orderProductIds = new Set<string>();
                    orders.forEach(order => {
                        if (order.items) {
                            order.items.forEach(item => {
                                if (item.product && item.product.vendorId === vendor.id) {
                                    orderProductIds.add(item.productId);
                                }
                            });
                        }
                    });

                    if (orderProductIds.size > 0) {
                        console.log(`Found ${orderProductIds.size} products for vendor ${vendor.id} via orders`);
                        productIds = Array.from(orderProductIds);
                    } else {
                        console.log(`No products found in orders for vendor ${vendor.id}`);

                        // Approach 2: Try direct query with discovered fields
                        if (vendorFields.length > 0) {
                            for (const field of vendorFields) {
                                // Try query with this field
                                const query = `SELECT "id" FROM "Product" WHERE "${field}" = '${vendor.id}'`;
                                console.log(`Trying query: ${query}`);

                                try {
                                    const products = await prisma.$queryRaw<{ id: string }[]>`
                                        ${Prisma.raw(query)}
                                    `;

                                    if (products && products.length > 0) {
                                        console.log(`Found ${products.length} products using field ${field}`);
                                        productIds = products.map(p => p.id);
                                        break;
                                    }
                                } catch (err) {
                                    console.log(`Error trying field ${field}:`, err);
                                    // Continue to next field
                                }
                            }
                        }

                        // Approach 3: Fall back to default column name
                        if (productIds.length === 0) {
                            console.log(`Trying with default vendorId field`);
                            try {
                                // Try a direct Prisma query instead of raw SQL
                                const products = await prisma.product.findMany({
                                    where: {
                                        // @ts-expect-error - ignore TypeScript errors as we're explicitly testing
                                        vendorId: vendor.id
                                    },
                                    select: {
                                        id: true
                                    }
                                });

                                if (products.length > 0) {
                                    productIds = products.map(p => p.id);
                                    console.log(`Found ${products.length} products using Prisma query`);
                                }
                            } catch (err) {
                                console.log(`Error with Prisma query:`, err);
                            }
                        }
                    }

                    console.log(`Total products found for vendor ${vendor.id}: ${productIds.length}`);
                } catch (error) {
                    console.error(`Error finding products for vendor ${vendor.id}:`, error);
                    // Continue with whatever data we have
                }

                // Get total sales and revenue for this vendor
                let vendorRevenue = 0;
                let vendorSales = 0;

                // Filter orders with products from this vendor
                const vendorOrders = (orders as OrderWithRelations[]).filter((order) =>
                    order.items && order.items.some(item =>
                        item.product && item.product.vendorId === vendor.id
                    )
                );

                // Calculate revenue and sales
                vendorOrders.forEach((order) => {
                    if (order.items) {
                        order.items.forEach((item) => {
                            if (item.product && item.product.vendorId === vendor.id) {
                                vendorRevenue += item.price * item.quantity;
                                vendorSales += item.quantity;
                            }
                        });
                    }
                });

                // Get product views (for products we were able to identify)
                let productViews = 0;
                if (productIds.length > 0) {
                    productViews = await prisma.analyticsEvent.count({
                        where: {
                            eventType: 'product_view',
                            productId: { in: productIds },
                            timestamp: { gte: startDate },
                        },
                    });
                }

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
                    productCount: productIds.length
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