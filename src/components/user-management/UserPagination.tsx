"use client";

interface UserPaginationProps {
  currentPage: number | string;
  totalPages?: number;
  onPageChange: (page: number | string) => void;
  pages?: string[];
}

export default function UserPagination({
  currentPage,
  totalPages = 1,
  onPageChange,
  pages,
}: UserPaginationProps) {
  const pageNum = typeof currentPage === "string" ? parseInt(currentPage, 10) || 1 : currentPage;

  if (totalPages <= 1 && (!pages || pages.length <= 1)) return null;

  const getPageNumbers = () => {
    if (pages && pages.length > 0) return pages;

    const list: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) list.push(i);
    } else {
      list.push(1);
      if (pageNum > 3) list.push("...");

      const start = Math.max(2, pageNum - 1);
      const end = Math.min(totalPages - 1, pageNum + 1);

      for (let i = start; i <= end; i++) {
        if (!list.includes(i)) list.push(i);
      }

      if (pageNum < totalPages - 2) list.push("...");
      if (!list.includes(totalPages)) list.push(totalPages);
    }

    return list;
  };

  const displayPages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 pt-4 pb-6 select-none">
      <button
        type="button"
        disabled={pageNum <= 1}
        onClick={() => onPageChange(typeof currentPage === "string" ? String(pageNum - 1).padStart(2, '0') : pageNum - 1)}
        className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 cursor-pointer transition-colors"
      >
        Prev
      </button>

      {displayPages.map((page, index) => {
        const pageString = String(page);
        const isSelected = String(currentPage) === pageString || pageNum === Number(page);
        const isEllipsis = pageString === "...";

        return (
          <button
            key={isEllipsis ? `ellipsis-${index}` : pageString}
            type="button"
            disabled={isEllipsis}
            onClick={() => {
              if (isEllipsis) return;
              if (typeof currentPage === "string") {
                onPageChange(pageString.padStart(2, '0'));
              } else {
                onPageChange(Number(page));
              }
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              isEllipsis
                ? "cursor-default text-neutral-400"
                : isSelected
                ? "bg-[#A67528] text-white shadow-xs cursor-default"
                : "bg-[#DCD5C9] text-[#A67528] hover:bg-[#d2c9bc] cursor-pointer"
            }`}
          >
            {pageString}
          </button>
        );
      })}

      <button
        type="button"
        disabled={totalPages > 0 && pageNum >= totalPages}
        onClick={() => onPageChange(typeof currentPage === "string" ? String(pageNum + 1).padStart(2, '0') : pageNum + 1)}
        className="text-xs sm:text-sm font-semibold text-[#A67528] hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed px-3 py-2 cursor-pointer transition-colors ml-1"
      >
        Next
      </button>
    </div>
  );
}
