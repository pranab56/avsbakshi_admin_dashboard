"use client";

import BookingTable from "@/components/reservation-management/BookingTable";
import BookingTabs, { BookingTab } from "@/components/reservation-management/BookingTabs";
import UserPagination from "@/components/user-management/UserPagination";
import { useState } from "react";

export default function BookingsManagementPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>("All");
  const [currentPage, setCurrentPage] = useState("01");

  return (
    <div className="space-y-6 select-none">
      {/* ── Page Header Title ── */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
          Bookings Management
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
          Oversee and manage all salon appointments and schedules.
        </p>
      </div>

      {/* ── Filter Tabs Component ── */}
      <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Bookings Table Component ── */}
      <BookingTable activeTab={activeTab} />

      {/* ── Pagination Component ── */}
      <UserPagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
