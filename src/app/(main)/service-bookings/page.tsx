"use client";

import BookingTable from "@/components/reservation-management/BookingTable";
import BookingTabs, { BookingTab } from "@/components/reservation-management/BookingTabs";
import UserPagination from "@/components/user-management/UserPagination";
import { useGetAllAppointmentsQuery } from "@/features/appointment/appointmentApi";
import { useState } from "react";

export default function BookingsManagementPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Construct query parameters
  const queryParams: Record<string, string | number> = {
    page: currentPage,
    limit: 10,
  };

  if (activeTab !== "All") {
    queryParams.status = activeTab.toLowerCase().replace(" ", "_");
  }

  if (paymentStatusFilter !== "all") {
    queryParams.paymentStatus = paymentStatusFilter.toLowerCase();
  }

  if (searchTerm.trim()) {
    queryParams.searchTerm = searchTerm.trim();
  }

  const { data: response, isLoading } = useGetAllAppointmentsQuery(queryParams);

  const appointments = response?.data || [];
  const totalPages = response?.pagination?.totalPage || response?.pagination?.totalPages || 1;

  const handleTabChange = (tab: BookingTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePaymentStatusChange = (value: string) => {
    setPaymentStatusFilter(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setPaymentStatusFilter("all");
    setCurrentPage(1);
  };

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
      <BookingTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ── Bookings Table Component ── */}
      <BookingTable
        appointments={appointments}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusChange={handlePaymentStatusChange}
        onResetFilters={handleResetFilters}
      />

      {/* ── Pagination Component ── */}
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(Number(page))}
      />
    </div>
  );
}

