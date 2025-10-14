"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { bookingsApi } from "@/lib/api";
import { Booking } from "@/types";
import { Calendar, Home, MapPin, DollarSign, Trash2, Edit } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsApi.getAll();
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await bookingsApi.delete(id);
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to cancel booking");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view bookings
          </h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your BnB reservations and bookings.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by browsing available properties and making your first
              booking.
            </p>
            <a
              href="/properties"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Properties
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {booking.properties?.name || "Property Name"}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {booking.properties?.location || "Location"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${booking.totalPrice}
                    </div>
                    <div className="text-sm text-gray-500">
                      {calculateNights(
                        booking.checkInDate,
                        booking.checkOutDate
                      )}{" "}
                      nights
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Check-in
                    </label>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {formatDate(booking.checkInDate)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Check-out
                    </label>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {formatDate(booking.checkOutDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.properties && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          ${booking.properties.pricePerNight} per night
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            /* TODO: Implement edit booking */
                          }}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 flex items-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
