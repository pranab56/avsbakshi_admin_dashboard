"use client";

import UserPagination from "@/components/user-management/UserPagination";
import UserStats from "@/components/user-management/UserStats";
import UserTable from "@/components/user-management/UserTable";
import { useGetAllUsersQuery } from "@/features/users/usersApi";
import { useState } from "react";

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: usersResponse, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: 10,
    searchTerm,
    status: statusFilter,
  });

  const users = usersResponse?.data || [];
  const pagination = usersResponse?.pagination || { total: 0, totalPage: 1, page: 1, limit: 10 };

  const totalUsers = pagination.total || users.length;
  const customersCount = users.filter((u: { role?: string }) => u.role === "customer").length;
  const professionalsCount = users.filter((u: { role?: string; isSalonOwner?: boolean }) => u.role === "professional" || u.isSalonOwner).length;

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
      <UserStats
        totalUsers={totalUsers}
        totalCustomers={customersCount}
        totalProfessionals={professionalsCount}
      />

      {/* ── Row 2: User Table Component ── */}
      <UserTable
        users={users}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
      />

      {/* ── Row 3: Pagination Component ── */}
      <UserPagination
        currentPage={currentPage}
        totalPages={pagination.totalPage || 1}
        onPageChange={(page) => setCurrentPage(Number(page))}
      />
    </div>
  );
}
