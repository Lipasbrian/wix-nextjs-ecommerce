import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = {
      name: body.name?.trim(),
      email: body.email?.trim().toLowerCase(),
      password: body.password,
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const _user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify({ message: 'User created successfully' }));
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
