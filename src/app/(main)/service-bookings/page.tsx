"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BookingsManagementRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/services?tab=services-booking");
  }, [router]);

  return null;
}
