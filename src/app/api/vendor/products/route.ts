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

// Update vendor product
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await request.json()
        const product = await prisma.product.update({
            where: {
                id: body.id,
                // Add vendorId check in production
                // vendorId: session.user.id
            },
            data: {
                name: body.name,
                description: body.description,
                price: parseFloat(body.price),
                // other fields as needed
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("Error updating product:", error)
        return new NextResponse("Error updating product", { status: 500 })
    }
}

// Delete vendor product
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!id) {
            return new NextResponse("Product ID required", { status: 400 })
        }

        await prisma.product.delete({
            where: {
                id,
                // Add vendorId check in production
                // vendorId: session.user.id
            }
        })

        return NextResponse.json({ message: "Deleted successfully" })
    } catch (error) {
        console.error("Error deleting product:", error)
        return new NextResponse("Error deleting product", { status: 500 })
    }
}