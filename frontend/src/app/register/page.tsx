"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError("");

    try {
      await registerUser(data.name, data.email, data.password);
      router.push("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-amber-100/50">
          <div className="mb-8">
            <h2 className="text-4xl font-semibold text-center text-gray-800 mb-3 tracking-tight">
              Join us! ✨
            </h2>
            <p className="text-center text-gray-600">
              Or{" "}
              <Link
                href="/login"
                className="font-medium text-amber-600 hover:text-orange-600 transition-colors"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="sr-only">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    {...register("name")}
                    type="text"
                    autoComplete="name"
                    className="w-full px-4 py-3.5 pl-12 border-2 border-amber-200 rounded-2xl placeholder-gray-400 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    placeholder="Full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    className="w-full px-4 py-3.5 pl-12 border-2 border-amber-200 rounded-2xl placeholder-gray-400 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    placeholder="Email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 pl-12 pr-12 border-2 border-amber-200 rounded-2xl placeholder-gray-400 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-amber-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 pl-12 pr-12 border-2 border-amber-200 rounded-2xl placeholder-gray-400 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-amber-500" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50/90 border-2 border-red-200 p-4">
                <div className="text-sm text-red-700 font-medium">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-base font-medium rounded-2xl text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
