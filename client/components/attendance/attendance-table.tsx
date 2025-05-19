"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { AttendanceRecord, Student } from "@/types/types";

interface AttendanceTableProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  updateAttendanceRecord: (
    studentId: string,
    status: string,
    remarks?: string
  ) => void;
}

export function AttendanceTable({
  students,
  attendanceRecords,
  updateAttendanceRecord,
}: AttendanceTableProps) {
  // Get attendance record for a student
  const getAttendanceRecord = (studentId: string) => {
    return (
      attendanceRecords.find((record) => record.studentId === studentId) || {
        studentId,
        status: "PRESENT",
        remarks: "",
      }
    );
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Roll No.</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead className="hidden md:table-cell">Gender</TableHead>
            <TableHead className="hidden md:table-cell">Parent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const record = getAttendanceRecord(student._id);
            return (
              <TableRow key={student._id}>
                <TableCell className="font-medium">
                  {student.rollNumber}
                </TableCell>
                <TableCell>
                  {student.firstName} {student.lastName}
                </TableCell>
                <TableCell className="hidden md:table-cell capitalize">
                  <Badge
                    variant="outline"
                    className={
                      student.gender === "male"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-pink-50 text-pink-700 border-pink-200"
                    }
                  >
                    {student.gender}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm">
                    {(student.parentId as any).name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(student.parentId as any).phone}
                  </div>
                </TableCell>
                <TableCell>
                  <RadioGroup
                    value={record.status}
                    onValueChange={(value) =>
                      updateAttendanceRecord(student._id, value, record.remarks)
                    }
                    className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="PRESENT"
                        id={`present-${student._id}`}
                      />
                      <Label
                        htmlFor={`present-${student._id}`}
                        className="flex items-center cursor-pointer text-green-600"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Present</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="ABSENT"
                        id={`absent-${student._id}`}
                      />
                      <Label
                        htmlFor={`absent-${student._id}`}
                        className="flex items-center cursor-pointer text-red-600"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Absent</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="LATE" id={`late-${student._id}`} />
                      <Label
                        htmlFor={`late-${student._id}`}
                        className="flex items-center cursor-pointer text-amber-600"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Late</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Add remarks (optional)"
                    value={record.remarks || ""}
                    onChange={(e) =>
                      updateAttendanceRecord(
                        student._id,
                        record.status,
                        e.target.value
                      )
                    }
                    className="h-8 text-sm"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
