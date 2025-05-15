import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

// GET single user
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { id: params.id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Error fetching user" },
            { status: 500 }
        );
    }
}

// UPDATE user
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { name, email, role } = await request.json();

        // Validate the role
        if (!["USER", "VENDOR", "ADMIN"].includes(role)) {
            return NextResponse.json(
                { error: "Invalid role specified" },
                { status: 400 }
            );
        }

        // Check if we're updating to VENDOR role
        const _needsVendorAnalytics = role === "VENDOR";

        // Get the current user to check if they're becoming a vendor
        const currentUser = await prisma.user.findUnique({
            where: { id: params.id },
            select: { role: true }
        });

        const becomingVendor = currentUser?.role !== "VENDOR" && role === "VENDOR";

        // Update the user
        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: {
                name,
                email,
                role,
            },
        });

        // If user is becoming a vendor, create vendor analytics record
        if (becomingVendor) {
            await prisma.vendorAnalytics.upsert({
                where: { vendorId: params.id },
                update: {}, // No updates if it exists
                create: {
                    vendorId: params.id,
                    salesByMonth: {},
                    topSellingProducts: {},
                    mostViewedProducts: {},
                    addToCartEvents: {}
                }
            });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Error updating user" },
            { status: 500 }
        );
    }
}