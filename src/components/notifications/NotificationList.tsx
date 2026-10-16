"use client";

import {
  Bell,
  CalendarCheck,
  CheckCheck,
  CreditCard,
  ShieldAlert,
  Star,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "booking" | "payment" | "user" | "system" | "review";
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

type FilterTab = "all" | "unread" | "booking" | "payment" | "system";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread") return !item.isRead;
    if (activeTab === "booking") return item.type === "booking";
    if (activeTab === "payment") return item.type === "payment";
    if (activeTab === "system") return item.type === "system";
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    toast.success("All notifications marked as read!");
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    toast.success("Notification removed.");
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "booking":
        return <CalendarCheck className="w-5 h-5 text-[#AC6135]" />;
      case "payment":
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case "user":
        return <UserPlus className="w-5 h-5 text-blue-600" />;
      case "system":
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case "review":
        return <Star className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getIconBg = (type: NotificationItem["type"]) => {
    switch (type) {
      case "booking":
        return "bg-[#F5EDE4]";
      case "payment":
        return "bg-emerald-50";
      case "user":
        return "bg-blue-50";
      case "system":
        return "bg-amber-50";
      case "review":
        return "bg-purple-50";
      default:
        return "bg-gray-100";
    }
  };

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: `Unread (${unreadCount})` },
    { id: "booking", label: "Bookings" },
    { id: "payment", label: "Payments" },
    { id: "system", label: "System" },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* ── Action Header & Filter Tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:px-6 sm:py-4 rounded-2xl border border-black/5 shadow-xs">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#AC6135] text-white shadow-2xs font-semibold"
                  : "bg-[#FAF8F4] text-[#2B2927] hover:bg-[#F5EDE4]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mark All as Read Button */}
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#AC6135] hover:text-[#97532c] transition-colors cursor-pointer self-end sm:self-center"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Notification Items List ── */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-black/5 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F4] flex items-center justify-center mx-auto text-gray-400">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-serif italic text-lg text-[#1E1E1E]">No Notifications Found</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              You are all caught up! There are no notifications in this view.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.isRead && markAsRead(item.id)}
              className={`group flex items-start justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                item.isRead
                  ? "bg-white border-black/5 hover:border-black/10"
                  : "bg-[#FAF8F4] border-[#AC6135]/20 shadow-2xs hover:border-[#AC6135]/40"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Notification Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(
                    item.type
                  )}`}
                >
                  {getNotificationIcon(item.type)}
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4
                      className={`text-sm sm:text-base font-serif italic ${
                        item.isRead ? "text-[#1E1E1E] font-normal" : "text-[#1E1E1E] font-semibold"
                      }`}
                    >
                      {item.title}
                    </h4>

                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#AC6135] shrink-0" title="Unread" />
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>

                  <span className="text-[11px] sm:text-xs text-neutral-400 font-normal block pt-1">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
