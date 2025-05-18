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
  role: "user" | "admin";
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
