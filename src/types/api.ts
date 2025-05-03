export type FormDataValue = string | number | boolean | null | undefined | File;

export interface ApiData {
    [key: string]: string | number | boolean | null | undefined;
}

export interface AdFormData {
    title: string;
    description: string;
    image: File;
    targetLocation: string;
    budget: number;
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    error?: string;
}