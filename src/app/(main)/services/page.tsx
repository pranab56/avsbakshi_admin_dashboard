"use client";

import AllServicesTab from "@/components/services/AllServicesTab";
import ServicesBookingTab from "@/components/services/ServicesBookingTab";
import { CalendarCheck, Scissors } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const isBookingTab =
    tabParam === "services-booking" ||
    tabParam === "bookings" ||
    tabParam === "service-bookings";

  const [activeTab, setActiveTab] = useState<"all-services" | "services-booking">(
    isBookingTab ? "services-booking" : "all-services"
  );

  useEffect(() => {
    if (isBookingTab) {
      setActiveTab("services-booking");
    } else if (tabParam === "all-services" || tabParam === "services") {
      setActiveTab("all-services");
    }
  }, [tabParam, isBookingTab]);

  const handleTabChange = (tab: "all-services" | "services-booking") => {
    setActiveTab(tab);
    const newUrl = tab === "services-booking" ? "/services?tab=services-booking" : "/services";
    router.replace(newUrl, { scroll: false });
  };

  return (
    <div className="space-y-6 select-none">
      {/* ── Page Header & Top Tabs ── */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
            {activeTab === "all-services" ? "All Services" : "Services Booking"}
          </h1>
          <p className="text-xs sm:text-sm text-[#706E6B] font-normal mt-1">
            {activeTab === "all-services"
              ? "Browse, manage, and verify all salon beauty services, pricing, and active status."
              : "Oversee and manage all salon appointments and schedules."}
          </p>
        </div>

        {/* ── Top Tabs Navigation ── */}
        <div className="inline-flex items-center p-1.5 bg-[#EAE5DC] rounded-xl border border-black/5 gap-1.5 shadow-2xs w-fit">
          <button
            type="button"
            onClick={() => handleTabChange("all-services")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "all-services"
                ? "bg-white text-[#1E1E1E] shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Scissors
              className={`w-4 h-4 ${
                activeTab === "all-services" ? "text-[#B07D2B]" : "text-neutral-500"
              }`}
            />
            <span>All Services</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("services-booking")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "services-booking"
                ? "bg-white text-[#1E1E1E] shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <CalendarCheck
              className={`w-4 h-4 ${
                activeTab === "services-booking" ? "text-[#B07D2B]" : "text-neutral-500"
              }`}
            />
            <span>Services Booking</span>
          </button>
        </div>
      </div>

      {/* ── Dynamic Tab Content ── */}
      {activeTab === "all-services" ? <AllServicesTab /> : <ServicesBookingTab />}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-neutral-500 text-sm font-medium">
          Loading services...
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
