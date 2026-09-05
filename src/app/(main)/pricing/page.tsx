"use client";

import { Check, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "Basic",
      tagline: "Perfect for independent stylists and small boutique salons.",
      monthlyPrice: 29,
      annualPrice: 24,
      isPopular: false,
      buttonText: "Choose Starter",
      buttonVariant: "outline",
      features: [
        "Up to 2 Staff Members",
        "Basic Appointment Scheduling",
        "Client Management (up to 500)",
        "Email Notifications",
        "Standard Support",
      ],
    },
    {
      name: "Pro",
      tagline: "Ideal for growing salons looking to manage team schedules & revenue.",
      monthlyPrice: 79,
      annualPrice: 64,
      isPopular: true,
      buttonText: "Upgrade to Pro",
      buttonVariant: "solid",
      features: [
        "Up to 10 Staff Members",
        "Advanced Booking & Calendar Sync",
        "Unlimited Clients & CRM",
        "SMS & Email Reminders",
        "Detailed Financial Analytics",
        "Priority 24/7 Support",
      ],
    },
    {
      name: "Enterprise",
      tagline: "For large multi-location salons & franchises with custom needs.",
      monthlyPrice: 199,
      annualPrice: 159,
      isPopular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      features: [
        "Unlimited Staff Members",
        "Multi-Location Salon Management",
        "Custom API & Integrations",
        "Dedicated Account Manager",
        "Custom Revenue Reports",
        "99.9% Uptime SLA",
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto select-none">
      {/* ── Page Header Title ── */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
          Pricing Plans
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal">
          Choose the ideal plan for your salon business and scale effortlessly.
        </p>

        {/* ── Billing Cycle Toggle ── */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-[#DCD5C9] p-1 rounded-2xl flex items-center gap-1 border border-black/5 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#A67528] text-white shadow-sm"
                  : "text-neutral-700 hover:text-neutral-900"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-[#A67528] text-white shadow-sm"
                  : "text-neutral-700 hover:text-neutral-900"
              }`}
            >
              <span>Annual</span>
              <span className="bg-[#DDF0E4] text-[#2C7446] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3 Pricing Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
        {plans.map((plan) => {
          const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;

          return (
            <div
              key={plan.name}
              className={`relative bg-[#E1DDD4] rounded-2xl p-7 shadow-sm border flex flex-col justify-between transition-all duration-200 ${
                plan.isPopular
                  ? "border-[#A67528] ring-2 ring-[#A67528]/30 shadow-md"
                  : "border-black/5"
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#A67528] text-white text-[11px] font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> Most Popular
                  </span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif italic text-[#1E1E1E] font-medium">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed min-h-[36px]">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-serif italic font-medium text-[#1E1E1E]">
                    ${price}
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    / month {billingCycle === "annual" && "(billed yearly)"}
                  </span>
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-2 pb-6 border-t border-black/5">
                  <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    What&apos;s included:
                  </p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#DDF0E4] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#2C7446]" strokeWidth={3} />
                      </div>
                      <span className="text-xs text-neutral-800 font-medium leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs ${
                  plan.buttonVariant === "solid"
                    ? "bg-[#A67528] hover:bg-[#8e6320] text-white"
                    : "bg-[#DCD5C9] hover:bg-[#d0c8bb] text-[#1E1E1E] border border-black/5"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Guarantee & Trust Banner ── */}
      <div className="bg-[#E1DDD4] rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col sm:flex-row items-center justify-around gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDF1DB] flex items-center justify-center shrink-0 text-[#B07D2B]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1E1E1E]">14-Day Free Trial</h4>
            <p className="text-xs text-neutral-500">Test all Pro features with zero risk</p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-black/10" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DDF0E4] flex items-center justify-center shrink-0 text-[#2C7446]">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1E1E1E]">No Hidden Fees</h4>
            <p className="text-xs text-neutral-500">Transparent pricing for every salon size</p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-black/10" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE6E4] flex items-center justify-center shrink-0 text-[#D9383A]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1E1E1E]">Cancel Anytime</h4>
            <p className="text-xs text-neutral-500">Switch or cancel your plan whenever you want</p>
          </div>
        </div>
      </div>
    </div>
  );
}
