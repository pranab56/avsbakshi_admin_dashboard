"use client";

import BarChart from "@/components/overview/BarChart";
import CardStates from "@/components/overview/CardStates";
import { useOverviewQuery } from "@/features/analytics/analyticsApi";

export default function DashboardPage() {
  const { data: overviewResponse, isLoading } = useOverviewQuery({});
  const overview = overviewResponse?.data;

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

      {/* ── Row 1: Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <CardStates
          title="Total Customers"
          number={overview?.totalCustomers ?? 0}
          isLoading={isLoading}
        />
        <CardStates
          title="Professionals"
          number={overview?.totalProfessionals ?? 0}
          isLoading={isLoading}
        />
        <CardStates
          title="Total Salons"
          number={overview?.totalSalons ?? 0}
          isLoading={isLoading}
        />
        <CardStates
          title="Total Bookings"
          number={overview?.totalAppointments ?? 0}
          isLoading={isLoading}
        />
        <CardStates
          title="Total Reviews"
          number={overview?.totalReviews ?? 0}
          isLoading={isLoading}
        />
      </div>

      {/* ── Row 2: User Growth Chart & Service Performance ── */}
      <div className="">
        {/* Left Column: User Growth Chart (Recharts Bar Chart Component) */}
        <BarChart />

        {/* Right Column: Service Performance Component */}
        {/* <div className="lg:col-span-1 bg-[#FDFDFD] rounded-xl p-6 shadow-sm sm:p-7 border border-black/5 flex flex-col justify-between">
          <Performance />
        </div> */}
      </div>
    </div>
  );
}
