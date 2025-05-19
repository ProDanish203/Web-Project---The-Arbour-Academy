import { ParentDashboard } from "@/components/parent/parent-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | The Arbour Academy",
  description: "Parent dashboard for The Arbour Academy",
};

export default function ParentDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Parent Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back to The Arbour Academy parent portal
          </p>
        </div>
      </div>
      <ParentDashboard />
    </div>
  );
}
