export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message?: string;
    sessionId?: string;
    error?: string;
}

export interface Session {
    id: string;
    userId: string;
    expires: Date;
}

export interface User {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ValidationResult {
    valid: boolean;
    message?: string;
}