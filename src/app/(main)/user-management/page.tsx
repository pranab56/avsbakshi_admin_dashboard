"use client";

import UserPagination from "@/components/user-management/UserPagination";
import UserStats from "@/components/user-management/UserStats";
import UserTable from "@/components/user-management/UserTable";
import { useState } from "react";

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState("01");

  return (
    <div className="space-y-6 select-none">
      {/* ── Page Title Header ── */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
          User Management
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
          Oversee and manage all accounts across the platform.
        </p>
      </div>

      {/* ── Row 1: Stat Cards Component ── */}
      <UserStats />

      {/* ── Row 2: User Table Component ── */}
      <UserTable />

      {/* ── Row 3: Pagination Component ── */}
      <UserPagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
