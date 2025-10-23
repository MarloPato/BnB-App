"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { propertiesApi, bookingsApi } from "@/lib/api";
import { Property } from "../../../types";
import {
  Home,
  MapPin,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function PropertyDetailPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();

  const propertyId = params.id as string;

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      const data = await propertiesApi.getById(propertyId);
      setProperty(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to fetch property");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, fetchProperty]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError("Please select both check-in and check-out dates");
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      setError("Check-out date must be after check-in date");
      return;
    }

    if (checkIn < new Date()) {
      setError("Check-in date cannot be in the past");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");

      await bookingsApi.create({
        property_id: propertyId,
        checkindate: checkInDate,
        checkoutdate: checkOutDate,
      });

      setBookingSuccess(true);
      setCheckInDate("");
      setCheckOutDate("");

      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        router.push("/bookings");
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!property || !checkInDate || !checkOutDate) return 0;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff * property.pricepernight;
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Property not found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Properties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <Home className="h-16 w-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {property.name}
                </h1>
                <p className="text-gray-600 mb-6">{property.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 mr-3" />
                    <span className="text-2xl font-bold text-green-600">
                      ${property.pricepernight}
                    </span>
                    <span className="ml-2">per night</span>
                  </div>
                  <div className="flex items-center">
                    {property.availability ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-3" />
                    )}
                    <span
                      className={
                        property.availability
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {property.availability ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            {bookingSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>
                    Booking created successfully! Redirecting to your
                    bookings...
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Book this property
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={
                        checkInDate || new Date().toISOString().split("T")[0]
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {checkInDate && checkOutDate && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          {calculateNights()} nights
                        </span>
                        <span className="text-sm text-gray-600">
                          ${property.pricepernight} per night
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">
                            Total
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            ${calculateTotalPrice()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      bookingLoading ||
                      !property.availability ||
                      !isAuthenticated
                    }
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Booking...
                      </>
                    ) : !isAuthenticated ? (
                      "Please log in to book"
                    ) : !property.availability ? (
                      "Property not available"
                    ) : (
                      "Book Now"
                    )}
                  </button>
                </form>

                {!isAuthenticated && (
                  <p className="text-center text-sm text-gray-600 mt-4">
                    <button
                      onClick={() => router.push("/login")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Sign in
                    </button>{" "}
                    to make a booking
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
