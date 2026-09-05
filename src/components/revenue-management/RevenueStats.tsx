import CardStates from "@/components/overview/CardStates";

export default function RevenueStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      <CardStates number="$428,520" title="Total Revenue" />
      <CardStates number="1,245" title="Successful" />
      <CardStates number="42" title="Pending" />
      <CardStates number="7" title="Failed Issues" />
    </div>
  );
}
