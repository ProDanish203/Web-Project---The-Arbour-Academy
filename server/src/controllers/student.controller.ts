import { NextFunction, Response } from "express";
import { User } from "../models/user.model";
import { Student } from "../models/student.model";
import { getPaginatedData, throwError } from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ADMISSION_STATUS, FEE_STATUS, ROLES } from "../utils/constants";
import { Teacher } from "../models/teacher.model";

export const getAllStudents = async (
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

    let query: any = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    const { data: students, pagination } = await getPaginatedData({
      model: Student,
      query,
      page,
      limit,
      sort: { [sortField]: sortOrder },
      populate: { path: "parentId", select: "name email phone" },
    });

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
      pagination,
    });
  } catch (err) {
    return next(err);
  }
};

export const getStudentsByGradeAndSection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));
    const { grade, section } = req.query;

    if (req.user.role === ROLES.TEACHER) {
      const teacher = await Teacher.findOne({ userId: req.user._id });
      if (!teacher) return next(throwError("Teacher not found", 404));
      if (!teacher.grades.includes(grade as string))
        return next(throwError("You are not assigned to this grade", 403));
      if (!teacher.sections.includes(section as string))
        return next(throwError("You are not assigned to this section", 403));
    }

    if (!grade || !section)
      return next(throwError("Grade and section are required", 400));

    const students = await Student.find({
      grade,
      section,
    }).populate("parentId", "name email phone");
    if (!students || students.length === 0)
      return next(throwError("No students found", 404));

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (err) {
    return next(err);
  }
};

export const updateStudentInformation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const { id } = req.params;
    const updateData = req.body;

    if (!id) return next(throwError("Student ID is required", 400));

    const student = await Student.findById(id);
    if (!student) return next(throwError("Student not found", 404));

    if (updateData.rollNumber && updateData.rollNumber !== student.rollNumber) {
      const existingStudent = await Student.findOne({
        rollNumber: updateData.rollNumber,
        _id: { $ne: id },
      });

      if (existingStudent)
        return next(throwError("Roll number already in use", 400));
    }

    if (
      updateData.gender &&
      !["male", "female", "other"].includes(updateData.gender)
    )
      return next(throwError("Invalid gender", 400));

    if (
      updateData.admissionStatus &&
      !Object.values(ADMISSION_STATUS).includes(updateData.admissionStatus)
    ) {
      return next(throwError("Invalid admission status", 400));
    }

    if (
      updateData.feeStatus &&
      !Object.values(FEE_STATUS).includes(updateData.feeStatus)
    ) {
      return next(throwError("Invalid fee status", 400));
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "address",
      "grade",
      "section",
      "rollNumber",
      "admissionStatus",
      "feeStatus",
      "emergencyContact",
      "avatar",
    ];

    const updateObj: any = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateObj[field] = updateData[field];
      }
    }

    if (updateData.dateOfBirth)
      updateObj.dateOfBirth = new Date(updateData.dateOfBirth);

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).populate("parentId", "name email phone");

    if (!updatedStudent)
      return next(throwError("Failed to update student information", 500));

    return res.status(200).json({
      success: true,
      message: "Student information updated successfully",
      data: updatedStudent,
    });
  } catch (err) {
    return next(err);
  }
};

export const removeStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const { id } = req.params;
    if (!id) return next(throwError("Student ID is required", 400));

    const student = await Student.findById(id);
    if (!student) return next(throwError("Student not found", 404));

    const otherStudents = await Student.countDocuments({
      parentId: student.parentId,
      _id: { $ne: id },
    });

    await Student.findByIdAndDelete(id);

    // Delete the parent if there are no other students linked to it
    if (otherStudents === 0) await User.findByIdAndDelete(student.parentId);

    return res.status(200).json({
      success: true,
      message: "Student removed successfully",
      data: {
        isLastStudent: otherStudents === 0,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const getStudentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const { id } = req.params;
    if (!id) return next(throwError("Student ID is required", 400));

    const student = await Student.findById(id).populate(
      "parentId",
      "name email phone address"
    );

    if (!student) return next(throwError("Student not found", 404));

    return res.status(200).json({
      success: true,
      message: "Student details fetched successfully",
      data: student,
    });
  } catch (err) {
    return next(err);
  }
};

export const getStudentsByParentId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));
    if (req.user.role !== ROLES.PARENT)
      return next(throwError("Unauthorized Access", 403));

    const parentId = req.user._id;

    const students = await Student.find({ parentId: parentId }).populate(
      "parentId",
      "name email phone address"
    );

    if (!students || students.length === 0)
      return next(throwError("No students found for this parent", 404));

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (err) {
    return next(err);
  }
};
