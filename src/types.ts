export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  stock: number;
  featured: boolean;
  rating?: number;
  reviewsCount?: number;
  details?: {
    material?: string;
    dimensions?: string;
    origin?: string;
    consecration?: string;
    includes?: string[];
  };
}

export type ProductCategory =
  | "Puja & Devotional"
  | "Rudraksha & Malas"
  | "Hindu Books"
  | "Hindu Symbols"
  | "Temple & Home Decor"
  | "Sanatan Merchandise"
  | "Clothing"
  | "Gifts";

export interface CartItem {
  product: Product;
  quantity: number;
  customPriceOverride?: number; // Optional admin price override on active cart
}

export type UserRole = "admin" | "customer";

export interface UserAccount {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  pan?: string;
  gotra?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  joinedDate: string;
}

export interface DonationCause {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  targetAmount?: number;
  raisedAmount?: number;
  donorsCount?: number;
  image: string;
  iconName: string;
  suggestedAmounts: number[];
  category: "Annadaan" | "Gaushala" | "Temple Renovation" | "Vedic Education" | "General Dharmic Seva";
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  paymentMethod: "upi" | "card" | "netbanking" | "cod";
  createdAt: string;
  status: "Confirmed" | "Processing" | "Shipped";
}

