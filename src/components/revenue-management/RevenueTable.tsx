"use client";

import Image from "next/image";

export type TransactionStatus = "Successful" | "Pending" | "Failed";

export type TransactionRow = {
  id: string;
  trxId: string;
  clientName: string;
  clientAvatar: string;
  dateTime: string;
  amount: string;
  status: TransactionStatus;
};

export const transactions: TransactionRow[] = [
  {
    id: "1",
    trxId: "#TRX-9982",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dateTime: "Today · 10:00 AM",
    amount: "£175",
    status: "Successful",
  },
  {
    id: "2",
    trxId: "#TRX-9982",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dateTime: "Today · 10:00 AM",
    amount: "£175",
    status: "Pending",
  },
  {
    id: "3",
    trxId: "#TRX-9982",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dateTime: "Today · 10:00 AM",
    amount: "£175",
    status: "Failed",
  },
  {
    id: "4",
    trxId: "#TRX-9982",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dateTime: "Today · 10:00 AM",
    amount: "£175",
    status: "Successful",
  },
  {
    id: "5",
    trxId: "#TRX-9982",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dateTime: "Today · 10:00 AM",
    amount: "£175",
    status: "Successful",
  },
  {
    id: "6",
    trxId: "#TRX-9982",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dateTime: "Today · 10:00 AM",
    amount: "£175",
    status: "Pending",
  },
  {
    id: "7",
    trxId: "#TRX-9982",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dateTime: "Today · 10:00 AM",
    amount: "£175",
    status: "Successful",
  },
  {
    id: "8",
    trxId: "#TRX-9982",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dateTime: "Today · 10:00 AM",
    amount: "£175",
    status: "Failed",
  },
  {
    id: "9",
    trxId: "#TRX-9982",
    clientName: "Rachel Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dateTime: "Today · 10:00 AM",
    amount: "£175",
    status: "Successful",
  },
];

export default function RevenueTable({ data = transactions }: { data?: TransactionRow[] }) {
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "Successful":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-medium bg-[#DDF0E4] text-[#2C7446]">
            Successful
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-medium bg-[#FDF1DB] text-[#B07D2B]">
            Pending
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-medium bg-[#FCE6E4] text-[#D9383A]">
            Failed
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
              <th className="py-4 px-6">TRANSACTION ID</th>
              <th className="py-4 px-6">CLIENT</th>
              <th className="py-4 px-6">DATE & TIME</th>
              <th className="py-4 px-6">AMOUNT</th>
              <th className="py-4 px-6 text-right sm:text-center">STATUS</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-black/5 text-sm text-[#1E1E1E] bg-white">
            {data.map((trx, idx) => (
              <tr
                key={`${trx.id}-${idx}`}
                className="hover:bg-neutral-50/80 transition-colors"
              >
                {/* Transaction ID Column */}
                <td className="py-5 px-6 font-semibold text-xs text-[#1E1E1E]">
                  {trx.trxId}
                </td>

                {/* Client Column */}
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-300">
                      <Image
                        src={trx.clientAvatar}
                        alt={trx.clientName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-semibold text-[#1E1E1E] text-sm">
                      {trx.clientName}
                    </span>
                  </div>
                </td>

                {/* Date & Time Column */}
                <td className="py-5 px-6 font-medium text-xs text-neutral-700">
                  {trx.dateTime}
                </td>

                {/* Amount Column */}
                <td className="py-5 px-6 font-serif italic font-bold text-sm text-[#1E1E1E]">
                  {trx.amount}
                </td>

                {/* Status Column */}
                <td className="py-5 px-6 text-right sm:text-center">
                  {getStatusBadge(trx.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
