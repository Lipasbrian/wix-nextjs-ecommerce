export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    images?: Record<string, string>; // You seem to use this in SinglePage.tsx
    details?: Array<{ title: string; content: string }>; // Also used in SinglePage
    vendorId?: string;
}