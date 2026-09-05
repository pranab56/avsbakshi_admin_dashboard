"use client";

export type SettingsTab = "profile" | "security";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsSidebar({
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  return (
    <div className="bg-white rounded-xl p-2 border border-black/5 shadow-xs flex flex-col gap-1">
      <button
        type="button"
        onClick={() => onTabChange("profile")}
        className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
          activeTab === "profile"
            ? "bg-[#F5EDE4] text-[#AC6135] font-semibold"
            : "text-[#2B2927] hover:bg-[#F5EDE4]/50"
        }`}
      >
        Profile
      </button>

      <button
        type="button"
        onClick={() => onTabChange("security")}
        className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
          activeTab === "security"
            ? "bg-[#F5EDE4] text-[#AC6135] font-semibold shadow-2xs"
            : "text-[#2B2927] hover:bg-[#D6CEC3]/50"
        }`}
      >
        Security
      </button>
    </div>
  );
}
