import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/admin/settings
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Ensure user is authenticated and is an admin
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Retrieve settings from database
        const settings = await prisma.settings.findFirst({
            where: { id: 1 }
        });

        if (!settings) {
            // Return default settings if none exist in the database
            return NextResponse.json({
                siteName: 'Your E-commerce Platform',
                logoUrl: '/logo.png',
                primaryColor: '#3B82F6',
                currencySymbol: '$',
                currencyCode: 'USD',
                taxRate: 8.5,
                allowGuestCheckout: true,
                requireEmailVerification: true,
                vendorApplicationRequiresApproval: true,
                showOutOfStockProducts: true,
                productsPerPage: 12,
                maintenanceMode: false,
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error retrieving settings:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve settings' },
            { status: 500 }
        );
    }
}

// POST /api/admin/settings
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Ensure user is authenticated and is an admin
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await request.json();

        // Validate settings
        if (!settings.siteName) {
            return NextResponse.json(
                { error: 'Site name is required' },
                { status: 400 }
            );
        }

        // Update or create settings in database
        await prisma.settings.upsert({
            where: { id: 1 }, // Assuming there's only one settings record
            update: {
                siteName: settings.siteName,
                logoUrl: settings.logoUrl,
                primaryColor: settings.primaryColor,
                currencySymbol: settings.currencySymbol,
                currencyCode: settings.currencyCode,
                taxRate: settings.taxRate,
                allowGuestCheckout: settings.allowGuestCheckout,
                requireEmailVerification: settings.requireEmailVerification,
                vendorApplicationRequiresApproval: settings.vendorApplicationRequiresApproval,
                showOutOfStockProducts: settings.showOutOfStockProducts,
                productsPerPage: settings.productsPerPage,
                maintenanceMode: settings.maintenanceMode
            },
            create: {
                id: 1,
                siteName: settings.siteName,
                logoUrl: settings.logoUrl,
                primaryColor: settings.primaryColor,
                currencySymbol: settings.currencySymbol,
                currencyCode: settings.currencyCode,
                taxRate: settings.taxRate,
                allowGuestCheckout: settings.allowGuestCheckout,
                requireEmailVerification: settings.requireEmailVerification,
                vendorApplicationRequiresApproval: settings.vendorApplicationRequiresApproval,
                showOutOfStockProducts: settings.showOutOfStockProducts,
                productsPerPage: settings.productsPerPage,
                maintenanceMode: settings.maintenanceMode
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json(
            { error: 'Failed to save settings' },
            { status: 500 }
        );
    }
}