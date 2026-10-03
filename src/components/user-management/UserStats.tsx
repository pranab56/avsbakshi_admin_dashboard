import CardStates from "@/components/overview/CardStates";

interface UserStatsProps {
  totalUsers?: number;
  totalCustomers?: number;
  totalProfessionals?: number;
}

export default function UserStats({
  totalUsers = 0,
  totalCustomers = 0,
  totalProfessionals = 0,
}: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
      <CardStates number={totalUsers ? totalUsers.toLocaleString() : "0"} title="Total Users" />
      <CardStates number={totalCustomers ? totalCustomers.toLocaleString() : "0"} title="Customers" />
      <CardStates number={totalProfessionals ? totalProfessionals.toLocaleString() : "0"} title="Professionals" />
    </div>
  );
}
