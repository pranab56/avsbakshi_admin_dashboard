"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const PAGE_TITLE_MAP: Record<string, string> = {
  "/": "Dashboard",
  "/user-management": "User Management",
  "/reservation-management": "Bookings Management",
  "/revenue-management": "Transactions History",
  "/pricing": "Pricing",
  "/settings": "Settings",
  "/notifications": "Notifications",
};

export default function MyNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const title = PAGE_TITLE_MAP[pathname] || "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between gap-4 bg-[#E6E6E6] px-6 w-full shrink-0 border-b border-neutral-300/40 select-none">
      {/* ── Left Side: Sidebar Toggle & Page Title ── */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9 text-neutral-700 hover:bg-black/5" />
        <h1 className="text-lg font-medium text-[#1E1E1E] tracking-tight">
          {title}
        </h1>
      </div>

      {/* ── Right Side: Notifications & User Profile ── */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Notification Bell Icon */}
        <button
          type="button"
          onClick={() => router.push("/notifications")}
          className="relative p-2 rounded-xl text-neutral-700 hover:bg-black/5 transition-all cursor-pointer flex items-center justify-center"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-[#1E1E1E]" />
          {/* Notification Unread Pulse Dot */}
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AC6135] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#AC6135]" />
          </span>
        </button>

        {/* User Profile */}
        <div
          onClick={() => router.push("/settings")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <Avatar className="h-11 w-11 rounded-xl shrink-0 overflow-hidden border border-neutral-300/50 shadow-sm">
            <AvatarImage
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="Jane Cooper"
              className="object-cover h-full w-full"
            />
            <AvatarFallback className="rounded-xl bg-[#B07D2B] text-white font-medium text-sm">
              JC
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="text-[15px] font-medium text-[#1E1E1E] leading-tight group-hover:text-[#B07D2B] transition-colors">
              Jane Cooper
            </span>
            <span className="text-[13px] text-[#71717A] leading-tight mt-0.5 font-normal">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

