import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcryptjs"

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
                    throw new Error("Email and password required")
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
                })

                if (!user) {
                    throw new Error("User not found")
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) {
                    throw new Error("Invalid password")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role as UserRole
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
        strategy: "jwt"
    },
    pages: {
        signIn: '/login'
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }