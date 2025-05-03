import { DefaultSession, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import { prisma } from "@/app/lib/prisma"  // Updated import
import { compare } from "bcryptjs"
import NextAuth from "next-auth"

// Define Role type for better type safety
type UserRole = 'USER' | 'ADMIN' | 'VENDOR'

// Update type declarations with proper inheritance
declare module "next-auth" {
    interface User {
        id: string
        email: string
        name?: string | null
        role: UserRole
    }
    interface Session extends DefaultSession {
        user: {
            id: string
            role: UserRole
        } & DefaultSession["user"]
    }
}

// Configure NextAuth with proper types
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    console.log("[Auth] Missing credentials");
                    throw new Error("Please provide both email and password");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            password: true,
                            role: true
                        }
                    });

                    if (!user) {
                        console.log("[Auth] User not found:", credentials.email);
                        throw new Error("Invalid email or password");
                    }

                    const isValid = await compare(credentials.password, user.password);

                    if (!isValid) {
                        console.log("[Auth] Invalid password for:", credentials.email);
                        throw new Error("Invalid email or password");
                    }

                    console.log("[Auth] Login successful for:", credentials.email);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role as UserRole
                    };
                } catch (error) {
                    console.error("[Auth] Error:", error);
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as UserRole
            }
            return session
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
    logger: {
        error(code, ...message) {
            console.error('[Auth] Error:', code, message);
        },
        warn(code, ...message) {
            console.warn('[Auth] Warning:', code, message);
        },
        debug(code, ...message) {
            if (process.env.NODE_ENV === "development") {
                console.debug('[Auth] Debug:', code, message);
            }
        }
    }
}


const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }