"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type FilterOption = "This Week" | "Last Week" | "This Month" | "Last 30 Days";

type RevenueItem = {
  day: string;
  val: number;
  amount: string;
};

const revenueDataMap: Record<FilterOption, RevenueItem[]> = {
  "This Week": [
    { day: "Mon", val: 240, amount: "£240" },
    { day: "Tue", val: 385, amount: "£385" },
    { day: "Wed", val: 175, amount: "£175" },
    { day: "Thu", val: 460, amount: "£460" },
    { day: "Fri", val: 310, amount: "£310" },
    { day: "Sat", val: 520, amount: "£520" },
    { day: "Sun", val: 300, amount: "£300" },
  ],
  "Last Week": [
    { day: "Mon", val: 310, amount: "£310" },
    { day: "Tue", val: 290, amount: "£290" },
    { day: "Wed", val: 410, amount: "£410" },
    { day: "Thu", val: 380, amount: "£380" },
    { day: "Fri", val: 490, amount: "£490" },
    { day: "Sat", val: 550, amount: "£550" },
    { day: "Sun", val: 260, amount: "£260" },
  ],
  "This Month": [
    { day: "W1", val: 1420, amount: "£1,420" },
    { day: "W2", val: 2090, amount: "£2,090" },
    { day: "W3", val: 1850, amount: "£1,850" },
    { day: "W4", val: 2340, amount: "£2,340" },
  ],
  "Last 30 Days": [
    { day: "W1", val: 1650, amount: "£1,650" },
    { day: "W2", val: 1920, amount: "£1,920" },
    { day: "W3", val: 2100, amount: "£2,100" },
    { day: "W4", val: 2450, amount: "£2,450" },
  ],
};

export default function BarChart() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("This Week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<string>("Mon");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const revenueData = revenueDataMap[selectedFilter] || revenueDataMap["This Week"];

  return (
    <div className="lg:col-span-2 bg-[#FDFDFD] rounded-xl p-6 sm:p-7 shadow-sm border border-black/5 flex flex-col justify-between min-h-[380px]">
      {/* Card Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif italic font-normal text-[#1E1E1E]">
            Revenue Overview
          </h3>
          <p className="text-xs sm:text-sm text-[#706E6B] font-normal mt-1">
            Week of 19–25 Aug · £2,090 total
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#F3F0EA] hover:bg-[#E1DDD4] text-xs font-normal text-[#2B2927] px-4 py-3 rounded-sm transition-all flex items-center gap-2 shadow-2xs cursor-pointer border border-black/5"
          >
            <span>{selectedFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-40 bg-[#F3F0EA] border border-black/10 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                {(["This Week", "Last Week", "This Month", "Last 30 Days"] as FilterOption[]).map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedFilter(option);
                        setIsDropdownOpen(false);
                        setActiveDay(revenueDataMap[option]?.[0]?.day || "Mon");
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-[#2B2927] hover:bg-[#D6CEC3] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{option}</span>
                      {selectedFilter === option && (
                        <Check className="w-3.5 h-3.5 text-[#AC6135]" />
                      )}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="pt-6 pb-2 w-full h-[240px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={revenueData}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload[0]) {
                  setActiveDay(state.activePayload[0].payload.day);
                }
              }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={({ x, y, payload }) => {
                  const isActive = activeDay === payload.value;
                  return (
                    <text
                      x={x}
                      y={y + 14}
                      textAnchor="middle"
                      fill={isActive ? "#B8784A" : "#B8784A40"}
                      fontSize={12}
                      fontWeight={isActive ? 600 : 400}
                      className="cursor-pointer transition-colors"
                    >
                      {payload.value}
                    </text>
                  );
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as RevenueItem;
                    return (
                      <div className="bg-[#E8E3DA] border border-black/10 px-3 py-1.5 rounded-lg shadow-md text-xs">
                        <span className="font-medium text-[#1E1E1E]">
                          {data.day}:{" "}
                        </span>
                        <span className="font-semibold text-[#AC6135]">
                          {data.amount}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="val"
                radius={[6, 6, 0, 0]}
                maxBarSize={64}
                className="cursor-pointer"
              >
                <LabelList
                  dataKey="amount"
                  position="top"
                  fill="#1A1A1A"
                  fontSize={12}
                  fontWeight={600}
                  offset={8}
                />
                {revenueData.map((entry) => (
                  <Cell
                    key={`cell-${entry.day}`}
                    fill={activeDay === entry.day ? "#AC6135" : "#D8D0C5"}
                    className="transition-colors duration-300 hover:opacity-90 cursor-pointer"
                  />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full animate-pulse bg-black/5 rounded-xl" />
        )}
      </div>
    </div>
  );
}