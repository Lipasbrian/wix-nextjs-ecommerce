import { DefaultSession, User as NextAuthUser } from 'next-auth';

// Product and cart types
export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    images: Record<string, string>;
    imageUrl?: string;
    details?: Array<{
        title: string;
        content: string;
    }>;
    href?: string;
    category?: string;
    size?: string;
    color?: string;
}

export interface CartItem extends Omit<Product, 'images'> {
    productId: string;
    quantity: number;
    images?: string[];
    itemTotal?: number;
}

// Utility types
export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

// User and role types
export type UserRole = 'USER' | 'ADMIN' | 'VENDOR';

export interface User extends NextAuthUser {
    role: UserRole;
}

// Auth type extensions
declare module 'next-auth' {
    interface User {
        role: UserRole;
    }

    interface Session extends DefaultSession {
        user: {
            id: string;
            role: UserRole;
        } & DefaultSession['user'];
    }
}