"use client";

import Image from "next/image";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: string;
  dateTime: string;
  bookings: number;
  status: "Active" | "Verified" | "Suspended";
};

export const mockUsers: UserRow[] = [
  {
    id: "1",
    name: "Rachel Thompson",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "Customer",
    dateTime: "Today · 10:00 AM",
    bookings: 24,
    status: "Active",
  },
  {
    id: "2",
    name: "Rachel Thompson",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "Customer",
    dateTime: "Today · 10:00 AM",
    bookings: 24,
    status: "Verified",
  },
  {
    id: "3",
    name: "Rachel Thompson",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "Customer",
    dateTime: "Today · 10:00 AM",
    bookings: 24,
    status: "Suspended",
  },
  {
    id: "4",
    name: "Rachel Thompson",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "Customer",
    dateTime: "Today · 10:00 AM",
    bookings: 24,
    status: "Active",
  },
  {
    id: "5",
    name: "Rachel Thompson",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "Customer",
    dateTime: "Today · 10:00 AM",
    bookings: 24,
    status: "Active",
  },
  {
    id: "6",
    name: "Rachel Thompson",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "Customer",
    dateTime: "Today · 10:00 AM",
    bookings: 24,
    status: "Active",
  },
  {
    id: "7",
    name: "Rachel Thompson",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "Customer",
    dateTime: "Today · 10:00 AM",
    bookings: 24,
    status: "Active",
  },
  {
    id: "8",
    name: "Rachel Thompson",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "Customer",
    dateTime: "Today · 10:00 AM",
    bookings: 24,
    status: "Active",
  },
  {
    id: "9",
    name: "Rachel Thompson",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    type: "Customer",
    dateTime: "Today · 10:00 AM",
    bookings: 24,
    status: "Active",
  },
];

export default function UserTable({ users = mockUsers }: { users?: UserRow[] }) {
  const getStatusBadge = (status: UserRow["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-medium bg-[#DDF0E4] text-[#2C7446]">
            Active
          </span>
        );
      case "Verified":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-medium bg-[#FDF1DB] text-[#B07D2B]">
            Verified
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-medium bg-[#FCE6E4] text-[#D9383A]">
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#E1DDD4] rounded-xl shadow-xs border border-black/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F3F0EA] border-b border-black/5 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase">
              <th className="py-4 px-6">USER</th>
              <th className="py-4 px-6">TYPE</th>
              <th className="py-4 px-6">DATE & TIME</th>
              <th className="py-4 px-6">BOOKINGS</th>
              <th className="py-4 px-6 text-right sm:text-center">STATUS</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-black/5 text-sm text-[#1E1E1E] bg-white">
            {users.map((user, idx) => (
              <tr
                key={`${user.id}-${idx}`}
                className="hover:bg-neutral-50/80 transition-colors"
              >
                {/* User Column */}
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-300">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#1E1E1E] text-sm leading-tight">
                        {user.name}
                      </span>
                      <span className="text-xs text-neutral-500 font-normal leading-tight mt-1">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Type Column */}
                <td className="py-5 px-6 font-medium text-xs">
                  <div className="flex items-center gap-1.5 text-[#B07D2B] font-semibold">
                    <span className="text-[10px]">●</span>
                    <span>{user.type}</span>
                  </div>
                </td>

                {/* Date & Time Column */}
                <td className="py-5 px-6 font-medium text-xs text-neutral-700">
                  {user.dateTime}
                </td>

                {/* Bookings Column */}
                <td className="py-5 px-6 font-medium text-xs text-neutral-700">
                  {user.bookings}
                </td>

                {/* Status Column */}
                <td className="py-5 px-6 text-right sm:text-center">
                  {getStatusBadge(user.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
