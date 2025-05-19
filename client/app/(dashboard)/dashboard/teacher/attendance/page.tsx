import { AttendanceManager } from "@/components/attendance/attendance-manager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance Management | The Arbour Academy",
  description: "Mark and manage student attendance",
};

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Attendance Management
          </h1>
          <p className="text-muted-foreground">
            Mark and manage student attendance
          </p>
        </div>
      </div>
      <AttendanceManager />
    </div>
  );
}
