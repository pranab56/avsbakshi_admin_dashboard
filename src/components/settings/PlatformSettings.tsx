"use client";

import { useGetPlatfromQuery, useUpdatePlatfromMutation } from "@/features/platfrom/platfromApi";
import {
  CheckCircle2,
  DollarSign,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  Share2,
  Smartphone,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface SuggestionItem {
  place_id: number | string;
  display_name: string;
  lon: string;
  lat: string;
}

export default function PlatformSettings() {
  const { data: response, isLoading: isFetching } = useGetPlatfromQuery(undefined);
  const [updatePlatform, { isLoading: isUpdating }] = useUpdatePlatfromMutation();

  const [formData, setFormData] = useState({
    platformFeePercentage: {
      customer: 2.5,
      provider: 8.0,
    },
    contactInfo: {
      email: "",
      phone: {
        countryCode: "+1",
        number: "",
      },
      whatsApp: {
        countryCode: "+1",
        number: "",
      },
      address: "",
      location: {
        type: "Point",
        coordinates: [-73.9903, 40.7512] as [number, number],
      },
    },
    mobileAppLink: {
      googlePlay: "",
      appleStore: "",
    },
    socialLink: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
      reddit: "",
      weChat: "",
      discord: "",
      telegram: "",
    },
  });

  // State for PhoneInput (E.164 strings)
  const [rawPhone, setRawPhone] = useState<string>("");
  const [rawWhatsApp, setRawWhatsApp] = useState<string>("");

  // Address Autocomplete state
  const [addressInput, setAddressInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const addressContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize form when API data arrives
  useEffect(() => {
    if (response?.data) {
      const d = response.data;
      const initialPhone =
        d.contactInfo?.phone?.countryCode && d.contactInfo?.phone?.number
          ? `${d.contactInfo.phone.countryCode}${d.contactInfo.phone.number}`
          : "";
      const initialWhatsApp =
        d.contactInfo?.whatsApp?.countryCode && d.contactInfo?.whatsApp?.number
          ? `${d.contactInfo.whatsApp.countryCode}${d.contactInfo.whatsApp.number}`
          : "";

      setRawPhone(initialPhone);
      setRawWhatsApp(initialWhatsApp);
      setAddressInput(d.contactInfo?.address || "");

      setFormData({
        platformFeePercentage: {
          customer: d.platformFeePercentage?.customer ?? 0,
          provider: d.platformFeePercentage?.provider ?? 0,
        },
        contactInfo: {
          email: d.contactInfo?.email || "",
          phone: {
            countryCode: d.contactInfo?.phone?.countryCode || "+1",
            number: d.contactInfo?.phone?.number || "",
          },
          whatsApp: {
            countryCode: d.contactInfo?.whatsApp?.countryCode || "+1",
            number: d.contactInfo?.whatsApp?.number || "",
          },
          address: d.contactInfo?.address || "",
          location: {
            type: "Point",
            coordinates: [
              d.contactInfo?.location?.coordinates?.[0] ?? -73.9903,
              d.contactInfo?.location?.coordinates?.[1] ?? 40.7512,
            ],
          },
        },
        mobileAppLink: {
          googlePlay: d.mobileAppLink?.googlePlay || "",
          appleStore: d.mobileAppLink?.appleStore || "",
        },
        socialLink: {
          facebook: d.socialLink?.facebook || "",
          instagram: d.socialLink?.instagram || "",
          twitter: d.socialLink?.twitter || "",
          linkedin: d.socialLink?.linkedin || "",
          youtube: d.socialLink?.youtube || "",
          tiktok: d.socialLink?.tiktok || "",
          reddit: d.socialLink?.reddit || "",
          weChat: d.socialLink?.weChat || "",
          discord: d.socialLink?.discord || "",
          telegram: d.socialLink?.telegram || "",
        },
      });
    }
  }, [response]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        addressContainerRef.current &&
        !addressContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle address input change with debounce for autosuggestion
  const handleAddressChange = (value: string) => {
    setAddressInput(value);
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        address: value,
      },
    }));

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!value.trim() || value.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        setIsSearchingAddress(true);
        // Geocoding Autocomplete with location coordinates
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}&limit=5&addressdetails=1`
        );
        const data = await res.json();
        setSuggestions(data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Address autocomplete error:", err);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 400);
  };

  // Handle selecting a suggested location
  const handleSelectLocation = (item: SuggestionItem) => {
    const lon = parseFloat(item.lon) || 0;
    const lat = parseFloat(item.lat) || 0;

    setAddressInput(item.display_name);
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        address: item.display_name,
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      },
    }));

    setShowSuggestions(false);
    toast.success("Location and coordinates updated!");
  };

  // Phone number change handler using react-phone-number-input
  const handlePhoneChange = (value: string | undefined) => {
    const val = value || "";
    setRawPhone(val);

    let countryCode = "+1";
    let number = "";

    if (val) {
      const parsed = parsePhoneNumber(val);
      if (parsed) {
        countryCode = `+${parsed.countryCallingCode}`;
        number = parsed.nationalNumber || "";
      } else {
        number = val.replace(/^\+/, "");
      }
    }

    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        phone: { countryCode, number },
      },
    }));
  };

  // WhatsApp number change handler using react-phone-number-input
  const handleWhatsAppChange = (value: string | undefined) => {
    const val = value || "";
    setRawWhatsApp(val);

    let countryCode = "+1";
    let number = "";

    if (val) {
      const parsed = parsePhoneNumber(val);
      if (parsed) {
        countryCode = `+${parsed.countryCallingCode}`;
        number = parsed.nationalNumber || "";
      } else {
        number = val.replace(/^\+/, "");
      }
    }

    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        whatsApp: { countryCode, number },
      },
    }));
  };

  // Save Settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone numbers if entered
    if (rawPhone && !isValidPhoneNumber(rawPhone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (rawWhatsApp && !isValidPhoneNumber(rawWhatsApp)) {
      toast.error("Please enter a valid WhatsApp number.");
      return;
    }

    const payload = {
      platformFeePercentage: {
        customer: Number(formData.platformFeePercentage.customer) || 0,
        provider: Number(formData.platformFeePercentage.provider) || 0,
      },
      contactInfo: {
        email: formData.contactInfo.email,
        phone: {
          countryCode: formData.contactInfo.phone.countryCode,
          number: formData.contactInfo.phone.number,
        },
        whatsApp: {
          countryCode: formData.contactInfo.whatsApp.countryCode,
          number: formData.contactInfo.whatsApp.number,
        },
        address: formData.contactInfo.address,
        location: {
          type: "Point",
          coordinates: [
            Number(formData.contactInfo.location.coordinates[0]) || 0,
            Number(formData.contactInfo.location.coordinates[1]) || 0,
          ],
        },
      },
      mobileAppLink: {
        googlePlay: formData.mobileAppLink.googlePlay,
        appleStore: formData.mobileAppLink.appleStore,
      },
      socialLink: {
        facebook: formData.socialLink.facebook,
        instagram: formData.socialLink.instagram,
        twitter: formData.socialLink.twitter,
        linkedin: formData.socialLink.linkedin,
        youtube: formData.socialLink.youtube || "",
        tiktok: formData.socialLink.tiktok || "",
        reddit: formData.socialLink.reddit || "",
        weChat: formData.socialLink.weChat || "",
        discord: formData.socialLink.discord || "",
        telegram: formData.socialLink.telegram || "",
      },
    };

    try {
      const res = await updatePlatform(payload).unwrap();
      toast.success(res?.message || "Platform settings updated successfully!");
    } catch (err: unknown) {
      console.error("Platform update error:", err);
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to update platform settings."
      );
    }
  };

  if (isFetching) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-black/5 shadow-xs flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-7 h-7 animate-spin text-[#AC6135] mb-3" />
        <span className="text-sm font-medium text-neutral-600">
          Loading platform settings...
        </span>
      </div>
    );
  }

  const isPhoneValid = !rawPhone || isValidPhoneNumber(rawPhone);
  const isWhatsAppValid = !rawWhatsApp || isValidPhoneNumber(rawWhatsApp);

  return (
    <>
      {/* ── Custom Styling for react-phone-number-input ── */}
      <style jsx global>{`
        .custom-phone-wrapper .PhoneInput {
          display: flex;
          align-items: center;
          background-color: #faf8f4;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.65rem 0.85rem;
          transition: all 0.2s ease;
        }
        .custom-phone-wrapper .PhoneInput:focus-within {
          border-color: #ac6135;
          box-shadow: 0 0 0 2px rgba(172, 97, 53, 0.35);
        }
        .custom-phone-wrapper .PhoneInputCountry {
          margin-right: 0.75rem;
          display: flex;
          align-items: center;
        }
        .custom-phone-wrapper .PhoneInputCountrySelect {
          cursor: pointer;
        }
        .custom-phone-wrapper .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: #1e1e1e;
        }
        .custom-phone-wrapper .PhoneInputCountryIcon {
          width: 1.35rem;
          height: 1rem;
          border-radius: 2px;
          box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── 1. Platform Fee Percentage ── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-black/5 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDE4] text-[#AC6135] flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif italic text-[#1E1E1E] font-medium">
                Platform Fee Percentage
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Set customer and service provider fee percentages for bookings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                Customer Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.platformFeePercentage.customer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      platformFeePercentage: {
                        ...prev.platformFeePercentage,
                        customer: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="e.g. 2.5"
                  className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                Provider Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.platformFeePercentage.provider}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      platformFeePercentage: {
                        ...prev.platformFeePercentage,
                        provider: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="e.g. 8.0"
                  className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Contact Information ── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-black/5 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDE4] text-[#AC6135] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif italic text-[#1E1E1E] font-medium">
                Contact Information
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Official contact details and location for customer support.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Email */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                Support Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, email: e.target.value },
                    }))
                  }
                  placeholder="support@thecloudsalon.com"
                  className="bg-[#FAF8F4] border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
                />
              </div>
            </div>

            {/* Phone with React Phone Number Validator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#2B2927] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#AC6135]" />
                  Phone Number
                </label>
                {rawPhone && (
                  <span
                    className={`text-[11px] font-medium flex items-center gap-1 ${
                      isPhoneValid ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {isPhoneValid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </>
                    ) : (
                      "Invalid number"
                    )}
                  </span>
                )}
              </div>
              <div className="custom-phone-wrapper">
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={rawPhone}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* WhatsApp with React Phone Number Validator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#2B2927] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Number
                </label>
                {rawWhatsApp && (
                  <span
                    className={`text-[11px] font-medium flex items-center gap-1 ${
                      isWhatsAppValid ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {isWhatsAppValid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </>
                    ) : (
                      "Invalid number"
                    )}
                  </span>
                )}
              </div>
              <div className="custom-phone-wrapper">
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={rawWhatsApp}
                  onChange={handleWhatsAppChange}
                  placeholder="Enter WhatsApp number"
                />
              </div>
            </div>

            {/* Address with Google / Map Autocomplete and Behind-the-Scenes Coordinates */}
            <div className="sm:col-span-2 relative" ref={addressContainerRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#2B2927] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#AC6135]" />
                  Street Address (Search with Map Autocomplete)
                </label>
                {/* Coordinates synced behind the scenes indicator */}
                <span className="text-[11px] text-neutral-500 font-mono bg-neutral-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#AC6135]" />
                  Coordinates linked: [
                  {formData.contactInfo.location.coordinates[0].toFixed(4)},{" "}
                  {formData.contactInfo.location.coordinates[1].toFixed(4)}]
                </span>
              </div>

              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Type an address to search locations (e.g. 450 Fashion Ave, New York)..."
                  className="bg-[#FAF8F4] border border-gray-200 rounded-lg pl-10 pr-10 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
                />
                {isSearchingAddress && (
                  <Loader2 className="w-4 h-4 animate-spin text-[#AC6135] absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Autocomplete Suggestion Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                  <div className="px-3 py-1.5 bg-neutral-50 border-b border-gray-100 text-[11px] font-semibold text-neutral-500 flex items-center justify-between">
                    <span>Location Suggestions</span>
                    <span className="text-[10px] text-neutral-400">Click to link coordinates</span>
                  </div>
                  {suggestions.map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => handleSelectLocation(item)}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-[#1E1E1E] hover:bg-[#F5EDE4] border-b border-gray-100 last:border-b-0 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#AC6135] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{item.display_name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          Lon: {parseFloat(item.lon).toFixed(4)}, Lat:{" "}
                          {parseFloat(item.lat).toFixed(4)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. Mobile App Links ── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-black/5 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDE4] text-[#AC6135] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif italic text-[#1E1E1E] font-medium">
                Mobile App Links
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Direct download URLs for Android (Google Play) and iOS (Apple App Store).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                Google Play Store URL
              </label>
              <input
                type="url"
                value={formData.mobileAppLink.googlePlay}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mobileAppLink: { ...prev.mobileAppLink, googlePlay: e.target.value },
                  }))
                }
                placeholder="https://play.google.com/store/apps/details?id=com..."
                className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                Apple App Store URL
              </label>
              <input
                type="url"
                value={formData.mobileAppLink.appleStore}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mobileAppLink: { ...prev.mobileAppLink, appleStore: e.target.value },
                  }))
                }
                placeholder="https://apps.apple.com/app/the-cloud-salon/id..."
                className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── 4. Social Media Links (Only Facebook, Instagram, Twitter / X, LinkedIn) ── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-black/5 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDE4] text-[#AC6135] flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif italic text-[#1E1E1E] font-medium">
                Social Media Links
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Official social channels and community profiles for the platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {(
              [
                { key: "facebook", label: "Facebook" },
                { key: "instagram", label: "Instagram" },
                { key: "twitter", label: "Twitter / X" },
                { key: "linkedin", label: "LinkedIn" },
              ] as const
            ).map((item) => (
              <div key={item.key}>
                <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                  {item.label}
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={formData.socialLink[item.key]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialLink: {
                          ...prev.socialLink,
                          [item.key]: e.target.value,
                        },
                      }))
                    }
                    placeholder={`https://${item.key.toLowerCase()}.com/...`}
                    className="bg-[#FAF8F4] border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Save Changes Floating / Fixed Bottom Bar ── */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-[#AC6135] hover:bg-[#97532c] text-white text-sm font-medium px-8 py-3 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isUpdating ? "Saving Changes..." : "Save Platform Settings"}
          </button>
        </div>
      </form>
    </>
  );
}
