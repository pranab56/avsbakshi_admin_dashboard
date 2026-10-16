"use client";

import UserPagination from "@/components/user-management/UserPagination";
import UserTable, { ApiUser } from "@/components/user-management/UserTable";
import { useGetAllUsersQuery } from "@/features/users/usersApi";
import { useMemo, useState } from "react";

export default function CustomerManagementPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: usersResponse, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: 10,
    searchTerm,
    status: statusFilter,
    role: "customer",
  });

  const rawUsers: ApiUser[] = usersResponse?.data || [];

  // Filter strictly for customers
  const customers = useMemo(() => {
    return rawUsers.filter((u) => (u.role || "customer").toLowerCase() === "customer");
  }, [rawUsers]);

  const pagination = usersResponse?.pagination || {
    total: customers.length,
    totalPage: 1,
    page: currentPage,
    limit: 10,
  };

  return (
    <div className="space-y-6 select-none">
      {/* ── Page Title Header ── */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
          Customer Management
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
          Oversee and manage all registered customer accounts across the platform.
        </p>
      </div>

      {/* ── Customer Table ── */}
      <UserTable
        users={customers}
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
        searchPlaceholder="Search customers by name, email or UID..."
        emptyText="No customer accounts found matching criteria."
      />

      {/* ── Row 3: Pagination ── */}
      <UserPagination
        currentPage={currentPage}
        totalPages={pagination.totalPage || 1}
        onPageChange={(page) => setCurrentPage(Number(page))}
      />
    </div>
  );
}
