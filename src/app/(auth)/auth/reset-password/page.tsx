"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "../../../../features/auth/authApi";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const validate = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!token) {
      toast.error("Reset token is missing or invalid. Please request OTP again.");
      return;
    }

    try {
      const res = await resetPassword({
        token,
        data: {
          newPassword: password,
          confirmPassword: confirmPassword,
        },
      }).unwrap();

      toast.success(res?.message || "Your password has been successfully reset.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string; errorMessages?: Array<{ message?: string }> } };
      const errorMessage =
        apiErr?.data?.message ||
        apiErr?.data?.errorMessages?.[0]?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF9] font-sans items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-10 bg-[#FDFDFD] rounded-xl border border-black/5 shadow-xs flex flex-col items-center text-center"
        >
          {/* Logo */}
          <div className="mb-3">
            <Image
              src="/icons/logo.png"
              alt="Cloud Salon Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Title & Subtitle */}
          <h2 className="font-serif italic text-2xl sm:text-3xl font-medium text-[#1E1E1E] mb-1">
            Set a new password
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mb-6">
            Your new password must be different from previously used password.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
            {/* New Password */}
            <div>
              <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="8+ characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={`w-full bg-[#F3F0EA] border ${
                    errors.password
                      ? "border-gray-200 focus:ring-gray-200/50"
                      : "border-black/5 focus:ring-[#AC6135]/50"
                  } rounded-lg h-11 px-4 pr-11 text-sm text-[#1E1E1E] placeholder:text-neutral-500/70 focus:outline-none focus:ring-2 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className={`w-full bg-[#F3F0EA] border ${
                    errors.confirmPassword
                      ? "border-gray-200 focus:ring-gray-200/50"
                      : "border-black/5 focus:ring-[#AC6135]/50"
                  } rounded-lg h-11 px-4 pr-11 text-sm text-[#1E1E1E] placeholder:text-neutral-500/70 focus:outline-none focus:ring-2 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#B78735] hover:bg-[#B78735]/90 text-white rounded-lg text-sm font-medium transition-all shadow-2xs cursor-pointer flex items-center justify-center"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-4 border-t border-black/5 w-full text-center">
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-[#B78735] hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

