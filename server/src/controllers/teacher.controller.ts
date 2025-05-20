import { NextFunction, Response } from "express";
import { User } from "../models/user.model";
import { Teacher } from "../models/teacher.model";
import {
  generatePassword,
  getPaginatedData,
  throwError,
} from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";

export const addTeacher = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));
    const {
      name,
      email,
      phone,
      address,
      designation,
      qualifications,
      subjects,
      grades,
      sections,
      joiningDate,
      employmentType,
      salary,
    } = req.body;

    // Input validations
    if (!name) return next(throwError("Name is required", 400));
    if (!email) return next(throwError("Email is required", 400));
    if (!email.includes("@"))
      return next(throwError("Invalid email address", 400));
    if (!designation) return next(throwError("Designation is required", 400));
    if (!qualifications || !qualifications.length)
      return next(throwError("Qualifications are required", 400));
    if (!subjects || !subjects.length)
      return next(throwError("Subjects are required", 400));
    if (!grades || !grades.length)
      return next(throwError("Grades are required", 400));
    if (!sections || !sections.length)
      return next(throwError("Sections are required", 400));
    if (!joiningDate) return next(throwError("Joining date is required", 400));
    if (!employmentType)
      return next(throwError("Employment type is required", 400));
    if (!["full-time", "part-time", "contract"].includes(employmentType)) {
      return next(throwError("Invalid employment type", 400));
    }
    if (!salary || isNaN(Number(salary)))
      return next(throwError("Valid salary is required", 400));

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(throwError("Email already in use", 400));

    const password = generatePassword(email, phone || "");

    // Create user with teacher role
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || "",
      address: address || "",
      role: ROLES.TEACHER,
      isEmailVerified: false,
    });

    if (!user) return next(throwError("Failed to create teacher account", 500));

    const teacher = await Teacher.create({
      userId: user._id,
      designation,
      qualifications,
      subjects,
      grades,
      sections,
      joiningDate: new Date(joiningDate),
      employmentType,
      salary: Number(salary),
    });

    if (!teacher) {
      await User.findByIdAndDelete(user._id);
      return next(throwError("Failed to create teacher profile", 500));
    }

    return res.status(201).json({
      success: true,
      message: "Teacher added successfully",
      data: {
        user: {
          ...user.toObject(),
          password: undefined,
        },
        teacher,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const updateTeacherInformation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const { userData, teacherData } = req.body;

    const teacherId = req.params.id;
    if (!teacherId) return next(throwError("Teacher ID is required", 400));

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return next(throwError("Teacher not found", 404));

    const user = (await User.findById(teacher.userId)) as unknown as any;
    if (!user) return next(throwError("User not found", 404));

    if (userData) {
      if (userData.email && userData.email !== user.email) {
        if (!userData.email.includes("@"))
          return next(throwError("Invalid email address", 400));

        const existingUser = await User.findOne({
          email: userData.email,
          _id: { $ne: user._id },
        });
        if (existingUser) return next(throwError("Email already in use", 400));
      }
      const allowedUserFields = ["name", "email", "phone", "address", "avatar"];
      for (const field of allowedUserFields) {
        if (userData[field] !== undefined) {
          user[field] = userData[field];
        }
      }

      await user.save();
    }

    if (teacherData) {
      if (
        teacherData.employmentType &&
        !["full-time", "part-time", "contract"].includes(
          teacherData.employmentType
        )
      )
        return next(throwError("Invalid employment type", 400));

      if (teacherData.salary !== undefined && isNaN(Number(teacherData.salary)))
        return next(throwError("Valid salary is required", 400));

      const allowedTeacherFields = [
        "designation",
        "qualifications",
        "subjects",
        "grades",
        "sections",
        "joiningDate",
        "employmentType",
        "salary",
      ];

      for (const field of allowedTeacherFields) {
        if (teacherData[field] !== undefined) {
          if (field === "salary") {
            teacher[field] = Number(teacherData[field]);
          } else if (field === "joiningDate") {
            teacher[field] = new Date(teacherData[field]);
          } else {
            teacher[field] = teacherData[field];
          }
        }
      }

      await teacher.save();
    }

    return res.status(200).json({
      success: true,
      message: "Teacher information updated successfully",
      data: {
        user: {
          ...user.toObject(),
          password: undefined,
        },
        teacher,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const removeTeacher = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));
    const teacherId = req.params.id;
    if (!teacherId) return next(throwError("Teacher ID is required", 400));

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return next(throwError("Teacher not found", 404));

    // Delete teacher profile
    await Promise.all([
      Teacher.findByIdAndDelete(teacherId),
      User.findByIdAndDelete(teacher.userId),
    ]);

    return res.status(200).json({
      success: true,
      message: "Teacher removed successfully",
      data: {},
    });
  } catch (err) {
    return next(err);
  }
};

export const getAllTeachers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const search = (req.query.search as string) || "";
    const sortField = (req.query.sortField as string) || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const { data: teachers, pagination } = await getPaginatedData({
      model: Teacher,
      query: {},
      page,
      limit,
      sort: { [sortField]: sortOrder },
      populate: { path: "userId", select: "name email phone avatar" },
    });

    let filteredTeachers = teachers;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTeachers = teachers.filter((teacher: any) => {
        const userData = teacher.userId;
        if (!userData) return false;

        return (
          userData.name?.toLowerCase().includes(searchLower) ||
          userData.email?.toLowerCase().includes(searchLower) ||
          teacher.designation?.toLowerCase().includes(searchLower) ||
          teacher.subjects?.some((subj: string) =>
            subj.toLowerCase().includes(searchLower)
          ) ||
          teacher.grades?.some((grade: string) =>
            grade.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: filteredTeachers,
      pagination: search
        ? { ...pagination, totalItems: filteredTeachers.length }
        : pagination,
    });
  } catch (err) {
    return next(err);
  }
};

export const getTeacherDashboardData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));
    if (req.user.role !== ROLES.TEACHER)
      return next(throwError("Unauthorized Access", 401));

    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return next(throwError("Teacher not found", 404));

    const user = (await User.findById(teacher.userId)) as unknown as any;
    if (!user) return next(throwError("User not found", 404));

    return res.status(200).json({
      success: true,
      message: "Teacher dashboard data fetched successfully",
      data: {
        user: {
          ...user.toObject(),
          password: undefined,
        },
        teacher,
      },
    });
  } catch (err) {
    return next(err);
  }
};
