"use client";

import { Check, ChevronDown, Filter, Loader2, RotateCcw, Search, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ApiAppointment = {
  _id: string;
  uid?: string;
  customer?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
    role?: string;
  };
  professional?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
  };
  salon?: {
    _id?: string;
    name?: string;
    businessType?: string;
    logo?: string;
    email?: string;
    phone?: string;
  };
  scheduledAt?: string;
  totalDurationInMinutes?: number;
  pricing?: {
    subtotal?: number;
    discount?: number;
    total?: number;
    currency?: string;
  };
  paymentStatus?: string; // "paid" | "unpaid"
  status?: string; // "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  createdAt?: string;
};

interface BookingTableProps {
  appointments: ApiAppointment[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusChange: (value: string) => void;
  onResetFilters: () => void;
}

function ModernPaymentDropdown({
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
    { label: "All Payments", value: "all", color: "bg-neutral-400" },
    { label: "Paid", value: "paid", color: "bg-[#2C7446]" },
    { label: "Unpaid", value: "unpaid", color: "bg-[#B07D2B]" },
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
          className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                value.toLowerCase() === option.value.toLowerCase()
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

export default function BookingTable({
  appointments = [],
  isLoading,
  searchTerm,
  onSearchChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  onResetFilters,
}: BookingTableProps) {
  const getStatusBadge = (status?: string) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#DDF0E4] text-[#2C7446]">
            Confirmed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#E0F2FE] text-[#0369A1]">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#D1FAE5] text-[#065F46]">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#FCE6E4] text-[#D9383A]">
            Cancelled
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

  const getPaymentBadge = (status?: string) => {
    const p = (status || "unpaid").toLowerCase();
    if (p === "paid") {
      return (
        <span className="inline-flex items-center px-3 py-0.5 rounded-lg text-[11px] font-semibold bg-[#DDF0E4] text-[#2C7446]">
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-0.5 rounded-lg text-[11px] font-semibold bg-[#FDF1DB] text-[#B07D2B]">
        Unpaid
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

  return (
    <div className="space-y-4">
      {/* Search & Rich Filter Header Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search customer, salon, email or UID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-black/5 rounded-lg h-10 pl-10 pr-4 text-xs sm:text-sm text-[#1E1E1E] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 transition-all"
          />
        </div>

        {/* Filters & Reset */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-xs font-semibold text-neutral-600 whitespace-nowrap">Payment:</span>
            <ModernPaymentDropdown value={paymentStatusFilter} onChange={onPaymentStatusChange} />
          </div>

          {(searchTerm || paymentStatusFilter !== "all") && (
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

      {/* Table Container */}
      <div className="bg-[#E1DDD4] rounded-xl shadow-xs border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#F3F0EA] border-b border-black/5 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase">
                <th className="py-4 px-6">CUSTOMER</th>
                <th className="py-4 px-6">SALON / PROFESSIONAL</th>
                <th className="py-4 px-6">SCHEDULED AT</th>
                <th className="py-4 px-6">DURATION</th>
                <th className="py-4 px-6">PRICING</th>
                <th className="py-4 px-6 text-center">PAYMENT</th>
                <th className="py-4 px-6 text-right">STATUS</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white text-sm text-[#1E1E1E]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#A67528]" />
                      <span className="text-sm font-medium">Loading appointments...</span>
                    </div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 text-sm font-medium">
                    No appointments found matching criteria.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => {
                  const customerName =
                    `${apt.customer?.firstName || ""} ${apt.customer?.lastName || ""}`.trim() ||
                    "Customer";
                  const profName =
                    `${apt.professional?.firstName || ""} ${apt.professional?.lastName || ""}`.trim() ||
                    "N/A";
                  const salonName = apt.salon?.name || "N/A";

                  return (
                    <tr
                      key={apt._id}
                      className="border-b border-black/5 last:border-b-0 hover:bg-neutral-50/80 transition-colors"
                    >
                      {/* Customer Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center">
                            {apt.customer?.image ? (
                              <Image
                                src={apt.customer.image}
                                alt={customerName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <UserIcon className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#1E1E1E] text-sm leading-tight">
                              {customerName}
                            </span>
                            <span className="text-xs text-neutral-500 font-normal leading-tight mt-1">
                              {apt.customer?.email || apt.uid || "No email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Salon & Professional Column */}
                      <td className="py-4 px-6 font-medium text-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#1E1E1E] text-xs">
                            {salonName}
                          </span>
                          <span className="text-[11px] text-[#B07D2B] font-medium mt-0.5">
                            Prof: {profName}
                          </span>
                        </div>
                      </td>

                      {/* Scheduled Time Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-700 whitespace-nowrap">
                        {formatDate(apt.scheduledAt)}
                      </td>

                      {/* Duration Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-700">
                        {apt.totalDurationInMinutes ? `${apt.totalDurationInMinutes} min` : "N/A"}
                      </td>

                      {/* Pricing Column */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-serif italic font-bold text-sm text-[#1E1E1E]">
                            {formatCurrency(apt.pricing?.total, apt.pricing?.currency)}
                          </span>
                          {apt.pricing?.subtotal ? (
                            <span className="text-[10px] text-neutral-500 line-through">
                              Subtotal: {formatCurrency(apt.pricing.subtotal, apt.pricing.currency)}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Payment Status Column */}
                      <td className="py-4 px-6 text-center">
                        {getPaymentBadge(apt.paymentStatus)}
                      </td>

                      {/* Appointment Status Column */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {getStatusBadge(apt.status)}
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
