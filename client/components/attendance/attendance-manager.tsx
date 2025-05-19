"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AttendanceTable } from "./attendance-table";
import type { AttendanceRecord, Student } from "@/types/types";
import { AVAILABLE_GRADES, AVAILABLE_SECTIONS } from "@/lib/data";
import { toast } from "sonner";
import { getStudentsbyGradeAndSection } from "@/API/students.api";
import { markAttendance } from "@/API/attendance.api";
import { useRouter } from "next/navigation";

export function AttendanceManager() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedSection("");
  }, [selectedGrade]);

  useEffect(() => {
    setStudents([]);
    setAttendanceRecords([]);
  }, [selectedGrade, selectedSection]);

  const fetchStudents = async () => {
    if (!selectedGrade || !selectedSection) return;

    setIsFetching(true);

    try {
      const { success, response } = await getStudentsbyGradeAndSection({
        grade: selectedGrade,
        section: selectedSection,
      });
      if (!success) return toast.error(response as string);

      setStudents(response);
      const initialAttendanceRecords = response.map((student: Student) => ({
        studentId: student._id,
        status: "PRESENT",
        remarks: "",
      }));
      setAttendanceRecords(initialAttendanceRecords);
    } catch (error) {
      toast.error("Failed to fetch students. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const updateAttendanceRecord = (
    studentId: string,
    status: string,
    remarks = ""
  ) => {
    setAttendanceRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.studentId === studentId
          ? {
              ...record,
              status,
              remarks,
            }
          : record
      )
    );
  };

  const saveAttendanceRecords = async () => {
    if (!selectedGrade || !selectedSection || attendanceRecords.length === 0)
      return;

    setIsSaving(true);
    try {
      const { success, response } = await markAttendance({
        grade: selectedGrade,
        section: selectedSection,
        attendanceRecords,
      });

      if (!success) return toast.error(response as string);

      toast.success("Attendance records saved successfully.");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save attendance records. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(
      (record) => record.status === "PRESENT"
    ).length;
    const absent = attendanceRecords.filter(
      (record) => record.status === "ABSENT"
    ).length;
    const late = attendanceRecords.filter(
      (record) => record.status === "LATE"
    ).length;

    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Select Class</CardTitle>
          <CardDescription>
            Choose the grade and section to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
                disabled={!selectedGrade}
              >
                <SelectTrigger id="section">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SECTIONS.map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={fetchStudents}
              disabled={!selectedGrade || !selectedSection || isFetching}
              className="w-full sm:w-auto text-white "
            >
              {isFetching ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Loading Students...
                </>
              ) : (
                "Load Students"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                <div className="text-2xl font-bold">{stats.present}</div>
                <div className="text-muted-foreground ml-2">
                  ({((stats.present / stats.total) * 100).toFixed(1)}%)
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
                <div className="text-2xl font-bold">{stats.absent}</div>
                <div className="text-muted-foreground ml-2">
                  ({((stats.absent / stats.total) * 100).toFixed(1)}%)
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Late</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                <div className="text-2xl font-bold">{stats.late}</div>
                <div className="text-muted-foreground ml-2">
                  ({((stats.late / stats.total) * 100).toFixed(1)}%)
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Attendance for {selectedGrade} - Section {selectedSection}
              </CardTitle>
              <CardDescription>
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTable
                students={students}
                attendanceRecords={attendanceRecords}
                updateAttendanceRecord={updateAttendanceRecord}
              />

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={saveAttendanceRecords}
                  disabled={isSaving || attendanceRecords.length === 0}
                  className="flex items-center gap-2 text-white"
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Attendance
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
