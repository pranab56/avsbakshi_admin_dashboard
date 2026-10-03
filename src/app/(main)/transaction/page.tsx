"use client";

import RevenueStats from "@/components/revenue-management/RevenueStats";
import RevenueTable from "@/components/revenue-management/RevenueTable";
import UserPagination from "@/components/user-management/UserPagination";
import { useGetAllTransactionQuery } from "@/features/transaction/transactionApi";
import { useState } from "react";

export default function TransactionsHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryParams: Record<string, string | number> = {
    page: currentPage,
    limit: 10,
  };

  if (searchTerm.trim()) {
    queryParams.searchTerm = searchTerm.trim();
  }

  if (statusFilter !== "all") {
    queryParams.status = statusFilter.toLowerCase();
  }

  const { data: response, isLoading } = useGetAllTransactionQuery(queryParams);

  const transactions = response?.data || [];
  const totalPages = response?.pagination?.totalPage || response?.pagination?.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 select-none">
      {/* ── Page Header Title ── */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
          Transactions History
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
          Overview of financial transactions, refunds, and payouts.
        </p>
      </div>

      {/* ── Row 1: Stat Cards Component ── */}
      <RevenueStats />

      {/* ── Row 2: Transactions Table Component ── */}
      <RevenueTable
        transactions={transactions}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* ── Row 3: Pagination Component ── */}
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(Number(page))}
      />
    </div>
  );
}
