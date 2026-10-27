"use client";

import ModernDropdown from "@/components/ui/ModernDropdown";
import UserPagination from "@/components/user-management/UserPagination";
import {
  useGetAllSalonsQuery,
  useUpdateSalonStatusMutation,
} from "@/features/salon/salonApi";
import {
  AlertTriangle,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  Globe,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  Store,
  User as UserIcon,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export interface SalonAvailability {
  day: string;
  openTime: string;
  closeTime: string;
  isAvailable: boolean;
}

export interface SalonAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface SalonCreatedBy {
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

export interface ApiSalon {
  _id: string;
  name: string;
  businessType?: string;
  description?: string;
  logo?: string;
  photos?: string[];
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  availability?: SalonAvailability[];
  address?: SalonAddress;
  location?: {
    type?: string;
    coordinates?: [number, number];
  };
  totalReviews?: number;
  avgRating?: number;
  createdBy?: SalonCreatedBy;
  createdAt?: string;
  updatedAt?: string;
  uid?: string;
  status: string;
  isDeleted?: boolean;
  isWishlist?: boolean;
}

export default function AllSalonPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSalon, setSelectedSalon] = useState<ApiSalon | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Confirmation popup state for block/unblock
  const [confirmAction, setConfirmAction] = useState<{
    salon: ApiSalon;
    nextStatus: "active" | "inactive";
  } | null>(null);

  // RTK Query: fetch salons from API
  const {
    data: response,
    isLoading,
  } = useGetAllSalonsQuery({
    page: currentPage,
    limit: 10,
    searchTerm: searchTerm.trim(),
    status: statusFilter,
  });

  const [updateSalonStatus] = useUpdateSalonStatusMutation();

  // Salons strictly from API response
  const rawSalons: ApiSalon[] = response?.data || [];

  const pagination = response?.pagination || {
    total: rawSalons.length,
    limit: 10,
    page: currentPage,
    totalPage: 1,
  };

  // Filter salons strictly by name and email, not UID
  const displayedSalons = useMemo(() => {
    return rawSalons.filter((s) => {
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesName = s.name?.toLowerCase().includes(query);
        const matchesOwner = `${s.createdBy?.firstName || ""} ${s.createdBy?.lastName || ""}`
          .toLowerCase()
          .includes(query);
        const matchesEmail =
          s.email?.toLowerCase().includes(query) ||
          s.createdBy?.email?.toLowerCase().includes(query);
        if (!matchesName && !matchesOwner && !matchesEmail) {
          return false;
        }
      }
      return true;
    });
  }, [rawSalons, searchTerm]);

  const handleConfirmStatusChange = async () => {
    if (!confirmAction) return;
    const { salon, nextStatus } = confirmAction;
    setUpdatingId(salon._id);

    try {
      const res = await updateSalonStatus({
        id: salon._id,
        status: nextStatus,
        data: { status: nextStatus },
      }).unwrap();

      toast.success(
        res?.message ||
          `Salon ${nextStatus === "active" ? "unblocked" : "blocked"} successfully`
      );

      // If the detail modal is currently showing this salon, update its local state
      if (selectedSalon && selectedSalon._id === salon._id) {
        setSelectedSalon((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }

      setConfirmAction(null);
    } catch (err: unknown) {
      const apiErr = err as {
        data?: { message?: string; errorMessages?: Array<{ message?: string }> };
      };
      const msg =
        apiErr?.data?.message ||
        apiErr?.data?.errorMessages?.[0]?.message ||
        "Failed to update salon status";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

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

  const formatAddress = (addr?: SalonAddress) => {
    if (!addr) return "N/A";
    const parts = [addr.line1, addr.line2, addr.city, addr.state, addr.postalCode].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  return (
    <div className="space-y-6 select-none">
      {/* ── Page Header Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-normal tracking-tight">
            All Salon
          </h1>
          <p className="text-xs sm:text-sm text-[#706E6B] font-normal mt-1">
            Browse, manage, and verify all registered beauty salons and wellness studios.
          </p>
        </div>
      </div>

      {/* ── Search & Filter Header (following UserTable) ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
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

      {/* ── Table Container (following UserTable) ── */}
      <div className="bg-[#E1DDD4] rounded-xl shadow-xs border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#F3F0EA] border-b border-black/5 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase">
                <th className="py-4 px-6">SALON</th>
                <th className="py-4 px-6">ROLE / TYPE</th>
                <th className="py-4 px-6">UID</th>
                <th className="py-4 px-6">OWNER</th>
                <th className="py-4 px-6">JOINED DATE</th>
                <th className="py-4 px-6 text-center">STATUS</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-black/5 text-sm text-[#1E1E1E] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#A67528]" />
                      <span className="text-sm font-medium">Loading salons...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedSalons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 text-sm font-medium">
                    No salons found matching criteria.
                  </td>
                </tr>
              ) : (
                displayedSalons.map((salon) => {
                  const ownerName = [salon.createdBy?.firstName, salon.createdBy?.lastName]
                    .filter(Boolean)
                    .join(" ") || "N/A";
                  const isActive = salon.status === "active";
                  const isCurrentUpdating = updatingId === salon._id;

                  return (
                    <tr key={salon._id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Salon Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center">
                            {salon.logo ? (
                              <img
                                src={salon.logo}
                                alt={salon.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Store className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#1E1E1E] text-sm leading-tight">
                              {salon.name}
                            </span>
                            <span className="text-xs text-neutral-500 font-normal leading-tight mt-1">
                              {salon.email || salon.phone || "No contact info"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Business Type / Role Column */}
                      <td className="py-4 px-6 font-medium text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[#B07D2B] font-semibold text-xs">
                          <span className="text-[10px]">●</span> {salon.businessType || "Salon & Spa"}
                        </span>
                      </td>

                      {/* UID Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-600">
                        {salon.uid || salon._id?.slice(-8)}
                      </td>

                      {/* Owner Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center text-xs">
                            {salon.createdBy?.image ? (
                              <img
                                src={salon.createdBy.image}
                                alt={ownerName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs text-[#1E1E1E] leading-tight">
                              {ownerName}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-normal leading-tight mt-0.5">
                              {salon.createdBy?.email || ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Joined Date Column */}
                      <td className="py-4 px-6 font-medium text-xs text-neutral-700">
                        {formatDate(salon.createdAt)}
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

                      {/* Action Column (View Details + Switch Toggle) */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => setSelectedSalon(salon)}
                            title="View Details"
                            className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {isCurrentUpdating && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A67528]" />
                          )}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            title={isActive ? "Deactivate salon" : "Activate salon"}
                            disabled={isCurrentUpdating}
                            onClick={() => {
                              const nextStatus = isActive ? "inactive" : "active";
                              setConfirmAction({ salon, nextStatus });
                            }}
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

      {/* ── Pagination ── */}
      <UserPagination
        currentPage={currentPage}
        totalPages={pagination.totalPage || 1}
        onPageChange={(page) => setCurrentPage(Number(page))}
      />

      {/* ── Salon Full Detail Modal ── */}
      {selectedSalon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="bg-[#161618] text-white p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5">
                {selectedSalon.logo ? (
                  <img
                    src={selectedSalon.logo}
                    alt={selectedSalon.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#B07D2B] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0">
                    {selectedSalon.name?.charAt(0) || "S"}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif font-medium">{selectedSalon.name}</h3>
                    {selectedSalon.uid && (
                      <span className="text-[10px] bg-white/10 text-neutral-300 font-mono px-2 py-0.5 rounded">
                        {selectedSalon.uid}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {selectedSalon.businessType || "Salon & Spa"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSalon(null)}
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
                    {selectedSalon.status}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Rating</p>
                  <p className="font-semibold mt-0.5 text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {selectedSalon.avgRating || 0} ({selectedSalon.totalReviews || 0})
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Registered</p>
                  <p className="font-semibold mt-0.5">{formatDate(selectedSalon.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Updated</p>
                  <p className="font-semibold mt-0.5">{formatDate(selectedSalon.updatedAt)}</p>
                </div>
              </div>

              {/* Description */}
              {selectedSalon.description && (
                <div>
                  <p className="text-[11px] text-neutral-500 uppercase font-semibold mb-1">
                    About the Salon
                  </p>
                  <p className="text-neutral-700 bg-white p-3.5 rounded-xl border border-black/5 leading-relaxed">
                    {selectedSalon.description}
                  </p>
                </div>
              )}

              {/* Owner / Created By Details */}
              <div className="bg-white p-4 rounded-xl border border-black/5 space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                  Owner / Creator Details
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {selectedSalon.createdBy?.image ? (
                    <img
                      src={selectedSalon.createdBy.image}
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
                        {[selectedSalon.createdBy?.firstName, selectedSalon.createdBy?.lastName]
                          .filter(Boolean)
                          .join(" ") || "N/A"}
                      </p>
                      {selectedSalon.createdBy?.isSalonOwner && (
                        <span className="text-[10px] bg-[#B07D2B]/15 text-[#B07D2B] px-1.5 py-0.5 rounded font-medium">
                          Salon Owner
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {selectedSalon.createdBy?.email || "No email"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-black/5 space-y-2">
                  <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                    Contact Channels
                  </p>
                  <p className="flex items-center gap-2 text-neutral-700">
                    <Mail className="w-4 h-4 text-[#B07D2B] shrink-0" />
                    <span className="truncate">{selectedSalon.email || "N/A"}</span>
                  </p>
                  <p className="flex items-center gap-2 text-neutral-700">
                    <Phone className="w-4 h-4 text-[#B07D2B] shrink-0" />
                    <span>{selectedSalon.phone || "N/A"}</span>
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-black/5 space-y-2">
                  <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                    Web & Social
                  </p>
                  {selectedSalon.website ? (
                    <a
                      href={selectedSalon.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[#B07D2B] hover:underline"
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="truncate">{selectedSalon.website}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <p className="text-neutral-400">Website: N/A</p>
                  )}
                  {selectedSalon.instagram ? (
                    <p className="flex items-center gap-2 text-neutral-700">
                      <Instagram className="w-4 h-4 text-[#B07D2B] shrink-0" />
                      <span>{selectedSalon.instagram}</span>
                    </p>
                  ) : (
                    <p className="text-neutral-400">Instagram: N/A</p>
                  )}
                </div>
              </div>

              {/* Address & Physical Location */}
              <div className="bg-white p-3.5 rounded-xl border border-black/5 space-y-1.5">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                  Physical Address & Location
                </p>
                <div className="flex items-start gap-2 text-neutral-700">
                  <MapPin className="w-4 h-4 text-[#B07D2B] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{formatAddress(selectedSalon.address)}</p>
                    {selectedSalon.location?.coordinates && (
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Geo Coordinates: [{selectedSalon.location.coordinates[1]}, {selectedSalon.location.coordinates[0]}]
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Operating Hours (Availability) */}
              {selectedSalon.availability && selectedSalon.availability.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-black/5 space-y-2">
                  <p className="text-[11px] text-neutral-500 uppercase font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B07D2B]" />
                    Weekly Schedule / Operating Hours
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {selectedSalon.availability.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${item.isAvailable
                            ? "bg-[#F3F0EA] border-black/5 text-[#1E1E1E]"
                            : "bg-neutral-100/70 border-black/5 text-neutral-400"
                          }`}
                      >
                        <span className="font-semibold">{item.day}</span>
                        <span className="text-[11px] mt-0.5">
                          {item.isAvailable
                            ? `${item.openTime} - ${item.closeTime}`
                            : "Closed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F3F0EA] border-t border-black/5 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSalon(null)}
                className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                disabled={updatingId === selectedSalon._id}
                onClick={() => {
                  const nextStatus = selectedSalon.status === "active" ? "inactive" : "active";
                  setConfirmAction({ salon: selectedSalon, nextStatus });
                }}
                className={`px-4 py-2 rounded-xl text-white text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50 ${selectedSalon.status === "active"
                    ? "bg-[#D9383A] hover:bg-[#c53032]"
                    : "bg-[#B07D2B] hover:bg-[#9A6D24]"
                  }`}
              >
                {updatingId === selectedSalon._id && <Loader2 className="w-3 h-3 animate-spin" />}
                {selectedSalon.status === "active" ? "Deactivate Salon" : "Activate Salon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Popup when Block/Unblock Salon ── */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            {/* Header Icon & Title */}
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmAction.nextStatus === "inactive"
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {confirmAction.nextStatus === "inactive" ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-serif italic text-[#1E1E1E] font-medium leading-tight">
                  {confirmAction.nextStatus === "inactive"
                    ? "Block Salon?"
                    : "Unblock Salon?"}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Action confirmation required.
                </p>
              </div>
            </div>

            {/* Message Body */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed bg-[#FAF8F4] p-3.5 rounded-xl border border-black/5">
              {confirmAction.nextStatus === "inactive" ? (
                <>
                  Are you sure you want to block{" "}
                  <strong className="text-[#1E1E1E]">{confirmAction.salon.name}</strong>
                  ? This salon and its services will be deactivated on the platform.
                </>
              ) : (
                <>
                  Are you sure you want to unblock{" "}
                  <strong className="text-[#1E1E1E]">{confirmAction.salon.name}</strong>
                  ? This salon will be activated and open for bookings.
                </>
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={updatingId === confirmAction.salon._id}
                onClick={() => setConfirmAction(null)}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-900 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={updatingId === confirmAction.salon._id}
                onClick={handleConfirmStatusChange}
                className={`text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-2 ${
                  confirmAction.nextStatus === "inactive"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-[#2C7446] hover:bg-[#235e38] text-white"
                }`}
              >
                {updatingId === confirmAction.salon._id && (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                )}
                {updatingId === confirmAction.salon._id
                  ? "Updating..."
                  : confirmAction.nextStatus === "inactive"
                  ? "Yes, Block Salon"
                  : "Yes, Unblock Salon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
