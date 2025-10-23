import axios from "axios";
import {
  User,
  Property,
  Booking,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  CreateBookingRequest,
  AuthResponse,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/api/auth/logout");
  },

  getMe: async (): Promise<User> => {
    const response = await api.get("/api/auth/me");
    return response.data.user;
  },
};

// Properties API
export const propertiesApi = {
  getAll: async (): Promise<Property[]> => {
    const response = await api.get("/api/properties");
    return response.data.properties;
  },

  getMyProperties: async (): Promise<Property[]> => {
    const response = await api.get("/api/properties/my");
    return response.data.properties;
  },

  getById: async (id: string): Promise<Property> => {
    const response = await api.get(`/api/properties/${id}`);
    return response.data.property;
  },

  create: async (data: CreatePropertyRequest): Promise<Property> => {
    const response = await api.post("/api/properties", data);
    return response.data.property;
  },

  update: async (
    id: string,
    data: UpdatePropertyRequest
  ): Promise<Property> => {
    const response = await api.put(`/api/properties/${id}`, data);
    return response.data.property;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/properties/${id}`);
  },
};

// Bookings API
export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get("/api/bookings");
    return response.data.bookings;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data.booking;
  },

  create: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await api.post("/api/bookings", data);
    return response.data.booking;
  },

  update: async (
    id: string,
    data: Partial<CreateBookingRequest>
  ): Promise<Booking> => {
    const response = await api.put(`/api/bookings/${id}`, data);
    return response.data.booking;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/bookings/${id}`);
  },
};

export default api;
