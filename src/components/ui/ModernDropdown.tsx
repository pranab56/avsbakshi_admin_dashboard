"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
  label: string;
  value: string;
  color?: string; // Optional colored dot indicator e.g. "bg-[#2C7446]"
}

interface ModernDropdownProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  minWidth?: string;
  className?: string;
}

export default function ModernDropdown({
  label,
  value,
  onChange,
  options,
  minWidth = "min-w-[140px]",
  className = "",
}: ModernDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption =
    options.find((opt) => opt.value.toLowerCase() === value.toLowerCase()) || options[0];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-neutral-600 whitespace-nowrap">
          {label}
        </label>
      )}

      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between gap-2.5 bg-white hover:bg-neutral-50/90 border border-black/5 rounded-xl h-10 px-3.5 text-xs font-semibold text-[#1E1E1E] shadow-2xs transition-all cursor-pointer ${minWidth} focus:outline-none focus:ring-2 focus:ring-[#AC6135]/40`}
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2 truncate">
            {currentOption?.color && (
              <span className={`w-2 h-2 rounded-full shrink-0 ${currentOption.color}`} />
            )}
            <span className="truncate">{currentOption?.label || value}</span>
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-500 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-max min-w-full bg-white border border-black/5 rounded-xl shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((option) => {
              const isSelected =
                value.toLowerCase() === option.value.toLowerCase();

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#F3F0EA] text-[#B07D2B] font-semibold"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {option.color && (
                      <span className={`w-2 h-2 rounded-full shrink-0 ${option.color}`} />
                    )}
                    <span>{option.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#B07D2B] shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
