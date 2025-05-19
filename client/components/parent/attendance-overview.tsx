"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { StudentAttendanceData } from "@/types/types";

interface AttendanceOverviewProps {
  attendanceData: StudentAttendanceData[];
}

export function AttendanceOverview({
  attendanceData,
}: AttendanceOverviewProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>(
    attendanceData.length > 0 ? attendanceData[0].student._id : ""
  );

  const selectedStudentData = attendanceData.find(
    (data) => data.student._id === selectedStudent
  );

  if (!selectedStudentData) {
    return <div>No attendance data available</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "ABSENT":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "LATE":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "HALF_DAY":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "LEAVE":
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-50 text-green-700 border-green-200";
      case "ABSENT":
        return "bg-red-50 text-red-700 border-red-200";
      case "LATE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "HALF_DAY":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "LEAVE":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const sortedAttendance = [...selectedStudentData.attendance].sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <Tabs
        value={selectedStudent}
        onValueChange={setSelectedStudent}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          {attendanceData.map((data) => (
            <TabsTrigger key={data.student._id} value={data.student._id}>
              {data.student.firstName}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-green-600">
              {selectedStudentData.stats.total > 0
                ? (
                    (selectedStudentData.stats.statusCounts.PRESENT /
                      selectedStudentData.stats.total) *
                    100
                  ).toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Overall Attendance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-2xl font-bold">
                {selectedStudentData.stats.statusCounts.PRESENT}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Present Days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
              <span className="text-2xl font-bold">
                {selectedStudentData.stats.statusCounts.ABSENT}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Absent Days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-500" />
              <span className="text-2xl font-bold">
                {selectedStudentData.stats.statusCounts.LATE}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Late Days
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Recent Attendance Records</h3>
        <div className="space-y-2">
          {sortedAttendance.slice(0, 10).map((record) => (
            <div
              key={record._id}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(record.status)}
                <span className="text-sm">
                  {formatDate(new Date(record.date || ""))}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className={getStatusColor(record.status)}
                >
                  {record.status}
                </Badge>
                <span className="text-xs text-muted-foreground hidden md:inline">
                  {record.markedBy
                    ? `Marked by ${
                        (record.markedBy as unknown as any).name || ""
                      }`
                    : ""}
                </span>
                {record.remarks && (
                  <span className="text-xs text-muted-foreground hidden md:inline">
                    Remarks: {record.remarks || "None"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-4">Attendance Summary</h3>
          <div className="p-4 rounded-md bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total School Days:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.stats.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Present:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.stats.statusCounts.PRESENT}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Absent:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.stats.statusCounts.ABSENT}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Late:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.stats.statusCounts.LATE}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Half Day:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.stats.statusCounts.HALF_DAY}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Leave:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.stats.statusCounts.LEAVE}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Student Information</h3>
          <div className="p-4 rounded-md bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Name:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.student.firstName}{" "}
                  {selectedStudentData.student.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Grade:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.student.grade}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Section:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.student.section}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Roll Number:</span>
                <span className="text-sm font-medium">
                  {selectedStudentData.student.rollNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fee Status:</span>
                <Badge
                  variant="outline"
                  className={
                    selectedStudentData.student.feeStatus === "PAID"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }
                >
                  {selectedStudentData.student.feeStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
