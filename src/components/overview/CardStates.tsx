interface CardStatesProps {
  number: string | number;
  title: string;
  isLoading?: boolean;
}

export default function CardStates({
  number,
  title,
  isLoading = false,
}: CardStatesProps) {
  const displayValue =
    typeof number === "number"
      ? number.toLocaleString()
      : (number ?? "0");

  return (
    <div className="bg-[#FDFDFD] rounded-xl p-5 sm:p-6 border border-black/5 transition-all shadow-sm">
      {isLoading ? (
        <div className="h-9 w-20 bg-black/5 rounded animate-pulse" />
      ) : (
        <h2 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-normal leading-none tracking-tight">
          {displayValue}
        </h2>
      )}
      <p className="text-xs sm:text-sm text-[#706E6B] font-normal mt-3">
        {title}
      </p>
    </div>
  );
}