import { TeachersTable } from "@/components/teachers/teachers-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teachers | The Arbour Academy",
  description: "Manage teachers at The Arbour Academy",
};

export default function TeachersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">
            Manage faculty members at The Arbour Academy
          </p>
        </div>
      </div>
      <TeachersTable />
    </div>
  );
}
