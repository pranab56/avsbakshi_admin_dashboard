import CardStates from "@/components/overview/CardStates";
import { ApiTransaction } from "./RevenueTable";

interface RevenueStatsProps {
  transactions?: ApiTransaction[];
  isLoading?: boolean;
}

export default function RevenueStats({
  transactions = [],
  isLoading = false,
}: RevenueStatsProps) {
  // Compute dynamically based on actual API transactions response
  const totalRevenue = transactions.reduce((acc, curr) => {
    const status = (curr.status || "").toLowerCase();
    if (
      curr.isPaid ||
      status === "completed" ||
      status === "success" ||
      status === "successful" ||
      status === "paid"
    ) {
      return acc + (Number(curr.amount || curr.netAmount) || 0);
    }
    return acc;
  }, 0);

  const successfulCount = transactions.filter((curr) => {
    const status = (curr.status || "").toLowerCase();
    return (
      curr.isPaid ||
      status === "completed" ||
      status === "success" ||
      status === "successful" ||
      status === "paid"
    );
  }).length;

  const pendingCount = transactions.filter((curr) => {
    const status = (curr.status || "").toLowerCase();
    return status === "pending" || status === "processing";
  }).length;

  const failedCount = transactions.filter((curr) => {
    const status = (curr.status || "").toLowerCase();
    return (
      status === "failed" ||
      status === "cancelled" ||
      status === "refunded" ||
      status === "rejected"
    );
  }).length;

  const formattedRevenue = `$${totalRevenue.toLocaleString(undefined, {
    minimumFractionDigits: totalRevenue % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      <CardStates
        number={formattedRevenue}
        title="Total Revenue"
        isLoading={isLoading}
      />
      <CardStates
        number={successfulCount}
        title="Successful"
        isLoading={isLoading}
      />
      <CardStates
        number={pendingCount}
        title="Pending"
        isLoading={isLoading}
      />
      <CardStates
        number={failedCount}
        title="Failed Issues"
        isLoading={isLoading}
      />
    </div>
  );
}
