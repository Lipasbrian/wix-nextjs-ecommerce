import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/app/lib/prisma'
import { validateRegistration } from '@/app/lib/validators'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    const validation = validateRegistration({ name, email, password })
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400 }
      )
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false // For future email verification
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    // TODO: Add email verification logic here

    return NextResponse.json(user, { status: 201 })

  } catch (error) {
    console.error('Registration Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}