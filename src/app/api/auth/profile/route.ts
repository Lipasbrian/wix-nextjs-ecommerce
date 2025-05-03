import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"  // Updated import
import { authOptions } from "../[...nextauth]/route"

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await request.json()
        const { name, email } = body

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { name, email },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Profile update error:", error)
        return new NextResponse("Error updating profile", { status: 500 })
    }
}