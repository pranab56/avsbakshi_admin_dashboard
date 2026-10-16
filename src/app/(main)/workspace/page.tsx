"use client";

import ModernDropdown from "@/components/ui/ModernDropdown";
import UserPagination from "@/components/user-management/UserPagination";
import { useGetAllWorkSpaceQuery } from "@/features/workspace/workspaceApi";
import {
  Armchair,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  Sparkles,
  Store,
  User as UserIcon,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface WorkspaceChair {
  _id?: string;
  name?: string;
  description?: string;
  photo?: string;
  location?: string;
  pricePerDayInUSD?: number;
  status?: string;
  salon?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  uid?: string;
}

export interface WorkspaceSalon {
  _id?: string;
  name?: string;
  logo?: string;
  email?: string;
  phone?: string;
}

export interface WorkspaceProfessional {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  phone?: {
    countryCode?: string;
    number?: string;
  };
}

export interface WorkspacePricing {
  total?: number;
  currency?: string;
}

export interface ApiWorkspaceRental {
  _id: string;
  chair?: WorkspaceChair;
  salon?: WorkspaceSalon;
  professional?: WorkspaceProfessional;
  startDate?: string;
  endDate?: string;
  durationInDays?: number;
  pricing?: WorkspacePricing;
  paymentStatus?: string;
  transaction?: string | null;
  status: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  uid?: string;
}

export default function WorkspacePage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRental, setSelectedRental] = useState<ApiWorkspaceRental | null>(null);

  // RTK Query: fetch workspace chair rentals from API
  const { data: response, isLoading } = useGetAllWorkSpaceQuery({
    page: currentPage,
    limit: 10,
    searchTerm: searchTerm.trim(),
    status: statusFilter,
  });

  // Workspace rentals strictly from API response
  const rawRentals: ApiWorkspaceRental[] = response?.data || [];

  const pagination = response?.pagination || {
    total: rawRentals.length,
    limit: 10,
    page: currentPage,
    totalPage: 1,
  };

  // Filter rentals locally for instant client-side search & status filtering
  const displayedRentals = useMemo(() => {
    return rawRentals.filter((item) => {
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesChairName = item.chair?.name?.toLowerCase().includes(query);
        const matchesSalonName = item.salon?.name?.toLowerCase().includes(query);
        const matchesLocation = item.chair?.location?.toLowerCase().includes(query);
        const matchesUid = item.uid?.toLowerCase().includes(query) || item.chair?.uid?.toLowerCase().includes(query);
        const matchesProfessional = `${item.professional?.firstName || ""} ${item.professional?.lastName || ""}`
          .toLowerCase()
          .includes(query);
        const matchesEmail = item.professional?.email?.toLowerCase().includes(query) || item.salon?.email?.toLowerCase().includes(query);

        if (
          !matchesChairName &&
          !matchesSalonName &&
          !matchesLocation &&
          !matchesUid &&
          !matchesProfessional &&
          !matchesEmail
        ) {
          return false;
        }
      }

      if (statusFilter !== "all" && item.status?.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [rawRentals, searchTerm, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "confirmed" || s === "active") {
      return (
        <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#DDF0E4] text-[#2C7446] capitalize">
          {status}
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#FEF3C7] text-[#D97706] capitalize">
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium bg-[#FCE6E4] text-[#D9383A] capitalize">
        {status || "Inactive"}
      </span>
    );
  };

  return (
    <div className="space-y-6 select-none">
      {/* ── Page Header Title (Matching All Services & All Salon) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-normal tracking-tight">
            Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#706E6B] font-normal mt-1">
            Browse and monitor chair rental bookings, workstation stations, and salon partner rentals.
          </p>
        </div>
      </div>

      {/* ── Search & Filter Header (Following All Services Page) ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by chair name, salon, professional, or UID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-black/5 rounded-lg h-10 pl-10 pr-4 text-xs sm:text-sm text-[#1E1E1E] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 transition-all"
          />
        </div>

        {/* Modern Status Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <ModernDropdown
            label="Filter Status:"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { label: "All Status", value: "all", color: "bg-neutral-400" },
              { label: "Confirmed", value: "confirmed", color: "bg-[#2C7446]" },
              { label: "Pending", value: "pending", color: "bg-[#D97706]" },
              { label: "Active", value: "active", color: "bg-[#2C7446]" },
            ]}
          />

          {(searchTerm || statusFilter !== "all") && (
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="h-10 px-3 bg-white border border-black/5 hover:bg-neutral-100 rounded-lg text-xs text-neutral-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Table Container (Following All Services Table Design) ── */}
      <div className="bg-[#E1DDD4] rounded-xl shadow-xs border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#F3F0EA] border-b border-black/5 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase">
                <th className="py-4 px-6">WORKSPACE / CHAIR</th>
                <th className="py-4 px-6">SALON</th>
                <th className="py-4 px-6">UID</th>
                <th className="py-4 px-6">RENTAL PERIOD & PRICING</th>
                <th className="py-4 px-6">PROFESSIONAL</th>
                <th className="py-4 px-6">BOOKED DATE</th>
                <th className="py-4 px-6 text-center">STATUS</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-black/5 text-sm text-[#1E1E1E] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#A67528]" />
                      <span className="text-sm font-medium">Loading workspace rentals...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedRentals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500 text-sm font-medium">
                    No workspace bookings found matching criteria.
                  </td>
                </tr>
              ) : (
                displayedRentals.map((rental) => {
                  const professionalName =
                    [rental.professional?.firstName, rental.professional?.lastName]
                      .filter(Boolean)
                      .join(" ") || "Professional";

                  return (
                    <tr key={rental._id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Chair / Station Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center">
                            {rental.chair?.photo ? (
                              <img
                                src={rental.chair.photo}
                                alt={rental.chair.name || "Chair"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Armchair className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col max-w-xs sm:max-w-sm">
                            <span className="font-semibold text-[#1E1E1E] text-sm leading-tight line-clamp-1">
                              {rental.chair?.name || "Workspace Station"}
                            </span>
                            <span className="text-xs text-neutral-500 font-normal leading-tight mt-1 line-clamp-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                              {rental.chair?.location || "Main Area"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Salon Column */}
                      <td className="py-4 px-6 font-medium text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[#B07D2B] font-semibold text-xs whitespace-nowrap">
                          <span className="text-[10px]">●</span>{" "}
                          {rental.salon?.name || "Salon Partner"}
                        </span>
                      </td>

                      {/* UID Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-600 whitespace-nowrap">
                        {rental.uid || rental._id?.slice(-8)}
                      </td>

                      {/* Pricing & Duration Column */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-[#1E1E1E] leading-tight">
                              ${rental.pricing?.total ?? 0} {rental.pricing?.currency || "USD"}
                            </span>
                            {rental.paymentStatus === "paid" ? (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                                Paid
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                                Unpaid
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-500 font-normal leading-tight mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-neutral-400" />
                            {rental.durationInDays ?? 1} {rental.durationInDays === 1 ? "day" : "days"} (${rental.chair?.pricePerDayInUSD ?? 0}/day)
                          </span>
                        </div>
                      </td>

                      {/* Professional Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center text-xs">
                            {rental.professional?.image ? (
                              <img
                                src={rental.professional.image}
                                alt={professionalName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col max-w-[150px]">
                            <span className="font-medium text-xs text-[#1E1E1E] leading-tight truncate">
                              {professionalName}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-normal leading-tight mt-0.5 truncate">
                              {rental.professional?.email || "No email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Booked Date Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-700 whitespace-nowrap">
                        {formatDate(rental.createdAt)}
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(rental.status)}
                      </td>

                      {/* Action Column (View Details Eye Button) */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedRental(rental)}
                            title="View Details"
                            className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
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

      {/* ── Pagination ── */}
      <UserPagination
        currentPage={currentPage}
        totalPages={pagination.totalPage || 1}
        onPageChange={(page) => setCurrentPage(Number(page))}
      />

      {/* ── Rental Full Detail Modal (Following All Services Modal) ── */}
      {selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] rounded-2xl w-full max-w-xl border border-black/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="bg-[#161618] text-white p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5">
                {selectedRental.chair?.photo ? (
                  <img
                    src={selectedRental.chair.photo}
                    alt={selectedRental.chair.name || "Chair"}
                    className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#B07D2B] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0">
                    <Armchair className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif font-medium">
                      {selectedRental.chair?.name || "Workspace Station"}
                    </h3>
                    {selectedRental.uid && (
                      <span className="text-[10px] bg-white/10 text-neutral-300 font-mono px-2 py-0.5 rounded">
                        {selectedRental.uid}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {selectedRental.salon?.name || "Salon Partner Studio"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRental(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs sm:text-sm text-[#1E1E1E]">
              {/* Quick Stat Pill Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Status</p>
                  <p className="font-semibold mt-0.5 capitalize text-[#B07D2B]">
                    {selectedRental.status}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Total Cost</p>
                  <p className="font-semibold mt-0.5 text-[#1E1E1E]">
                    ${selectedRental.pricing?.total ?? 0} {selectedRental.pricing?.currency || "USD"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Duration</p>
                  <p className="font-semibold mt-0.5">
                    {selectedRental.durationInDays ?? 1} {selectedRental.durationInDays === 1 ? "Day" : "Days"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Payment</p>
                  <p className="font-semibold mt-0.5 capitalize">
                    {selectedRental.paymentStatus || "Unpaid"}
                  </p>
                </div>
              </div>

              {/* Rental Schedule & Timing */}
              <div className="bg-white p-4 rounded-xl border border-black/5 space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B07D2B]" />
                  Rental Schedule & Rates
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-[#F3F0EA] border border-black/5">
                    <p className="text-[11px] text-neutral-500 font-semibold uppercase">Start Date & Time</p>
                    <p className="font-semibold text-xs mt-1 text-[#1E1E1E]">
                      {formatDateTime(selectedRental.startDate)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F3F0EA] border border-black/5">
                    <p className="text-[11px] text-neutral-500 font-semibold uppercase">End Date & Time</p>
                    <p className="font-semibold text-xs mt-1 text-[#1E1E1E]">
                      {formatDateTime(selectedRental.endDate)}
                    </p>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-neutral-600 border-t border-black/5">
                  <span>Daily Rate:</span>
                  <span className="font-semibold text-[#1E1E1E]">
                    ${selectedRental.chair?.pricePerDayInUSD ?? 0} USD / day
                  </span>
                </div>
                {selectedRental.transaction && (
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span>Transaction ID:</span>
                    <span>{selectedRental.transaction}</span>
                  </div>
                )}
              </div>

              {/* Chair Station Information */}
              <div className="bg-white p-4 rounded-xl border border-black/5 space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold flex items-center gap-1.5">
                  <Armchair className="w-3.5 h-3.5 text-[#B07D2B]" />
                  Chair & Station Details
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1E1E1E]">
                      {selectedRental.chair?.name || "Workspace Station"}
                    </span>
                    {selectedRental.chair?.uid && (
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {selectedRental.chair.uid}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B07D2B] shrink-0" />
                    {selectedRental.chair?.location || "Main Styling Area"}
                  </p>
                  {selectedRental.chair?.description && (
                    <p className="text-xs text-neutral-500 leading-relaxed pt-1">
                      {selectedRental.chair.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Host Salon Details */}
              <div className="bg-white p-4 rounded-xl border border-black/5 space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#B07D2B]" />
                  Host Salon Details
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {selectedRental.salon?.logo ? (
                    <img
                      src={selectedRental.salon.logo}
                      alt={selectedRental.salon.name || "Salon"}
                      className="w-10 h-10 rounded-xl object-cover border border-black/10 shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#1E1E1E]">
                      {selectedRental.salon?.name || "Salon Studio"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {selectedRental.salon?.email || "No email"}
                    </p>
                    {selectedRental.salon?.phone && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {selectedRental.salon.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Renter Details */}
              <div className="bg-white p-4 rounded-xl border border-black/5 space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-[#B07D2B]" />
                  Renting Professional Details
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {selectedRental.professional?.image ? (
                    <img
                      src={selectedRental.professional.image}
                      alt="Professional"
                      className="w-10 h-10 rounded-full object-cover border border-black/10 shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#1E1E1E]">
                      {[selectedRental.professional?.firstName, selectedRental.professional?.lastName]
                        .filter(Boolean)
                        .join(" ") || "Professional"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {selectedRental.professional?.email || "No email"}
                    </p>
                    {selectedRental.professional?.phone?.number && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {selectedRental.professional.phone.countryCode}{" "}
                        {selectedRental.professional.phone.number}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F3F0EA] border-t border-black/5 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedRental(null)}
                className="px-5 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
