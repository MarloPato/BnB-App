"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { propertiesApi } from "@/lib/api";
import { Property } from "../../types";
import {
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Search,
  Trash2,
} from "lucide-react";

export default function BrowsePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { isAuthenticated, isAdmin } = useAuth();

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      // If user is admin, fetch all properties (including unavailable)
      const data =
        isAdmin && isAuthenticated
          ? await propertiesApi.getAllAdmin()
          : await propertiesApi.getAll();
      setProperties(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isAuthenticated]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      await propertiesApi.delete(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to delete property");
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      !maxPrice || property.pricepernight <= parseFloat(maxPrice);

    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-4 tracking-tight">
            Browse Properties
          </h1>
          <p className="text-lg text-gray-700">
            Discover amazing BnB properties for your next stay.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-10 border border-amber-100/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 transition-all"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
              <input
                type="number"
                placeholder="Max price per night"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white/80 transition-all"
              />
            </div>
            <div className="flex items-center justify-center">
              <span className="text-base text-gray-700 font-medium bg-amber-50 px-5 py-3.5 rounded-2xl border-2 border-amber-200">
                {filteredProperties.length} properties found
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50/90 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 shadow-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 mb-6">
              <Home className="h-16 w-16 text-amber-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No properties found
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or check back later for new
              listings.
            </p>
            {isAuthenticated && (
              <Link
                href="/properties/new"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                Add Your Property
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100/50"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                  {property.image_url ? (
                    <Image
                      src={property.image_url}
                      alt={property.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        (
                          e.currentTarget.nextElementSibling as HTMLElement
                        )?.style.setProperty("display", "flex");
                      }}
                    />
                  ) : null}
                  <div
                    className={`h-full w-full flex items-center justify-center ${
                      property.image_url ? "hidden" : "flex"
                    }`}
                  >
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <div className="p-1.5 rounded-lg bg-amber-100 mr-3">
                        <MapPin className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-base font-medium">
                        {property.location}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="p-1.5 rounded-lg bg-amber-100 mr-3">
                        <DollarSign className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-base font-semibold">
                        ${property.pricepernight} per night
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div
                        className={`p-1.5 rounded-lg mr-3 ${
                          property.availability ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Calendar
                          className={`h-4 w-4 ${
                            property.availability
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-base font-medium ${
                          property.availability
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {property.availability ? "Available" : "Not Available"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      href={`/properties/${property.id}`}
                      className={`${
                        isAdmin ? "flex-1" : "w-full"
                      } bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3 rounded-2xl hover:from-amber-600 hover:to-orange-600 text-center block font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                    >
                      View Details & Book
                    </Link>
                    {isAdmin && isAuthenticated && (
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-2xl hover:from-red-600 hover:to-red-700 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        title="Delete property"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
