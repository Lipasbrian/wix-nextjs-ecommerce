export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: Record<string, string>;
  stock?: number;
  details: any[] | any; // Unified details type that accepts both formats
  href?: string;
  category?: string; // Added for filtering
  size?: string; // Added for filtering
  color?: string; // Added for filtering
}

// Your existing cart interfaces are good, keep them
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  lastUpdated: Date;
}
