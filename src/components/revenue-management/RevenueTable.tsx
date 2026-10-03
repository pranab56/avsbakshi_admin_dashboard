"use client";

import { Check, ChevronDown, Filter, Loader2, RotateCcw, Search, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ApiTransaction = {
  _id: string;
  uid?: string;
  user?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    email?: string;
    image?: string;
    status?: string;
    uid?: string;
  };
  reference?: {
    type?: string;
    id?: Record<string, unknown>;
  };
  type?: string;
  gateway?: string;
  gatewayReferenceId?: string;
  amount?: number;
  netAmount?: number;
  currency?: string;
  status?: string;
  isPaid?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

interface RevenueTableProps {
  transactions?: ApiTransaction[];
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (val: string) => void;
  gatewayFilter?: string;
  onGatewayFilterChange?: (val: string) => void;
  onResetFilters?: () => void;
}

function ModernStatusDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { label: "All Status", value: "all", color: "bg-neutral-400" },
    { label: "Pending", value: "pending", color: "bg-[#B07D2B]" },
    { label: "Successful", value: "successful", color: "bg-[#2C7446]" },
    { label: "Completed", value: "completed", color: "bg-[#065F46]" },
    { label: "Failed", value: "failed", color: "bg-[#D9383A]" },
  ];

  const currentOption = options.find((opt) => opt.value.toLowerCase() === value.toLowerCase()) || options[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 bg-white hover:bg-neutral-50 border border-black/5 rounded-xl h-10 px-3.5 text-xs font-semibold text-[#1E1E1E] shadow-2xs transition-all cursor-pointer min-w-[130px] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/40"
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${currentOption.color}`} />
          <span>{currentOption.label}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 bg-white border border-black/5 rounded-xl shadow-lg py-1.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${value.toLowerCase() === option.value.toLowerCase()
                  ? "bg-[#F3F0EA] text-[#B07D2B] font-semibold"
                  : "text-neutral-700 hover:bg-neutral-50"
                }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                <span>{option.label}</span>
              </span>
              {value.toLowerCase() === option.value.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-[#B07D2B]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RevenueTable({
  transactions = [],
  isLoading = false,
  searchTerm = "",
  onSearchChange,
  statusFilter = "all",
  onStatusFilterChange,
  gatewayFilter = "all",
  onResetFilters,
}: RevenueTableProps) {
  const getStatusBadge = (status?: string) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "successful":
      case "completed":
        return (
          <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#DDF0E4] text-[#2C7446]">
            Successful
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#FCE6E4] text-[#D9383A]">
            Failed
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#FDF1DB] text-[#B07D2B]">
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
    return `${symbol}${amount ?? 0}`;
  };

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== "all" || gatewayFilter !== "all");

  return (
    <div className="space-y-4">
      {/* Search & Filter Top Bar */}
      {onSearchChange && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search user, email, transaction UID or gateway ref..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-black/5 rounded-lg h-10 pl-10 pr-4 text-xs sm:text-sm text-[#1E1E1E] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 transition-all"
            />
          </div>

          {/* Filters & Reset */}
          <div className="flex flex-wrap items-center gap-3">
            {onStatusFilterChange && (
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-xs font-semibold text-neutral-600 whitespace-nowrap">Status:</span>
                <ModernStatusDropdown value={statusFilter} onChange={onStatusFilterChange} />
              </div>
            )}

            {hasActiveFilters && onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#B07D2B] hover:text-[#916521] px-3 py-2 rounded-lg bg-white border border-black/5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-[#E1DDD4] rounded-xl shadow-xs border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#F3F0EA] border-b border-black/5 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase">
                <th className="py-4 px-6">TRANSACTION UID</th>
                <th className="py-4 px-6">USER / CLIENT</th>
                <th className="py-4 px-6">TYPE / GATEWAY</th>
                <th className="py-4 px-6">DATE & TIME</th>
                <th className="py-4 px-6">AMOUNT</th>
                <th className="py-4 px-6 text-right sm:text-center">STATUS</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-black/5 text-sm text-[#1E1E1E] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#A67528]" />
                      <span className="text-sm font-medium">Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500 text-sm font-medium">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => {
                  const userName =
                    `${trx.user?.firstName || ""} ${trx.user?.lastName || ""}`.trim() ||
                    "User";
                  const refType = trx.reference?.type
                    ? trx.reference.type.replace("_", " ").toUpperCase()
                    : trx.type
                      ? trx.type.toUpperCase()
                      : "PAYMENT";

                  return (
                    <tr
                      key={trx._id}
                      className="hover:bg-neutral-50/80 transition-colors"
                    >
                      {/* Transaction UID Column */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-[#1E1E1E]">
                            {trx.uid || `#${trx._id.slice(-8)}`}
                          </span>
                          {trx.gatewayReferenceId && (
                            <span className="text-[10px] text-neutral-400 max-w-[140px] truncate" title={trx.gatewayReferenceId}>
                              {trx.gatewayReferenceId}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Client/User Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center">
                            {trx.user?.image ? (
                              <Image
                                src={trx.user.image}
                                alt={userName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <UserIcon className="w-4 h-4 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#1E1E1E] text-xs sm:text-sm">
                              {userName}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-normal">
                              {trx.user?.email || trx.user?.role || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type / Gateway Column */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#F3F0EA] text-[#B07D2B] w-fit">
                            {refType}
                          </span>
                          <span className="text-[11px] text-neutral-500 capitalize mt-1">
                            Gateway: {trx.gateway || "Stripe"}
                          </span>
                        </div>
                      </td>

                      {/* Date & Time Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-700 whitespace-nowrap">
                        {formatDate(trx.createdAt)}
                      </td>

                      {/* Amount Column */}
                      <td className="py-4 px-6 font-serif italic font-bold text-sm text-[#1E1E1E]">
                        {formatCurrency(trx.amount, trx.currency)}
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-6 text-right sm:text-center">
                        {getStatusBadge(trx.status)}
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
