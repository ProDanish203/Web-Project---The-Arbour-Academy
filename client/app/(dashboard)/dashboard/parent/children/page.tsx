import { ChildrenDashboard } from "@/components/parent/children-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Children | The Arbour Academy",
  description:
    "View information about your children enrolled at The Arbour Academy",
};

export default function ParentChildrenPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Children</h1>
          <p className="text-muted-foreground">
            View information about your children enrolled at The Arbour Academy
          </p>
        </div>
      </div>
      <ChildrenDashboard />
    </div>
  );
}
