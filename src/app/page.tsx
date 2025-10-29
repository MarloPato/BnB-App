"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Home as HomeIcon, Calendar, Plus, User, Search } from "lucide-react";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-semibold text-gray-800 mb-6 tracking-tight leading-tight">
            Welcome to BnB Manager
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Manage your BnB properties and bookings with ease. Create listings,
            handle reservations, and track your business all in one place.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-4 rounded-2xl text-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="border-2 border-amber-400 text-amber-700 px-10 py-4 rounded-2xl text-lg font-medium hover:bg-amber-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-10 max-w-2xl mx-auto border border-amber-100/50">
              <h2 className="text-3xl font-semibold text-gray-800 mb-3">
                Welcome back, {user?.name}! 👋
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Ready to manage your BnB properties and bookings?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/browse"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-4 rounded-2xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Search className="h-5 w-5" />
                  <span className="font-medium">Browse Properties</span>
                </Link>
                <Link
                  href="/properties"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-400 to-amber-400 text-white px-6 py-4 rounded-2xl hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span className="font-medium">My Properties</span>
                </Link>
                <Link
                  href="/properties/new"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Add Property</span>
                </Link>
                <Link
                  href="/bookings"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">My Bookings</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-semibold text-center text-gray-800 mb-16 tracking-tight">
            Everything you need to manage your BnB
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center border border-amber-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 mb-6">
                <HomeIcon className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Property Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create and manage your BnB listings with detailed descriptions,
                pricing, and availability.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center border border-amber-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
                <Calendar className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Booking System
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Handle reservations with automatic price calculation and
                conflict detection.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center border border-amber-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 mb-6">
                <User className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                User Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
