"use client";

import ModernDropdown from "@/components/ui/ModernDropdown";
import UserPagination from "@/components/user-management/UserPagination";
import { useGetAllServicesQuery } from "@/features/services/servicesApi";
import {
  Clock,
  Eye,
  Loader2,
  RotateCcw,
  Scissors,
  Search,
  User as UserIcon,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface ServiceCategory {
  _id?: string;
  name?: string;
  image?: string;
  isDeleted?: boolean;
  __v?: number;
}

export interface ServiceCreatedBy {
  _id?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isSalonOwner?: boolean;
  email?: string;
  image?: string;
  phone?: {
    countryCode?: string;
    number?: string;
  };
}

export interface ApiService {
  _id: string;
  name: string;
  category?: ServiceCategory;
  description?: string;
  priceInUSD: number;
  durationInMinutes: number;
  status: string;
  isDeleted?: boolean;
  createdBy?: ServiceCreatedBy;
  createdAt?: string;
  updatedAt?: string;
  uid?: string;
}

export default function AllServicesTab() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<ApiService | null>(null);

  // RTK Query: fetch services from API
  const {
    data: response,
    isLoading,
  } = useGetAllServicesQuery({
    page: currentPage,
    limit: 10,
    searchTerm: searchTerm.trim(),
    status: statusFilter,
  });

  // Services strictly from API response
  const rawServices: ApiService[] = useMemo(() => response?.data || [], [response?.data]);

  const pagination = response?.pagination || {
    total: rawServices.length,
    limit: 10,
    page: currentPage,
    totalPage: 1,
  };

  // Filter services locally if needed
  const displayedServices = useMemo(() => {
    return rawServices.filter((s) => {
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesName = s.name?.toLowerCase().includes(query);
        const matchesCategory = s.category?.name?.toLowerCase().includes(query);
        const matchesDescription = s.description?.toLowerCase().includes(query);
        const matchesUid = s.uid?.toLowerCase().includes(query);
        const matchesOwner = `${s.createdBy?.firstName || ""} ${s.createdBy?.lastName || ""}`
          .toLowerCase()
          .includes(query);
        const matchesEmail = s.createdBy?.email?.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesCategory &&
          !matchesDescription &&
          !matchesUid &&
          !matchesOwner &&
          !matchesEmail
        ) {
          return false;
        }
      }

      if (statusFilter !== "all" && s.status?.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [rawServices, searchTerm, statusFilter]);

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

  return (
    <div className="space-y-6">
      {/* ── Search & Filter Header (Following All Salon & UserTable) ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by service name, category, or UID..."
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
              { label: "Active", value: "active", color: "bg-[#2C7446]" },
              { label: "Inactive", value: "inactive", color: "bg-[#D9383A]" },
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

      {/* ── Table Container (Following All Salon & UserTable Design) ── */}
      <div className="bg-[#E1DDD4] rounded-xl shadow-xs border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#F3F0EA] border-b border-black/5 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase">
                <th className="py-4 px-6">SERVICE</th>
                <th className="py-4 px-6">CATEGORY</th>
                <th className="py-4 px-6">UID</th>
                <th className="py-4 px-6">PRICE & DURATION</th>
                <th className="py-4 px-6">CREATED BY</th>
                <th className="py-4 px-6">JOINED DATE</th>
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
                      <span className="text-sm font-medium">Loading services...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedServices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500 text-sm font-medium">
                    No services found matching criteria.
                  </td>
                </tr>
              ) : (
                displayedServices.map((service) => {
                  const creatorName =
                    [service.createdBy?.firstName, service.createdBy?.lastName]
                      .filter(Boolean)
                      .join(" ") || "N/A";
                  const isActive = service.status === "active";

                  return (
                    <tr key={service._id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Service Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center">
                            {service.category?.image ? (
                              <img
                                src={service.category.image}
                                alt={service.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Scissors className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col max-w-xs sm:max-w-sm">
                            <span className="font-semibold text-[#1E1E1E] text-sm leading-tight line-clamp-1">
                              {service.name}
                            </span>
                            <span className="text-xs text-neutral-500 font-normal leading-tight mt-1 line-clamp-1">
                              {service.description || "No description available"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge Column */}
                      <td className="py-4 px-6 font-medium text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[#B07D2B] font-semibold text-xs whitespace-nowrap">
                          <span className="text-[10px]">●</span>{" "}
                          {service.category?.name || "General"}
                        </span>
                      </td>

                      {/* UID Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-600 whitespace-nowrap">
                        {service.uid || service._id?.slice(-8)}
                      </td>

                      {/* Price & Duration Column */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-[#1E1E1E] leading-tight">
                            ${service.priceInUSD ?? 0}
                          </span>
                          <span className="text-xs text-neutral-500 font-normal leading-tight mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {service.durationInMinutes ?? 0} mins
                          </span>
                        </div>
                      </td>

                      {/* Created By Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center text-xs">
                            {service.createdBy?.image ? (
                              <img
                                src={service.createdBy.image}
                                alt={creatorName}
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
                              {creatorName}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-normal leading-tight mt-0.5 truncate">
                              {service.createdBy?.email || "No email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Joined Date Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-700 whitespace-nowrap">
                        {formatDate(service.createdAt)}
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium ${
                            isActive
                              ? "bg-[#DDF0E4] text-[#2C7446]"
                              : "bg-[#FCE6E4] text-[#D9383A]"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Action Column (View Details) */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedService(service)}
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

      {/* ── Service Full Detail Modal ── */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] rounded-2xl w-full max-w-xl border border-black/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="bg-[#161618] text-white p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5">
                {selectedService.category?.image ? (
                  <img
                    src={selectedService.category.image}
                    alt={selectedService.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#B07D2B] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0">
                    <Scissors className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif font-medium">{selectedService.name}</h3>
                    {selectedService.uid && (
                      <span className="text-[10px] bg-white/10 text-neutral-300 font-mono px-2 py-0.5 rounded">
                        {selectedService.uid}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {selectedService.category?.name || "General Category"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
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
                    {selectedService.status}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Price</p>
                  <p className="font-semibold mt-0.5 text-[#1E1E1E] flex items-center gap-0.5">
                    ${selectedService.priceInUSD ?? 0} USD
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Duration</p>
                  <p className="font-semibold mt-0.5">{selectedService.durationInMinutes ?? 0} Mins</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Created</p>
                  <p className="font-semibold mt-0.5">{formatDate(selectedService.createdAt)}</p>
                </div>
              </div>

              {/* Service Description */}
              <div>
                <p className="text-[11px] text-neutral-500 uppercase font-semibold mb-1">
                  Service Description
                </p>
                <p className="text-neutral-700 bg-white p-3.5 rounded-xl border border-black/5 leading-relaxed">
                  {selectedService.description || "No full description provided for this service."}
                </p>
              </div>

              {/* Category Information */}
              <div className="bg-white p-4 rounded-xl border border-black/5 space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                  Category Details
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B07D2B]" />
                    <span className="font-semibold text-[#1E1E1E]">
                      {selectedService.category?.name || "General Category"}
                    </span>
                  </div>
                  {selectedService.category?._id && (
                    <span className="text-[11px] text-neutral-500 font-mono">
                      ID: {selectedService.category._id.slice(-8)}
                    </span>
                  )}
                </div>
              </div>

              {/* Professional / Creator Details */}
              <div className="bg-white p-4 rounded-xl border border-black/5 space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                  Professional / Creator Details
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {selectedService.createdBy?.image ? (
                    <img
                      src={selectedService.createdBy.image}
                      alt="Creator"
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
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#1E1E1E]">
                        {[selectedService.createdBy?.firstName, selectedService.createdBy?.lastName]
                          .filter(Boolean)
                          .join(" ") || "N/A"}
                      </p>
                      {selectedService.createdBy?.role && (
                        <span className="text-[10px] bg-[#B07D2B]/15 text-[#B07D2B] px-1.5 py-0.5 rounded font-medium capitalize">
                          {selectedService.createdBy.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {selectedService.createdBy?.email || "No email"}
                    </p>
                    {selectedService.createdBy?.phone?.number && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {selectedService.createdBy.phone.countryCode}{" "}
                        {selectedService.createdBy.phone.number}
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
                onClick={() => setSelectedService(null)}
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

