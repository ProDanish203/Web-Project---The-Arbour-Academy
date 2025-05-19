"use client";
import { useState, useEffect } from "react";
import { StudentCard } from "./student-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import type { Student } from "@/types/types";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getStudentsbyParentId } from "@/API/students.api";

export function ChildrenDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: ["my-children"],
    queryFn: () => getStudentsbyParentId(),
  });

  useEffect(() => {
    if (!isLoading && data) {
      if (data.success) setStudents(data.response);
      else toast.error(data.response);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Children Found</CardTitle>
          <CardDescription>
            There are no children associated with your account. If you believe
            this is an error, please contact the school administration.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Children
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {students.map((student) => (
          <StudentCard key={student._id} student={student} />
        ))}
      </div>
    </div>
  );
}
