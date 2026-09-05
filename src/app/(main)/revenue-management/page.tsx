"use client";

import RevenueStats from "@/components/revenue-management/RevenueStats";
import RevenueTable from "@/components/revenue-management/RevenueTable";
import UserPagination from "@/components/user-management/UserPagination";
import { useState } from "react";

export default function TransactionsHistoryPage() {
  const [currentPage, setCurrentPage] = useState("01");

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
      <RevenueTable />

      {/* ── Row 3: Pagination Component ── */}
      <UserPagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
