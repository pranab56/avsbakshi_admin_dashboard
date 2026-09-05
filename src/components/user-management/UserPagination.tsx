"use client";

interface UserPaginationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  pages?: string[];
}

export default function UserPagination({
  currentPage,
  onPageChange,
  pages = ["01", "02", "03", "04", "05", "...", "24"],
}: UserPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 pt-4 pb-6">
      <button
        type="button"
        className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-2 cursor-pointer transition-colors"
      >
        Prev
      </button>

      {pages.map((page) => {
        const isSelected = currentPage === page;
        return (
          <button
            key={page}
            type="button"
            onClick={() => page !== "..." && onPageChange(page)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
              isSelected
                ? "bg-[#A67528] text-white shadow-xs"
                : "bg-[#DCD5C9] text-[#A67528] hover:bg-[#d2c9bc]"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className="text-xs sm:text-sm font-semibold text-[#A67528] hover:underline px-3 py-2 cursor-pointer transition-colors ml-1"
      >
        Next
      </button>
    </div>
  );
}
