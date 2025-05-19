import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import {
  User,
  Calendar,
  GraduationCap,
  Home,
  Phone,
  Mail,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { Student } from "@/types/types";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 text-green-700 border-green-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";
      case "PAID":
        return "bg-green-50 text-green-700 border-green-200";
      case "UNPAID":
        return "bg-red-50 text-red-700 border-red-200";
      case "PARTIAL":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-md">
            <AvatarImage
              src={student.avatar || ""}
              alt={`${student.firstName} ${student.lastName}`}
            />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {getInitials(student.firstName, student.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-bold">
              {student.firstName} {student.lastName}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {student.grade}
              </Badge>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200"
              >
                Section {student.section}
              </Badge>
              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-700 border-gray-200"
              >
                Roll No: {student.rollNumber}
              </Badge>
              <Badge
                variant="outline"
                className={getStatusColor(student.feeStatus || "")}
              >
                Fees: {student.feeStatus}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-3 rounded-none">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Full Name</p>
                  <p className="text-muted-foreground">
                    {student.firstName} {student.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Date of Birth</p>
                  <p className="text-muted-foreground">
                    {formatDate(student.dateOfBirth || new Date())}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Gender</p>
                  <p className="text-muted-foreground capitalize">
                    {student.gender}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Admission Date</p>
                  <p className="text-muted-foreground">
                    {formatDate(student.admissionDate || new Date())}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 md:col-span-2">
                <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">{student.address}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="academic" className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Grade</p>
                  <p className="text-muted-foreground">{student.grade}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Section</p>
                  <p className="text-muted-foreground">
                    Section {student.section}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Roll Number</p>
                  <p className="text-muted-foreground">{student.rollNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Admission Status</p>
                  <Badge
                    variant="outline"
                    className={getStatusColor(student.admissionStatus || "")}
                  >
                    {student.admissionStatus}
                  </Badge>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Fee Status</p>
                  <Badge
                    variant="outline"
                    className={getStatusColor(student.feeStatus || "")}
                  >
                    {student.feeStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="emergency" className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Emergency Contact</p>
                  <p className="text-muted-foreground">
                    {student.emergencyContact?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Relation</p>
                  <p className="text-muted-foreground">
                    {student.emergencyContact?.relation}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">
                    {student.emergencyContact?.phone}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <p className="font-medium">Parent Information</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Name</p>
                    <p className="text-muted-foreground">
                      {student.parentId.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      {student.parentId.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">
                      {student.parentId.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:col-span-2">
                  <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      {student.parentId.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
