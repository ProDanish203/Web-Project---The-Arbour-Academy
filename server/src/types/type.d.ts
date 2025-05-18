import { Document, PaginateModel } from "mongoose";
import {
  ROLES,
  ADMISSION_STATUS,
  ATTENDANCE_STATUS,
  FEE_STATUS,
} from "../utils/constants";

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type AdmissionStatus =
  (typeof ADMISSION_STATUS)[keyof typeof ADMISSION_STATUS];
export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];
export type FeeStatus = (typeof FEE_STATUS)[keyof typeof FEE_STATUS];

export interface IUser extends Document {
  email: string;
  password: string;
  phone?: string;
  address?: string;
  name: string;
  role: Role;
  avatar?: string;
  hasNotifications: boolean;
  isEmailVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
}

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  admissionDate: Date;
  grade: string;
  section: string;
  rollNumber: string;
  parentId: string;
  admissionStatus: AdmissionStatus;
  feeStatus: FeeStatus;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  avatar?: string;
}

export interface IAdmissionRequest extends Document {
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
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  address: string;
  status: AdmissionStatus;
  applicationDate: Date;
  comments?: string;
  reviewedBy?: string;
  reviewDate?: Date;
}

export interface IStaff extends Document {
  userId: string;
  designation: string;
  department: string;
  qualifications: string[];
  joiningDate: Date;
  employmentType: string; // Full-time, Part-time, Contract
  salary: number;
}

export interface ITeacher extends Document {
  userId: string;
  designation: string;
  qualifications: string[];
  subjects: string[];
  grades: string[];
  sections: string[];
  joiningDate: Date;
  employmentType: string; // Full-time, Part-time, Contract
  salary: number;
}

export interface IAttendance extends Document {
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  markedBy: string;
  remarks?: string;
}

export interface IStudentProgress extends Document {
  studentId: string;
  term: string;
  academicYear: string;
  subjects: {
    name: string;
    grade: string;
    remarks: string;
    teacherId: string;
  }[];
  overallRemarks: string;
  createdBy: string;
  createdAt: Date;
}
