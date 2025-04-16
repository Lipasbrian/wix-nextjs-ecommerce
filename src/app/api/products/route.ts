import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Get pagination params
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("q") || "";

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Get products with pagination and search
        const products = await prisma.product.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            } : undefined,
            orderBy: { name: 'asc' },
            skip,
            take: limit
        });

        // Get total count for pagination
        const total = await prisma.product.count({
            where: search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            } : undefined
        });

        return NextResponse.json({
            products,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return new NextResponse("Error fetching products", { status: 500 });
    }
}