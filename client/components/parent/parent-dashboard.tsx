"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  BarChart3,
  Bell,
  Calendar,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { AttendanceOverview } from "./attendance-overview";
import { formatDate } from "@/lib/utils";
import type { ParentAttendanceData } from "@/types/types";
import { toast } from "sonner";
import { getAttendanceforParents } from "@/API/attendance.api";
import { useQuery } from "@tanstack/react-query";
import { MOCK_ANNOUNCEMENTS, MOCK_UPCOMING_TESTS } from "@/lib/data";

export function ParentDashboard() {
  const [attendanceData, setAttendanceData] =
    useState<ParentAttendanceData | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["parent-dashboard"],
    queryFn: () => getAttendanceforParents(),
  });

  useEffect(() => {
    if (!isLoading && data) {
      if (data.success) {
        setAttendanceData(data.response);
      } else toast.error(data.response);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No attendance data available</p>
      </div>
    );
  }

  const { children, attendanceData: studentAttendanceData } = attendanceData;
  const studentNames = children.map((student) => student.firstName).join(", ");
  const totalClasses = children.length * 6;
  const totalAttendanceDays = studentAttendanceData.reduce(
    (acc, data) => acc + data.stats.total,
    0
  );
  const totalPresentDays = studentAttendanceData.reduce(
    (acc, data) => acc + data.stats.statusCounts.PRESENT,
    0
  );
  const overallAttendancePercentage =
    totalAttendanceDays > 0
      ? (totalPresentDays / totalAttendanceDays) * 100
      : 0;

  const unpaidFeesCount = children.filter(
    (child) => child.feeStatus === "UNPAID"
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children.length}</div>
            <p className="text-xs text-muted-foreground truncate">
              {studentNames}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">Across all children</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallAttendancePercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Overall attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Fees</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unpaidFeesCount}</div>
            <p className="text-xs text-muted-foreground">
              Children with unpaid fees
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Children&apos;s Progress</CardTitle>
            <CardDescription>Attendance performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentAttendanceData.map((data) => {
                const { student, stats } = data;
                const attendancePercentage =
                  stats.total > 0
                    ? (stats.statusCounts.PRESENT / stats.total) * 100
                    : 0;
                const gradeLabel =
                  attendancePercentage > 95
                    ? "A"
                    : attendancePercentage > 85
                    ? "B+"
                    : "C";

                return (
                  <div key={student._id}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">
                        {student.firstName} - {student.grade}
                      </p>
                      <span className="text-sm font-medium">
                        {gradeLabel} ({attendancePercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={attendancePercentage} className="h-2" />
                  </div>
                );
              })}

              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Upcoming Tests</h4>
                <div className="space-y-2">
                  {MOCK_UPCOMING_TESTS.slice(0, 3).map((test) => (
                    <div key={test.id} className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          test.importance === "high"
                            ? "bg-red-500"
                            : test.importance === "medium"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <p className="text-sm">
                        {test.studentName} - {test.subject}
                      </p>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(test.date).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                          ? "Today"
                          : new Date(test.date).toLocaleDateString() ===
                            new Date(Date.now() + 86400000).toLocaleDateString()
                          ? "Tomorrow"
                          : formatDate(test.date)}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="p-0 h-auto text-xs mt-2">
                  View all tests <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <RecentAnnouncements />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>
            Detailed attendance statistics for your children
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceOverview attendanceData={studentAttendanceData} />
        </CardContent>
      </Card>

      <SchoolCalendar />
    </div>
  );
}

const RecentAnnouncements = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Announcements</CardTitle>
        <CardDescription>School updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_ANNOUNCEMENTS.slice(0, 3).map((announcement) => (
            <div
              key={announcement.id}
              className="border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium flex items-center">
                  {announcement.title}
                  {announcement.isNew && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                      New
                    </span>
                  )}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {formatDate(announcement.date)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {announcement.description}
              </p>
            </div>
          ))}
          <Button variant="link" className="p-0 h-auto text-xs">
            View all announcements <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SchoolCalendar = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>School Calendar</CardTitle>
        <CardDescription>Upcoming events and important dates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-10 w-10 text-primary" />
            <div>
              <h4 className="font-medium">Parent-Teacher Meeting</h4>
              <p className="text-sm text-muted-foreground">
                May 30, 2025 • 3:00 PM - 5:00 PM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-10 w-10 text-primary" />
            <div>
              <h4 className="font-medium">School Carnival</h4>
              <p className="text-sm text-muted-foreground">
                June 5, 2025 • 10:00 AM - 4:00 PM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-10 w-10 text-primary" />
            <div>
              <h4 className="font-medium">Summer Break Begins</h4>
              <p className="text-sm text-muted-foreground">June 15, 2025</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            View Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
