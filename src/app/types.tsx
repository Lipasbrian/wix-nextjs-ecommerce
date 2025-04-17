export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  images?: Record<string, string>;
  stock?: number;
  details?: any[] | any; // Changed from required to optional with ?
  href?: string;
  category?: string;
  size?: string;
  color?: string;
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
