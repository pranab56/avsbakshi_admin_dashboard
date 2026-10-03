"use client";

import { useChangePasswordMutation } from "@/features/profile/profileApi";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SecuritySettings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleInputChange = (field: keyof typeof passwords, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!passwords.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      }).unwrap();

      toast.success(res?.message || "Password changed successfully!");
      closeModal();
    } catch (err: unknown) {
      console.error("Change password error:", err);
      toast.error((err as { data?: { message?: string } })?.data?.message || "Failed to change password.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-serif italic font-normal text-[#1E1E1E]">
        Security
      </h2>

      {/* Password Card */}
      <div className="bg-[#F3F0EA] rounded-xl p-6 border border-black/5 space-y-2">
        <h3 className="font-bold text-[#1E1E1E] text-base">Password</h3>
        <p className="text-xs sm:text-sm text-neutral-600">
          Ensure your account is using a strong, unique password.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#AC6135] hover:bg-[#97532c] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-2xs cursor-pointer"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-black/10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-serif italic text-[#1E1E1E] font-normal">
              Change Password
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
              {/* Current Password */}
              <div>
                <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwords.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    placeholder="Enter current password"
                    className={`bg-[#FAF8F4] border ${
                      errors.currentPassword
                        ? "border-red-400 focus:ring-red-400/50"
                        : "border-gray-200 focus:ring-[#AC6135]/50"
                    } rounded-lg px-4 py-3 text-sm text-[#1E1E1E] w-full focus:outline-none focus:ring-2 pr-11 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    placeholder="Enter new password"
                    className={`bg-[#FAF8F4] border ${
                      errors.newPassword
                        ? "border-red-400 focus:ring-red-400/50"
                        : "border-gray-200 focus:ring-[#AC6135]/50"
                    } rounded-lg px-4 py-3 text-sm text-[#1E1E1E] w-full focus:outline-none focus:ring-2 pr-11 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwords.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                    className={`bg-[#FAF8F4] border ${
                      errors.confirmPassword
                        ? "border-red-400 focus:ring-red-400/50"
                        : "border-gray-200 focus:ring-[#AC6135]/50"
                    } rounded-lg px-4 py-3 text-sm text-[#1E1E1E] w-full focus:outline-none focus:ring-2 pr-11 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-[#AC6135] hover:bg-[#97532c] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
