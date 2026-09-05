"use client";

import BarChart from "@/components/overview/BarChart";
import CardStates from "@/components/overview/CardStates";
import Performance from "@/components/overview/Performance";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* ── Page Header Title ── */}
      <div>
        <p className="text-xs sm:text-sm text-[#706E6B] font-normal">
          Performance metrics and platform health for the last 30 days.
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-normal tracking-tight mt-1">
          Marketplace Overview
        </h1>
      </div>

      {/* ── Row 1: 3 Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <CardStates title="Total Customers" number="24,850" />
        <CardStates title="Professionals" number="24,850" />
        <CardStates title="Total Bookings" number="18,492" />
      </div>

      {/* ── Row 2: Revenue Chart & Service Performance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column: Revenue Overview (Recharts Bar Chart Component) */}
        <BarChart />

        {/* Right Column: Service Performance Component */}
        <div className="lg:col-span-1 bg-[#FDFDFD] rounded-xl p-6 shadow-sm sm:p-7 border border-black/5 flex flex-col justify-between">
          <Performance />
        </div>
      </div>
    </div>
  );
}
