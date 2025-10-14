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
  pricePerNight: number;
  availability: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  property_id: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  created_at: string;
  updated_at: string;
  properties?: Property;
}

export interface CreatePropertyRequest {
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  availability: boolean;
}

export interface UpdatePropertyRequest {
  name?: string;
  description?: string;
  location?: string;
  pricePerNight?: number;
  availability?: boolean;
}

export interface CreateBookingRequest {
  property_id: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
