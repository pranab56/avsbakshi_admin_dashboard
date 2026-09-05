"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    firstName: "Rachel",
    lastName: "Thompson",
    email: "rachel@example.com",
    phone: "+44 7700 900 123",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      toast.success("Photo updated successfully!");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile changes saved successfully!");
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-serif italic font-normal text-[#1E1E1E]">
        Profile Information
      </h2>

      {/* Avatar & Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#AC6135] text-white font-serif italic text-2xl flex items-center justify-center shadow-xs shrink-0 overflow-hidden relative">
          {avatarPreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarPreview}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            formData.firstName ? formData.firstName.charAt(0).toUpperCase() : "R"
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-serif italic text-xl font-medium text-[#1E1E1E]">
            {formData.firstName} {formData.lastName}
          </h3>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handlePhotoClick}
            className=" text-[#1E1E1E] text-xs font-normal px-3.5 py-2 rounded-sm border border-gray-200 transition-all shadow-2xs cursor-pointer hover:bg-gray-50"
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSave} className="space-y-6 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="firstName" className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Type your first name"
              className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Type your last name"
              className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Type your email"
              className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
            />
          </div>

          <div>
            <label htmlFor="phone" className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Type your phone number"
              className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-[#AC6135] hover:bg-[#97532c] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all shadow-2xs cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
