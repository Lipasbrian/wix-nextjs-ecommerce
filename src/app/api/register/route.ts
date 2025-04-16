import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { validateRegistration } from "@/app/lib/validators";

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
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
