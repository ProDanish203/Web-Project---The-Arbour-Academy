"use client";

import { usePathname } from "next/navigation";

export type DashboardType = "admin" | "teacher" | "parent" | null;

export function useDashboardType(): DashboardType {
  const pathname = usePathname();
  if (pathname?.includes("/admin")) {
    return "admin";
  } else if (pathname?.includes("/teacher")) {
    return "teacher";
  } else if (pathname?.includes("/parent")) {
    return "parent";
  }

  return null;
}
