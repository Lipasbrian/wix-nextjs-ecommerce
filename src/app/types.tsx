export interface Product {
  details: any;
  id: string;
  name: string;
  price: string; // Changed from number since your data uses string prices
  description: string;
  href: string; // Added for product links
  images: {
    // Changed to match your image structure
    primary: string;
    hover: string;
    details?: Array<{ title: string; content: string }>;
  };
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
