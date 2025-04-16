import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

// Get vendor products
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const products = await prisma.product.findMany({
            where: {
                // Filter by vendor ID in production
                // vendorId: session.user.id 
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error("Error fetching vendor products:", error)
        return new NextResponse("Error fetching products", { status: 500 })
    }
}

// Create vendor product
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await request.json()
        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: parseFloat(body.price),
                // Add vendorId in production
                // vendorId: session.user.id
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("Error creating product:", error)
        return new NextResponse("Error creating product", { status: 500 })
    }
}

// Update vendor product (similar to admin but with vendor ownership check)
export async function PUT(request: Request) {
    // Similar to admin with vendor check
}

// Delete vendor product (similar to admin but with vendor ownership check)
export async function DELETE(request: Request) {
    // Similar to admin with vendor check
}