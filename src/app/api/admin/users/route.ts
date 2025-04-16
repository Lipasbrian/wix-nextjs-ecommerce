import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Get all users
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return new NextResponse("Error fetching users", { status: 500 });
    }
}

// Update user role
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { userId, role } = body;

        if (!userId || !role) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Prevent admins from changing their own role
        if (userId === session.user.id) {
            return new NextResponse("Cannot change your own role", { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user role:", error);
        return new NextResponse("Error updating user role", { status: 500 });
    }
}

// Delete user
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return new NextResponse("Missing user ID", { status: 400 });
        }

        // Prevent admins from deleting themselves
        if (userId === session.user.id) {
            return new NextResponse("Cannot delete your own account", { status: 400 });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new NextResponse("Error deleting user", { status: 500 });
    }
}