"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Briefcase,
  CalendarDays,
} from "lucide-react";
import type {
  TeacherData,
  ClassSchedule,
  Assignment,
  Announcement,
} from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { getTeacherDashboardData } from "@/API/teachers.api";
import Link from "next/link";

const MOCK_CLASS_SCHEDULE: ClassSchedule[] = [
  {
    id: "1",
    subject: "English",
    grade: "Play-Group",
    section: "B",
    startTime: "09:00",
    endTime: "10:00",
    room: "Room 101",
    day: "Monday",
    color: "bg-green-500",
  },
  {
    id: "2",
    subject: "Arts",
    grade: "Play-Group",
    section: "A",
    startTime: "10:30",
    endTime: "11:30",
    room: "Room 102",
    day: "Monday",
    color: "bg-blue-500",
  },
  {
    id: "3",
    subject: "General Knowledge",
    grade: "Nursery",
    section: "A",
    startTime: "12:00",
    endTime: "13:00",
    room: "Room 103",
    day: "Monday",
    color: "bg-yellow-500",
  },
  {
    id: "4",
    subject: "English",
    grade: "Nursery",
    section: "B",
    startTime: "14:00",
    endTime: "15:00",
    room: "Room 104",
    day: "Monday",
    color: "bg-purple-500",
  },
];

// const MOCK_STUDENTS: Student[] = [
//   {
//     id: "1",
//     name: "Ahmed Khan",
//     grade: "Play-Group",
//     section: "B",
//     rollNumber: "PG-B-001",
//     attendance: 95,
//     performance: 88,
//   },
//   {
//     id: "2",
//     name: "Fatima Ali",
//     grade: "Play-Group",
//     section: "B",
//     rollNumber: "PG-B-002",
//     attendance: 98,
//     performance: 92,
//   },
//   {
//     id: "3",
//     name: "Zainab Malik",
//     grade: "Play-Group",
//     section: "A",
//     rollNumber: "PG-A-001",
//     attendance: 90,
//     performance: 85,
//   },
//   {
//     id: "4",
//     name: "Hassan Ahmed",
//     grade: "Nursery",
//     section: "A",
//     rollNumber: "N-A-001",
//     attendance: 92,
//     performance: 90,
//   },
//   {
//     id: "5",
//     name: "Ayesha Tariq",
//     grade: "Nursery",
//     section: "B",
//     rollNumber: "N-B-001",
//     attendance: 88,
//     performance: 82,
//   },
// ];

// Mock assignments data
const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    title: "Alphabet Recognition",
    grade: "Play-Group",
    section: "B",
    subject: "English",
    dueDate: "2025-05-25",
    status: "pending",
    submissionsCount: 15,
    totalStudents: 20,
  },
  {
    id: "2",
    title: "Color Identification",
    grade: "Play-Group",
    section: "A",
    subject: "Arts",
    dueDate: "2025-05-26",
    status: "pending",
    submissionsCount: 18,
    totalStudents: 22,
  },
  {
    id: "3",
    title: "Number Counting",
    grade: "Nursery",
    section: "A",
    subject: "General Knowledge",
    dueDate: "2025-05-24",
    status: "pending",
    submissionsCount: 12,
    totalStudents: 18,
  },
  {
    id: "4",
    title: "Animal Names",
    grade: "Nursery",
    section: "B",
    subject: "English",
    dueDate: "2025-05-23",
    status: "graded",
    submissionsCount: 19,
    totalStudents: 19,
  },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Parent-Teacher Meeting",
    date: "2025-05-30",
    content:
      "Parent-teacher meeting scheduled for all classes. Please prepare student progress reports.",
    isNew: true,
  },
  {
    id: "2",
    title: "Annual Day Preparation",
    date: "2025-06-10",
    content:
      "Annual day preparations to begin next week. Please select students for various performances.",
    isNew: true,
  },
  {
    id: "3",
    title: "Curriculum Update",
    date: "2025-05-22",
    content:
      "New curriculum guidelines have been uploaded to the teacher portal. Please review.",
    isNew: false,
  },
];

export default function TeacherDashboardPage() {
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["teacher-dashboard"],
    queryFn: () => getTeacherDashboardData(),
  });

  useEffect(() => {
    if (data && data.success) {
      setTeacherData(data.response);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No teacher data available</p>
      </div>
    );
  }

  const { user, teacher } = teacherData;

  const totalStudents = 50;
  const totalClasses = teacherData.teacher.grades.length;
  const todayClasses = MOCK_CLASS_SCHEDULE;

  const pendingAssignments = MOCK_ASSIGNMENTS.filter(
    (assignment) => assignment.status === "pending"
  );

  const formattedJoiningDate = format(
    parseISO(teacher.joiningDate as any),
    "MMMM d, yyyy"
  );

  const joiningYear = parseISO(teacher.joiningDate as any).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - joiningYear;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {teacher.designation}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {teacher.employmentType}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/teacher/attendance">
            <Button size="sm" className="text-white">
              Take Attendance
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              {teacher.subjects.filter(Boolean).join(", ")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Grades: {teacher.grades.join(", ")} | Sections:{" "}
              {teacher.sections.join(", ")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Classes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Starting at{" "}
              {todayClasses.length > 0 ? todayClasses[0].startTime : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Assignments
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingAssignments.length}
            </div>
            <p className="text-xs text-muted-foreground">To be graded</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <CardDescription>
              Your classes for {format(new Date(), "EEEE, MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${classItem.color} mr-2`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {classItem.subject} - {classItem.grade}{" "}
                      {classItem.section}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {classItem.room}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {classItem.startTime} - {classItem.endTime}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Full Schedule
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
            <CardDescription>Your professional details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Designation</p>
                  <p className="text-sm text-muted-foreground">
                    {teacher.designation}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Qualifications</p>
                  <p className="text-sm text-muted-foreground">
                    {teacher.qualifications.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Subjects</p>
                  <p className="text-sm text-muted-foreground">
                    {teacher.subjects.filter(Boolean).join(", ") ||
                      "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-sm text-muted-foreground">
                    {yearsOfExperience} years (Joined: {formattedJoiningDate})
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Assignments</CardTitle>
              <CardDescription>
                Assignments that need your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {assignment.grade} {assignment.section} |{" "}
                        {assignment.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">
                        Due:{" "}
                        {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assignment.submissionsCount}/{assignment.totalStudents}{" "}
                        submissions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Assignments
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Announcements</CardTitle>
              <CardDescription>Latest updates from the school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_ANNOUNCEMENTS.map((announcement) => (
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
                        {format(new Date(announcement.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {announcement.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Announcements
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
