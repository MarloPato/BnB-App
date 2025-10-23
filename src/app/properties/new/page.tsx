"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { propertiesApi } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Home,
  MapPin,
  DollarSign,
  FileText,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  pricepernight: z.number().min(1, "Price must be greater than 0"),
  availability: z.boolean(),
});

type PropertyForm = z.infer<typeof propertySchema>;

export default function NewPropertyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      availability: true,
    },
  });

  const availability = watch("availability");

  const onSubmit = async (data: PropertyForm) => {
    setIsLoading(true);
    setError("");

    try {
      await propertiesApi.create(data);
      router.push("/properties");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create property");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to create properties
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Property
            </h1>
            <p className="text-gray-600 mt-2">
              Create a new BnB listing for guests to book.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Property Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("name")}
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Cozy Downtown Apartment"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your property, amenities, and what makes it special..."
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("location")}
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Stockholm, Sweden"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="pricepernight"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price per Night (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("pricepernight", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  step="0.01"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
              {errors.pricepernight && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pricepernight.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setValue("availability", !availability)}
                  className="flex items-center space-x-2"
                >
                  {availability ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      availability ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {availability ? "Available for booking" : "Not available"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Property"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
