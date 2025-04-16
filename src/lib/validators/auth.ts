import type { LoginRequest } from '@/types/auth';

export interface ValidationResult {
    success: boolean;
    message?: string;
}

export function validateLogin({ email, password }: LoginRequest): ValidationResult {
    if (!email || !password) {
        return {
            success: false,
            message: 'Email and password are required'
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            message: 'Invalid email format'
        };
    }

    return {
        success: true
    };
}