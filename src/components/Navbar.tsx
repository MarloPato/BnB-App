"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Home, User, LogOut, Plus, Calendar, Search } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-amber-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 group-hover:from-amber-500 group-hover:to-orange-600 transition-all shadow-md group-hover:shadow-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-semibold text-gray-800 tracking-tight">
                BnB Manager
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/browse"
              className="text-gray-700 hover:text-orange-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 hover:bg-amber-50 transition-all duration-200"
            >
              <Search className="h-4 w-4" />
              <span>Browse</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/properties"
                  className="text-gray-700 hover:text-orange-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 hover:bg-amber-50 transition-all duration-200"
                >
                  <Home className="h-4 w-4" />
                  <span>My Properties</span>
                </Link>

                <Link
                  href="/properties/new"
                  className="text-gray-700 hover:text-orange-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 hover:bg-amber-50 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Property</span>
                </Link>

                <Link
                  href="/bookings"
                  className="text-gray-700 hover:text-orange-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 hover:bg-amber-50 transition-all duration-200"
                >
                  <Calendar className="h-4 w-4" />
                  <span>My Bookings</span>
                </Link>

                <div className="flex items-center space-x-3 ml-2 pl-4 border-l border-amber-200">
                  <div className="flex items-center space-x-2 bg-amber-50 px-3 py-2 rounded-xl">
                    <User className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-gray-800 font-medium">
                      {user?.name}
                    </span>
                  </div>
                  {user?.isAdmin && (
                    <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-orange-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 hover:bg-amber-50 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-orange-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-50 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 px-6 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
