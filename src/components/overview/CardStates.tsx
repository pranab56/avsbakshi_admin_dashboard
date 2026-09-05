export default function CardStates({ number, title }: { number: string, title: string }) {
  return (
    <div className="bg-[#FDFDFD] rounded-xl p-6 sm:p-7 border border-black/5 transition-all shadow-sm">
      <h2 className="text-4xl sm:text-[42px] font-serif italic text-[#1E1E1E] font-normal leading-none tracking-tight">
        {number}
      </h2>
      <p className="text-xs sm:text-sm text-[#706E6B] font-normal mt-3">
        {title}
      </p>
    </div>
  )
}