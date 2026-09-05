import CardStates from "@/components/overview/CardStates";

export default function UserStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
      <CardStates number="24,850" title="Total Customers" />
      <CardStates number="3,240" title="Professionals" />
      <CardStates number="156" title="Businesses" />
    </div>
  );
}
