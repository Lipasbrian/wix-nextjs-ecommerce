import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAuth = !!token
        const isAuthPage = req.nextUrl.pathname === '/login'
        const isPublicPath = req.nextUrl.pathname === '/'

        // Allow public paths
        if (isPublicPath) {
            return null
        }

        // Redirect authenticated users away from login
        if (isAuthPage && isAuth) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        // Protect vendor routes
        if (req.nextUrl.pathname.startsWith('/vendor') && token?.role !== 'VENDOR') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        return null
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Public paths are always authorized
                if (req.nextUrl.pathname === '/') return true
                // Login page is always accessible
                if (req.nextUrl.pathname === '/login') return true
                // All other paths require authentication
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        '/',
        '/login',
        '/dashboard/:path*',
        '/admin/:path*',
        '/vendor/:path*',
        '/profile'  // Add profile route to protected paths
    ]
}