import { Product } from "@/app/types";

// Mock product data
const mockProducts: Product[] = [
    {
        id: "1",
        name: "Premium Laptop",
        description: "High-performance laptop with the latest specs",
        price: 1299.99,
        stock: 10, // Add stock property
        imageUrl: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
        images: { primary: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg" },
        category: "Laptops",
        details: [{ title: "Processor", content: "Intel i9" }],
        href: "/products/1"
    },
    {
        id: "2",
        name: "Budget Laptop",
        description: "Affordable laptop for everyday tasks",
        price: 699.99,
        stock: 15, // Add stock property
        imageUrl: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
        images: { primary: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg" },
        category: "Laptops",
        details: [{ title: "Processor", content: "Intel i5" }],
        href: "/products/2"
    },
    {
        id: "3",
        name: "Premium Smartphone",
        description: "Latest smartphone with stunning camera",
        price: 999.99,
        stock: 8, // Add stock property
        imageUrl: "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg",
        images: { primary: "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg" },
        category: "Smartphones",
        details: [{ title: "Camera", content: "48MP" }],
        href: "/products/3"
    },
    {
        id: "4",
        name: "Budget Smartphone",
        description: "Affordable smartphone with great features",
        price: 399.99,
        stock: 20, // Add stock property
        imageUrl: "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg",
        images: { primary: "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg" },
        category: "Smartphones",
        details: [{ title: "Camera", content: "12MP" }],
        href: "/products/4"
    }
];

export async function getProductsByCategory(slug: string): Promise<Product[]> {
    // Convert slug to a category name if needed
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

    // Filter products by category
    return mockProducts.filter(product =>
        product.category?.toLowerCase() === categoryName.toLowerCase()
    );
}

export async function getAllProducts(): Promise<Product[]> {
    return mockProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
    return mockProducts.find(product => product.id === id) || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
    // Return first 4 products as featured
    return mockProducts.slice(0, 4);
}

export async function getNewArrivals(): Promise<Product[]> {
    // Return last 4 products as new arrivals
    return mockProducts.slice(-4);
}