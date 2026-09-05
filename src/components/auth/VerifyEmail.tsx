"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const [otp, setOtp] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [isLoadingOTPCheck, setIsLoadingOTPCheck] = useState<boolean>(false);
  const [isLoadingResendOTP, setIsLoadingResendOTP] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoadingOTPCheck(true);
    setTimeout(() => {
      setIsLoadingOTPCheck(false);
      toast.success("OTP verified successfully!");
      router.push(
        `/auth/reset-password?token=mock-reset-token-12345&forgetOtpMatchToken=mock-reset-token-12345`
      );
    }, 600);
  };

  const handleResend = () => {
    if (countdown > 0) return;

    setIsLoadingResendOTP(true);
    setTimeout(() => {
      setIsLoadingResendOTP(false);
      toast.success("Verification code resent!");
      setCountdown(60);
    }, 600);
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
            Verify email
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mb-6">
            We have sent a verification code to{" "}
            <span className="font-medium text-[#1E1E1E]">
              {email || "your email"}
            </span>.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5 flex flex-col items-center">
            <div className="w-full flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-1.5 sm:gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-10 h-10 sm:w-11 sm:h-11 border-black/5 rounded-lg text-base bg-[#F3F0EA] text-[#1E1E1E] focus:ring-2 focus:ring-[#AC6135]/50"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-10 h-10 sm:w-11 sm:h-11 border-black/5 rounded-lg text-base bg-[#F3F0EA] text-[#1E1E1E] focus:ring-2 focus:ring-[#AC6135]/50"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-10 h-10 sm:w-11 sm:h-11 border-black/5 rounded-lg text-base bg-[#F3F0EA] text-[#1E1E1E] focus:ring-2 focus:ring-[#AC6135]/50"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-10 h-10 sm:w-11 sm:h-11 border-black/5 rounded-lg text-base bg-[#F3F0EA] text-[#1E1E1E] focus:ring-2 focus:ring-[#AC6135]/50"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-10 h-10 sm:w-11 sm:h-11 border-black/5 rounded-lg text-base bg-[#F3F0EA] text-[#1E1E1E] focus:ring-2 focus:ring-[#AC6135]/50"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-10 h-10 sm:w-11 sm:h-11 border-black/5 rounded-lg text-base bg-[#F3F0EA] text-[#1E1E1E] focus:ring-2 focus:ring-[#AC6135]/50"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <button
              type="submit"
              disabled={isLoadingOTPCheck || otp.length !== 6}
              className="w-full h-11 bg-[#B78735] hover:bg-[#B78735]/90 text-white rounded-lg text-sm font-medium transition-all shadow-2xs cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {isLoadingOTPCheck ? "Verifying..." : "Verify Code"}
            </button>

            <div className="text-xs text-neutral-500">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoadingResendOTP || countdown > 0}
                className="text-[#B78735] font-semibold cursor-pointer hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {isLoadingResendOTP
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend"}
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



