"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { propertiesApi } from "@/lib/api";
import { Property } from "../../types";
import {
  Home,
  Plus,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
} from "lucide-react";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties();
    }
  }, [isAuthenticated]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertiesApi.getMyProperties();
      setProperties(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/50">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-amber-100/50">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Please log in to view properties
          </h1>
          <Link
            href="/login"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 font-medium">
            Loading properties...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 tracking-tight">
            My Properties
          </h1>
          <Link
            href="/properties/new"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Add Property</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50/90 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 shadow-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {properties.length === 0 ? (
          <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-amber-100/50">
            <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 mb-6">
              <Home className="h-16 w-16 text-amber-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No properties yet
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Get started by adding your first BnB property.
            </p>
            <Link
              href="/properties/new"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium inline-block"
            >
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        ${property.pricepernight} per night
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span
                        className={`text-sm ${
                          property.availability
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {property.availability ? "Available" : "Not Available"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/properties/${property.id}/edit`}
                      className="flex-1 bg-amber-50 text-amber-700 border-2 border-amber-200 px-3 py-2 rounded-2xl text-center hover:bg-amber-100 flex items-center justify-center space-x-1 transition-all duration-300 font-medium"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-2xl hover:from-red-600 hover:to-red-700 flex items-center justify-center space-x-1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
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
