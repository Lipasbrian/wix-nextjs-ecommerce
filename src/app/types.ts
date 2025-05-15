export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    images?: Record<string, string> | string[]; // Allow both object and array formats
    details?: Array<{ title: string; content: string }>;
    vendorId?: string;
    category?: string;
    size?: string;
    color?: string;
    href?: string;
}

// Add the CartItem interface
export interface CartItem {
    id: string;
    name: string;
    price: number | string;
    quantity: number;
    images?: string[]; // Array of image URLs
    imageUrl?: string; // Single image URL
    // Add any other properties your cart items might need
}