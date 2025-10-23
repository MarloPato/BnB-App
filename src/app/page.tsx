"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Home as HomeIcon, Calendar, Plus, User, Search } from "lucide-react";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to BnB Manager
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage your BnB properties and bookings with ease. Create listings,
            handle reservations, and track your business all in one place.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-600 mb-6">
                Ready to manage your BnB properties and bookings?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/browse"
                  className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Search className="h-5 w-5" />
                  <span>Browse Properties</span>
                </Link>
                <Link
                  href="/properties"
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>My Properties</span>
                </Link>
                <Link
                  href="/properties/new"
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Property</span>
                </Link>
                <Link
                  href="/bookings"
                  className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span>My Bookings</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to manage your BnB
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <HomeIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Property Management
              </h3>
              <p className="text-gray-600">
                Create and manage your BnB listings with detailed descriptions,
                pricing, and availability.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Booking System
              </h3>
              <p className="text-gray-600">
                Handle reservations with automatic price calculation and
                conflict detection.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <User className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                User Management
              </h3>
              <p className="text-gray-600">
                Secure authentication with role-based access control for admins
                and property owners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
