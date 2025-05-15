import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function POST(_request: Request) {  // Renamed to _request to indicate it's intentionally unused
    // Use this route only in development
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
            { error: "This route is only available in development" },
            { status: 403 }
        );
    }

    try {
        // Create a test vendor with a secure password
        const hashedPassword = await hash('vendorpass123', 10);

        const newVendor = await prisma.user.create({
            data: {
                email: 'test.vendor@example.com',
                name: 'Test Vendor',
                password: hashedPassword,
                role: 'VENDOR'
            }
        });

        return NextResponse.json({
            message: "Test vendor created successfully",
            user: {
                id: newVendor.id,
                email: newVendor.email,
                name: newVendor.name,
                role: newVendor.role
            }
        });
    } catch (error: unknown) {
        // Type guard to check if error is a Prisma error
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Check for unique constraint violation (email already exists)
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: "User with this email already exists" },
                    { status: 409 }
                );
            }
        }

        console.error("Error creating test vendor:", error);
        return NextResponse.json(
            { error: "Database error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}