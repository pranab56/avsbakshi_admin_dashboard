"use client";

import { useUserGrothQuery } from "@/features/analytics/analyticsApi";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type GrowthItem = {
  year: number;
  month: number;
  monthName: string;
  count: number;
};

const defaultMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const availableYears = [2026, 2025, 2024, 2023];

export default function BarChart() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMonth, setActiveMonth] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const timezone = useMemo(() => {
    if (typeof Intl !== "undefined") {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka";
      } catch {
        return "Asia/Dhaka";
      }
    }
    return "Asia/Dhaka";
  }, []);

  const { data: userGrowthResponse, isLoading } = useUserGrothQuery({
    year: selectedYear,
    timezone,
  });

  // Process data from API or fall back to empty months
  const chartData = useMemo(() => {
    const rawData: GrowthItem[] = userGrowthResponse?.data || [];
    return defaultMonths.map((monthName, index) => {
      const monthNum = index + 1;
      const found = rawData.find(
        (item) =>
          item.month === monthNum ||
          item.monthName?.toLowerCase() === monthName.toLowerCase()
      );
      return {
        monthName,
        count: found ? Number(found.count) || 0 : 0,
        year: found?.year || selectedYear,
        month: monthNum,
      };
    });
  }, [userGrowthResponse, selectedYear]);

  // Set default active month to latest with data or first month
  useEffect(() => {
    if (chartData.length > 0) {
      const latestWithData = [...chartData].reverse().find((d) => d.count > 0);
      if (latestWithData) {
        setActiveMonth(latestWithData.monthName);
      } else {
        setActiveMonth(chartData[0].monthName);
      }
    }
  }, [chartData]);

  const totalYearUsers = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <div className="lg:col-span-2 bg-[#FDFDFD] rounded-xl p-6 sm:p-7 shadow-sm border border-black/5 flex flex-col justify-between min-h-[380px]">
      {/* Card Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif italic font-normal text-[#1E1E1E]">
            User Growth
          </h3>
          <p className="text-xs sm:text-sm text-[#706E6B] font-normal mt-1">
            Year of {selectedYear} · {totalYearUsers.toLocaleString()} total users
          </p>
        </div>

        {/* Year Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#F3F0EA] hover:bg-[#E1DDD4] text-xs font-normal text-[#2B2927] px-4 py-2.5 rounded-md transition-all flex items-center gap-2 shadow-2xs cursor-pointer border border-black/5"
          >
            <span>{selectedYear}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-36 bg-[#F3F0EA] border border-black/10 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-[#2B2927] hover:bg-[#D6CEC3] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{year}</span>
                    {selectedYear === year && (
                      <Check className="w-3.5 h-3.5 text-[#AC6135]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="pt-6 pb-2 w-full h-[240px]">
        {isMounted && !isLoading ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={chartData}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload[0]) {
                  setActiveMonth(state.activePayload[0].payload.monthName);
                }
              }}
            >
              <XAxis
                dataKey="monthName"
                axisLine={false}
                tickLine={false}
                tick={({
                  x,
                  y,
                  payload,
                }: {
                  x?: number | string;
                  y?: number | string;
                  payload?: { value?: string };
                }) => {
                  const isActive = activeMonth === payload?.value;
                  return (
                    <text
                      x={x}
                      y={Number(y) + 14}
                      textAnchor="middle"
                      fill={isActive ? "#B8784A" : "#B8784A80"}
                      fontSize={12}
                      fontWeight={isActive ? 600 : 400}
                      className="cursor-pointer transition-colors"
                    >
                      {payload?.value}
                    </text>
                  );
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as {
                      monthName: string;
                      count: number;
                      year: number;
                    };
                    return (
                      <div className="bg-[#E8E3DA] border border-black/10 px-3 py-1.5 rounded-lg shadow-md text-xs">
                        <span className="font-medium text-[#1E1E1E]">
                          {data.monthName} {data.year}:{" "}
                        </span>
                        <span className="font-semibold text-[#AC6135]">
                          {data.count} {data.count === 1 ? "user" : "users"}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                className="cursor-pointer"
              >
                <LabelList
                  dataKey="count"
                  position="top"
                  fill="#1A1A1A"
                  fontSize={11}
                  fontWeight={600}
                  offset={6}
                  formatter={(val) => (Number(val) > 0 ? `${val}` : "")}
                />
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.monthName}`}
                    fill={activeMonth === entry.monthName ? "#AC6135" : "#D8D0C5"}
                    className="transition-colors duration-300 hover:opacity-90 cursor-pointer"
                  />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full animate-pulse bg-black/5 rounded-xl flex items-center justify-center">
            <span className="text-xs text-[#706E6B]">Loading chart data...</span>
          </div>
        )}
      </div>
    </div>
  );
}