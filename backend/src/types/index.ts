export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  pricepernight: number;
  availability: boolean;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  property_id: string;
  checkindate: string;
  checkoutdate: string;
  totalprice: number;
  created_at: string;
  updated_at: string;
  properties?: Property;
  users?: User;
}

export interface CreatePropertyRequest {
  name: string;
  description: string;
  location: string;
  pricepernight: number;
  availability: boolean;
  image_url?: string;
}

export interface UpdatePropertyRequest {
  name?: string;
  description?: string;
  location?: string;
  pricepernight?: number;
  availability?: boolean;
  image_url?: string;
}

export interface CreateBookingRequest {
  property_id: string;
  checkindate: string;
  checkoutdate: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
