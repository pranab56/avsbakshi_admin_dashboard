"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useForgotEmailMutation } from "../../../../features/auth/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const [forgotEmail, { isLoading: isLoadingForgotPassword }] = useForgotEmailMutation();
  const router = useRouter();

  const validate = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const res = await forgotEmail({ email }).unwrap();
      toast.success(
        res?.message || "Please check your email. We have sent you a one-time passcode (OTP)."
      );
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string; errorMessages?: Array<{ message?: string }> } };
      const errorMessage =
        apiErr?.data?.message ||
        apiErr?.data?.errorMessages?.[0]?.message ||
        "Failed to send OTP. Please try again.";
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
            Forgot password
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mb-6">
            Enter your registered email to receive a verification OTP.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                disabled={isLoadingForgotPassword || isSuccess}
                className={`w-full bg-[#F3F0EA] border ${errors.email
                  ? "border-gray-200 focus:ring-gray-200/50"
                  : "border-black/5 focus:ring-[#AC6135]/50"
                  } rounded-lg h-11 px-4 text-sm text-[#1E1E1E] placeholder:text-neutral-500/70 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoadingForgotPassword || isSuccess}
                className="w-full h-11 bg-[#B78735] hover:bg-[#B78735]/90 text-white rounded-lg text-sm font-medium transition-all shadow-2xs cursor-pointer flex items-center justify-center"
              >
                {isLoadingForgotPassword
                  ? "Sending..."
                  : isSuccess
                  ? "Code Sent!"
                  : "Send OTP"}
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



