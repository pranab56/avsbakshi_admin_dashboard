"use client";

import ModernDropdown from "@/components/ui/ModernDropdown";
import { useUpdateStatusMutation } from "@/features/users/usersApi";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export type ApiUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  phone?: {
    countryCode?: string;
    number?: string;
  };
  role?: string;
  isSalonOwner?: boolean;
  status?: string; // "active" | "inactive" | "blocked"
  createdAt?: string;
  updatedAt?: string;
  uid?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  bio?: string;
  gender?: string;
  dateOfBirth?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
};

interface UserTableProps {
  users: ApiUser[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchPlaceholder?: string;
  emptyText?: string;
}

export default function UserTable({
  users = [],
  isLoading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  searchPlaceholder = "Search by name or email...",
  emptyText = "No users found matching criteria.",
}: UserTableProps) {
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // View Details Modal State
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  // Confirmation Popup State for Block/Unblock
  const [confirmAction, setConfirmAction] = useState<{
    user: ApiUser;
    nextStatus: "active" | "inactive";
  } | null>(null);

  // Client-side filter strictly by name and email (never by UID)
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase().trim();
    return users.filter((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const email = (u.email || "").toLowerCase();
      return fullName.includes(term) || email.includes(term);
    });
  }, [users, searchTerm]);

  // Execute Block/Unblock status update after confirmation
  const handleConfirmStatusChange = async () => {
    if (!confirmAction) return;
    const { user, nextStatus } = confirmAction;

    setUpdatingId(user._id);
    try {
      const res = await updateStatus({
        userId: user._id,
        status: nextStatus,
      }).unwrap();

      toast.success(
        res?.message ||
          `User ${nextStatus === "active" ? "unblocked" : "blocked"} successfully`
      );

      // If the modal was showing this user, update its local status too
      if (selectedUser?._id === user._id) {
        setSelectedUser((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }

      setConfirmAction(null);
    } catch (err: unknown) {
      const apiErr = err as {
        data?: { message?: string; errorMessages?: Array<{ message?: string }> };
      };
      toast.error(
        apiErr?.data?.message ||
          apiErr?.data?.errorMessages?.[0]?.message ||
          "Failed to update user status"
      );
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

  const formatPhoneNumber = (phone?: { countryCode?: string; number?: string }) => {
    if (!phone || (!phone.countryCode && !phone.number)) return "N/A";
    return `${phone.countryCode || ""} ${phone.number || ""}`.trim();
  };

  const formatAddress = (address?: ApiUser["address"]) => {
    if (!address) return "No address provided";
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.country,
      address.postalCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No address provided";
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
        {/* Search Bar - only name and email */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-black/5 rounded-lg h-10 pl-10 pr-4 text-xs sm:text-sm text-[#1E1E1E] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 transition-all"
          />
        </div>

        {/* Modern Status Filter Dropdown */}
        <ModernDropdown
          label="Filter Status:"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={[
            { label: "All Status", value: "all", color: "bg-neutral-400" },
            { label: "Active", value: "active", color: "bg-[#2C7446]" },
            { label: "Inactive", value: "inactive", color: "bg-[#D9383A]" },
          ]}
        />
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500 text-sm font-medium">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const fullName =
                    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
                  const isActive = user.status === "active";
                  const isCurrentUpdating = updatingId === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-neutral-50/80 transition-colors"
                    >
                      {/* User Info Column */}
                      <td className="py-4 px-6">
                        <div
                          onClick={() => setSelectedUser(user)}
                          className="flex items-center gap-3.5 cursor-pointer group"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-200 flex items-center justify-center">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={fullName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <UserIcon className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#1E1E1E] text-sm leading-tight group-hover:text-[#AC6135] transition-colors">
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
                          className={`inline-flex items-center px-3.5 py-1 rounded-xl text-xs font-medium ${
                            isActive
                              ? "bg-[#DDF0E4] text-[#2C7446]"
                              : "bg-[#FCE6E4] text-[#D9383A]"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Action Column (View Details & Switch Toggle with Confirmation) */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* View Details Eye Button */}
                          <button
                            type="button"
                            title="View user details"
                            onClick={() => setSelectedUser(user)}
                            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-[#F3F0EA] hover:text-[#AC6135] text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Status Toggle Switch with Confirmation Popup */}
                          {isCurrentUpdating && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A67528]" />
                          )}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            title={isActive ? "Block / Deactivate user" : "Unblock / Activate user"}
                            disabled={isCurrentUpdating || isUpdating}
                            onClick={() => {
                              const nextStatus = isActive ? "inactive" : "active";
                              setConfirmAction({ user, nextStatus });
                            }}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#A67528]/50 disabled:opacity-50 ${
                              isActive ? "bg-[#2C7446]" : "bg-neutral-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                isActive ? "translate-x-5" : "translate-x-0"
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

      {/* ── View Details Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="bg-[#161618] text-white p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-800 shrink-0 flex items-center justify-center">
                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image}
                      alt={selectedUser.firstName || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#AC6135] text-white flex items-center justify-center font-serif text-2xl font-bold">
                      {selectedUser.firstName?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-medium leading-tight">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {getRoleBadge(selectedUser)}
                    {selectedUser.uid && (
                      <span className="text-[10px] bg-white/10 text-neutral-300 font-mono px-2 py-0.5 rounded">
                        UID: {selectedUser.uid}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-[#1E1E1E]">
              {/* Quick Stat Pill Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Status</p>
                  <p className="mt-0.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        selectedUser.status === "active"
                          ? "bg-[#DDF0E4] text-[#2C7446]"
                          : "bg-[#FCE6E4] text-[#D9383A]"
                      }`}
                    >
                      {selectedUser.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">
                    Joined Date
                  </p>
                  <p className="font-semibold mt-0.5 text-[#1E1E1E]">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">
                    Email Status
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 font-medium">
                    {selectedUser.isEmailVerified ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Unverified
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-[#F3F0EA] p-4 rounded-xl border border-black/5 space-y-3">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                  Contact Information
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white text-[#AC6135] shadow-2xs flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400">Email Address</p>
                      <p className="font-medium text-xs break-all">
                        {selectedUser.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white text-[#AC6135] shadow-2xs flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400">Phone Number</p>
                      <p className="font-medium text-xs">
                        {formatPhoneNumber(selectedUser.phone)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details Card */}
              <div className="bg-[#F3F0EA] p-4 rounded-xl border border-black/5 space-y-2">
                <p className="text-[11px] text-neutral-500 uppercase font-semibold">
                  Location / Address
                </p>
                <div className="flex items-start gap-2.5 pt-1">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#AC6135] shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-xs leading-relaxed text-[#1E1E1E]">
                      {formatAddress(selectedUser.address)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio / Description (if available) */}
              {selectedUser.bio && (
                <div className="bg-[#F3F0EA] p-4 rounded-xl border border-black/5 space-y-1.5">
                  <p className="text-[11px] text-neutral-500 uppercase font-semibold">Bio</p>
                  <p className="text-neutral-700 text-xs leading-relaxed">
                    {selectedUser.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#F3F0EA] p-4 px-6 border-t border-black/5 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const nextStatus =
                    selectedUser.status === "active" ? "inactive" : "active";
                  setConfirmAction({ user: selectedUser, nextStatus });
                }}
                className={`text-xs font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedUser.status === "active"
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                {selectedUser.status === "active" ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" /> Block User
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> Unblock User
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="bg-[#161618] hover:bg-neutral-800 text-white text-xs font-medium px-5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Popup when Block/Unblock ── */}
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
                    ? "Block User Account?"
                    : "Unblock User Account?"}
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
                  <strong className="text-[#1E1E1E]">
                    {confirmAction.user.firstName} {confirmAction.user.lastName}
                  </strong>
                  ? Their account will be deactivated and they will lose access to
                  the platform.
                </>
              ) : (
                <>
                  Are you sure you want to unblock{" "}
                  <strong className="text-[#1E1E1E]">
                    {confirmAction.user.firstName} {confirmAction.user.lastName}
                  </strong>
                  ? Their account access will be restored immediately.
                </>
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => setConfirmAction(null)}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-900 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isUpdating}
                onClick={handleConfirmStatusChange}
                className={`text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-2 ${
                  confirmAction.nextStatus === "inactive"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-[#2C7446] hover:bg-[#235e38] text-white"
                }`}
              >
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                {isUpdating
                  ? "Updating..."
                  : confirmAction.nextStatus === "inactive"
                  ? "Yes, Block User"
                  : "Yes, Unblock User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
