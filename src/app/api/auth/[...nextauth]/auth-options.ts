import { DefaultSession, NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import { prisma } from "@/app/lib/prisma"  // Use the real connection for auth
import { compare } from "bcryptjs"

// Define Role type for better type safety
type UserRole = 'USER' | 'ADMIN' | 'VENDOR'

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
                        throw new Error("Missing required fields");
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
                        throw new Error("Invalid credentials");
                    }

                    const isValid = await compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name || null,
                        role: user.role as UserRole
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Add type assertion for user
                token.role = (user as User).role;
                token.id = (user as User).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as UserRole;
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: process.env.NODE_ENV === "development"
};