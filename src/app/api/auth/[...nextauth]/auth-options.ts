import { DefaultSession, NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import { prisma } from "@/app/lib/prisma"  // Use the real connection for auth
import { compare } from "bcryptjs"

// Define Role type for better type safety
export type UserRole = 'USER' | 'ADMIN' | 'VENDOR'

// Update type declarations
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

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<User | null> {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log("[Auth] Missing credentials");
                        return null;
                    }

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

                    if (!user || !user.password) {
                        console.log("[Auth] User not found or no password");
                        return null;
                    }

                    const isValid = await compare(credentials.password, user.password);
                    if (!isValid) {
                        console.log("[Auth] Invalid password for:", credentials.email);
                        return null;
                    }

                    console.log("[Auth] Login successful for:", credentials.email);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name || null,
                        role: user.role as UserRole
                    };
                } catch (error) {
                    console.error("[Auth] Authentication error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login?error=true",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: process.env.NODE_ENV === "development",
    logger: {
        error(code, metadata) {
            console.error('[Auth] Error:', { code, metadata });
        },
        warn(code) {
            console.warn('[Auth] Warning:', code);
        },
        debug(code, metadata) {
            console.log('[Auth] Debug:', code, metadata);
        }
    }
};