"use client";

import Image from "next/image";
import { BookingTab } from "./BookingTabs";

export type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

export type BookingRow = {
  id: string;
  clientName: string;
  clientAvatar: string;
  service: string;
  dateTime: string;
  duration: string;
  price: string;
  status: BookingStatus;
};

export const allBookings: BookingRow[] = [
  {
    id: "1",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    service: "Balayage & Toner",
    dateTime: "Today · 10:00 AM",
    duration: "150min",
    price: "£175",
    status: "Confirmed",
  },
  {
    id: "2",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    service: "Balayage & Toner",
    dateTime: "Today · 10:00 AM",
    duration: "150min",
    price: "£175",
    status: "Confirmed",
  },
  {
    id: "3",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    service: "Balayage & Toner",
    dateTime: "Today · 10:00 AM",
    duration: "150min",
    price: "£175",
    status: "Pending",
  },
  {
    id: "4",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    service: "Balayage & Toner",
    dateTime: "Today · 10:00 AM",
    duration: "150min",
    price: "£175",
    status: "Confirmed",
  },
  {
    id: "5",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    service: "Balayage & Toner",
    dateTime: "Today · 10:00 AM",
    duration: "150min",
    price: "£175",
    status: "Confirmed",
  },
  {
    id: "6",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    service: "Balayage & Toner",
    dateTime: "Today · 10:00 AM",
    duration: "150min",
    price: "£175",
    status: "Cancelled",
  },
  {
    id: "7",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    service: "Balayage & Toner",
    dateTime: "Today · 10:00 AM",
    duration: "150min",
    price: "£175",
    status: "Confirmed",
  },
  {
    id: "8",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    service: "Balayage & Toner",
    dateTime: "Today · 10:00 AM",
    duration: "150min",
    price: "£175",
    status: "Confirmed",
  },
  {
    id: "9",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    service: "Balayage & Toner",
    dateTime: "Today · 10:00 AM",
    duration: "150min",
    price: "£175",
    status: "Cancelled",
  },
];

interface BookingTableProps {
  bookings?: BookingRow[];
  activeTab: BookingTab;
}

export default function BookingTable({
  bookings = allBookings,
  activeTab,
}: BookingTableProps) {
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "All") return true;
    return booking.status === activeTab;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-medium bg-[#DDF0E4] text-[#2C7446]">
            Confirmed
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-medium bg-[#FDF1DB] text-[#B07D2B]">
            Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-medium bg-[#FCE6E4] text-[#D9383A]">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="bg-[#E1DDD4] rounded-xl shadow-xs border border-black/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F3F0EA] border-b border-black/5 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase">
              <th className="py-4 px-6">CLIENT</th>
              <th className="py-4 px-6">SERVICE</th>
              <th className="py-4 px-6">DATE & TIME</th>
              <th className="py-4 px-6">DURATION</th>
              <th className="py-4 px-6">PRICE</th>
              <th className="py-4 px-6 text-right sm:text-center">STATUS</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-black/5 text-sm text-[#1E1E1E] bg-white">
            {filteredBookings.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-neutral-500 font-medium text-sm"
                >
                  No {activeTab.toLowerCase()} bookings found.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking, idx) => (
                <tr
                  key={`${booking.id}-${idx}`}
                  className="hover:bg-neutral-50/80 transition-colors"
                >
                  {/* Client Column */}
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-300">
                        <Image
                          src={booking.clientAvatar}
                          alt={booking.clientName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-[#1E1E1E] text-sm">
                        {booking.clientName}
                      </span>
                    </div>
                  </td>

                  {/* Service Column */}
                  <td className="py-5 px-6 font-medium text-xs text-neutral-800">
                    {booking.service}
                  </td>

                  {/* Date & Time Column */}
                  <td className="py-5 px-6 font-medium text-xs text-neutral-700">
                    {booking.dateTime}
                  </td>

                  {/* Duration Column */}
                  <td className="py-5 px-6 font-medium text-xs text-neutral-700">
                    {booking.duration}
                  </td>

                  {/* Price Column */}
                  <td className="py-5 px-6 font-serif italic font-bold text-sm text-[#1E1E1E]">
                    {booking.price}
                  </td>

                  {/* Status Column */}
                  <td className="py-5 px-6 text-right sm:text-center">
                    {getStatusBadge(booking.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
