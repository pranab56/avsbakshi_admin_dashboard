"use client";

import { useUpdateStatusMutation } from "@/features/users/usersApi";
import { Loader2, Search, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export type ApiUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  role?: string;
  isSalonOwner?: boolean;
  status?: string; // "active" | "inactive" | "blocked"
  createdAt?: string;
  uid?: string;
};

interface UserTableProps {
  users: ApiUser[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export default function UserTable({
  users = [],
  isLoading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: UserTableProps) {
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusToggle = async (userId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    setUpdatingId(userId);
    try {
      const res = await updateStatus({ userId, status: nextStatus }).unwrap();
      toast.success(res?.message || `User status updated to ${nextStatus}`);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string; errorMessages?: Array<{ message?: string }> } };
      toast.error(apiErr?.data?.message || apiErr?.data?.errorMessages?.[0]?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (user: ApiUser) => {
    if (user.isSalonOwner) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[#B07D2B] font-semibold text-xs">
          <span className="text-[10px]">●</span> Salon Owner
        </span>
      );
    }
    const role = user.role || "customer";
    const capitalized = role.charAt(0).toUpperCase() + role.slice(1);
    return (
      <span className="inline-flex items-center gap-1.5 text-[#B07D2B] font-semibold text-xs">
        <span className="text-[10px]">●</span> {capitalized}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email or UID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-black/5 rounded-lg h-10 pl-10 pr-4 text-xs sm:text-sm text-[#1E1E1E] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-neutral-600 whitespace-nowrap">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-white border border-black/5 rounded-lg h-10 px-3 text-xs text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#E1DDD4] rounded-xl shadow-xs border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#F3F0EA] border-b border-black/5 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase">
                <th className="py-4 px-6">USER</th>
                <th className="py-4 px-6">ROLE / TYPE</th>
                <th className="py-4 px-6">UID</th>
                <th className="py-4 px-6">JOINED DATE</th>
                <th className="py-4 px-6 text-center">STATUS</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-black/5 text-sm text-[#1E1E1E] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#A67528]" />
                      <span className="text-sm font-medium">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500 text-sm font-medium">
                    No users found matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
                  const isActive = user.status === "active";
                  const isCurrentUpdating = updatingId === user._id;

                  return (
                    <tr key={user._id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* User Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={fullName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <UserIcon className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#1E1E1E] text-sm leading-tight">
                              {fullName}
                            </span>
                            <span className="text-xs text-neutral-500 font-normal leading-tight mt-1">
                              {user.email || "No email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="py-4 px-6 font-medium text-xs">
                        {getRoleBadge(user)}
                      </td>

                      {/* UID Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-600">
                        {user.uid || user._id?.slice(-8)}
                      </td>

                      {/* Joined Date Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-700">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium ${isActive
                              ? "bg-[#DDF0E4] text-[#2C7446]"
                              : "bg-[#FCE6E4] text-[#D9383A]"
                            }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Action Column (Switch Toggle) */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {isCurrentUpdating && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A67528]" />
                          )}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            title={isActive ? "Deactivate user" : "Activate user"}
                            disabled={isCurrentUpdating || isUpdating}
                            onClick={() => handleStatusToggle(user._id, user.status)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#A67528]/50 disabled:opacity-50 ${isActive ? "bg-[#2C7446]" : "bg-neutral-300"
                              }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
