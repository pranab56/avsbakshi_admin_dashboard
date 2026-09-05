"use client";

export type BookingTab = "All" | "Pending" | "Confirmed" | "Cancelled";

interface BookingTabsProps {
  activeTab: BookingTab;
  onTabChange: (tab: BookingTab) => void;
  tabs?: BookingTab[];
}

export default function BookingTabs({
  activeTab,
  onTabChange,
  tabs = ["All", "Pending", "Confirmed", "Cancelled"],
}: BookingTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-black/10 pb-0.5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const isCancelled = tab === "Cancelled";

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`pb-2.5 text-xs sm:text-sm font-medium transition-all relative cursor-pointer ${
              isActive
                ? isCancelled
                  ? "text-[#D9383A] font-semibold"
                  : "text-[#B07D2B] font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab}
            {isActive && (
              <span
                className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full transition-all ${
                  isCancelled ? "bg-[#D9383A]" : "bg-[#B07D2B]"
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
