import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { validateLogin } from "@/lib/validators/auth";
import { rateLimit } from "@/app/lib/rate-limit";

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    message?: string;
    sessionId?: string;
    error?: string;
}

interface User {
    id: string;
    email: string;
    password: string;
}

interface Session {
    id: string;
    userId: string;
    expires: Date;
}

export async function POST(request: Request) {
    try {
        // Enhanced IP detection
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            request.headers.get('cf-connecting-ip') ||
            'unknown';

        // Validate IP format
        const isValidIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip) || ip === 'unknown';
        if (!isValidIP) {
            return NextResponse.json<LoginResponse>(
                { error: "Invalid request origin" },
                { status: 400 }
            );
        }

        // Rate limit check
        const rateLimitResult = await rateLimit(ip);

        if (!rateLimitResult.success) {
            return NextResponse.json<LoginResponse>(
                { error: "Too many attempts. Please try again later." },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimitResult.reset.toString()
                    }
                }
            );
        }

        // Parse and validate request
        const { email, password }: LoginRequest = await request.json();

        // Sanitize email input
        const sanitizedEmail = email.trim().toLowerCase();

        // Validate input with sanitized email
        const validation = validateLogin({
            email: sanitizedEmail,
            password
        });

        if (!validation.success) {
            return NextResponse.json<LoginResponse>(
                { error: validation.message || "Invalid input" },
                { status: 400 }
            );
        }

        // Find user with sanitized email
        const user = await prisma.user.findUnique({
            where: { email: sanitizedEmail },
        });

        // Verify credentials
        if (!user || !await bcrypt.compare(password, user.password)) {
            return NextResponse.json<LoginResponse>(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Clean up expired sessions for this user
        await prisma.session.deleteMany({
            where: {
                userId: user.id,
                expires: {
                    lt: new Date()
                }
            }
        });

        // Create session
        const session = await prisma.session.create({
            data: {
                userId: user.id,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
        });

        // Set cookie and return success with enhanced security headers
        return NextResponse.json<LoginResponse>(
            {
                message: "Login successful",
                sessionId: session.id
            },
            {
                status: 200,
                headers: {
                    'Set-Cookie': `session=${session.id}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${30 * 24 * 60 * 60}`,
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'X-XSS-Protection': '1; mode=block'
                }
            }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json<LoginResponse>(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}