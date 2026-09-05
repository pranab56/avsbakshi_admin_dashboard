"use client";

import NotificationList from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <div className="space-y-6 select-none">
      {/* ── Page Header Title ── */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
          Stay updated with recent activities, user bookings, system alerts, and financial updates.
        </p>
      </div>

      {/* ── Notifications Component ── */}
      <NotificationList />
    </div>
  );
}
