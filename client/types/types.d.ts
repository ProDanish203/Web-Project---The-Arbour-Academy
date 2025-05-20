export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface IPagination {
  totalItems: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  name: string;
  role: "USER" | "ADMIN" | "TEACHER" | "PARENT" | "STUDENT";
  avatar?: string;
  hasNotifications: boolean;
  isEmailVerified: boolean;
}

export interface AdmissionRequest {
  _id: string;
  studentInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    grade: string;
  };
  parentInfo: {
    name: string;
    email: string;
    phone: string;
    relation: string;
  };
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  status: string;
  applicationDate: Date;
  comments?: string;
  reviewedBy?: string;
  reviewDate?: Date;
}

export interface Teacher {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  designation: string;
  qualifications: string[];
  subjects: string[];
  grades: string[];
  sections: string[];
  joiningDate: Date;
  employmentType: string;
  salary: number;
}

export interface AttendanceRecord {
  studentId: string;
  status: string;
  remarks?: string;
  date?: Date;
  markedBy?: string;
}

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  admissionDate: string;
  grade: string;
  section: string;
  rollNumber: string;
  parentId: string;
  admissionStatus: string;
  feeStatus: string;
  avatar: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  _id: string;
  studentId: string;
  date: string;
  status: string;
  markedBy: {
    _id: string;
    name: string;
  };
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusCounts {
  PRESENT: number;
  ABSENT: number;
  LATE: number;
  HALF_DAY: number;
  LEAVE: number;
}

export interface AttendanceStats {
  total: number;
  statusCounts: StatusCounts;
}

export interface StudentAttendanceData {
  student: Student;
  attendance: AttendanceRecord[];
  stats: AttendanceStats;
}

export interface ParentAttendanceData {
  children: Student[];
  attendanceData: StudentAttendanceData[];
}

export interface Teacher {
  _id: string;
  userId: string;
  designation: string;
  qualifications: string[];
  subjects: string[];
  grades: string[];
  sections: string[];
  joiningDate: string;
  employmentType: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherData {
  user: User;
  teacher: Teacher;
}

export interface ClassSchedule {
  id: string;
  subject: string;
  grade: string;
  section: string;
  startTime: string;
  endTime: string;
  room: string;
  day: string;
  color: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  attendance: number;
  performance: number;
}

export interface Assignment {
  id: string;
  title: string;
  grade: string;
  section: string;
  subject: string;
  dueDate: string;
  status: "pending" | "graded" | "overdue";
  submissionsCount: number;
  totalStudents: number;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  isNew: boolean;
}
