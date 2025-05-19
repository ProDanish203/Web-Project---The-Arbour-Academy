import { NextFunction, Request, Response } from "express";
import {
  generatePassword,
  getPaginatedData,
  throwError,
} from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ADMISSION_STATUS, ROLES } from "../utils/constants";
import { User } from "../models/user.model";
import { AdmissionRequest } from "../models/admission-request.model";
import { Student } from "../models/student.model";

export const submitAdmissionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { studentInfo, parentInfo, emergencyContact, address } = req.body;
    // Input Validations
    if (!studentInfo?.firstName)
      return next(throwError("Student's first name is required", 400));
    if (!studentInfo?.lastName)
      return next(throwError("Student's last name is required", 400));
    if (!studentInfo?.dateOfBirth)
      return next(throwError("Student's date of birth is required", 400));
    if (!studentInfo?.gender)
      return next(throwError("Student's gender is required", 400));
    if (!studentInfo?.grade) return next(throwError("Grade is required", 400));

    if (!parentInfo?.name)
      return next(throwError("Parent's name is required", 400));
    if (!parentInfo?.email)
      return next(throwError("Parent's email is required", 400));
    if (!parentInfo?.email.includes("@"))
      return next(throwError("Invalid email address", 400));
    if (!parentInfo?.phone)
      return next(throwError("Parent's phone number is required", 400));
    if (!parentInfo?.relation)
      return next(throwError("Relation to student is required", 400));

    if (!emergencyContact?.name)
      return next(throwError("Emergency contact name is required", 400));
    if (!emergencyContact?.relation)
      return next(throwError("Emergency contact relation is required", 400));
    if (!emergencyContact?.phone)
      return next(throwError("Emergency contact phone is required", 400));

    if (!address) return next(throwError("Address is required", 400));

    const existingApplication = await AdmissionRequest.findOne({
      "studentInfo.firstName": studentInfo.firstName,
      "studentInfo.lastName": studentInfo.lastName,
      "parentInfo.email": parentInfo.email,
      status: { $in: [ADMISSION_STATUS.PENDING, ADMISSION_STATUS.APPROVED] },
    });

    if (existingApplication) {
      return next(
        throwError("An application for this student is already submitted", 400)
      );
    }

    const admissionRequest = await AdmissionRequest.create({
      studentInfo,
      parentInfo,
      emergencyContact,
      address,
      status: ADMISSION_STATUS.PENDING,
      applicationDate: new Date(),
    });

    if (!admissionRequest)
      return next(throwError("Failed to submit admission request", 500));

    return res.status(201).json({
      success: true,
      message: "Admission request submitted successfully",
      data: admissionRequest,
    });
  } catch (err) {
    return next(err);
  }
};

export const reviewAdmissionRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user || req.user.role !== ROLES.ADMIN)
      return next(throwError("Unauthorized access", 401));

    const { status, comments, section } = req.body;
    const applicationId = req.params.id;

    if (!applicationId)
      return next(throwError("Application ID is required", 400));
    if (!status) return next(throwError("Status is required", 400));
    if (!Object.values(ADMISSION_STATUS).includes(status)) {
      return next(throwError("Invalid status", 400));
    }

    const application = await AdmissionRequest.findById(applicationId);
    if (!application) return next(throwError("Application not found", 404));

    if (application.status !== ADMISSION_STATUS.PENDING) {
      return next(
        throwError(`Application is already ${application.status}`, 400)
      );
    }

    const updatedApplication = await AdmissionRequest.findByIdAndUpdate(
      applicationId,
      {
        $set: {
          status,
          comments,
          reviewedBy: req.user._id,
          reviewDate: new Date(),
        },
      }
    );

    // Create the accounts for parent and student
    if (status === ADMISSION_STATUS.APPROVED) {
      if (!section)
        return next(
          throwError("Section is required for approved applications", 400)
        );

      const existingUser = await User.findOne({
        email: application.parentInfo.email,
      });
      let parentUser;

      if (existingUser) {
        parentUser = existingUser;
      } else {
        const tempPassword = generatePassword(
          application.parentInfo.email,
          application.parentInfo.phone
        );

        parentUser = await User.create({
          name: application.parentInfo.name,
          email: application.parentInfo.email,
          password: tempPassword,
          phone: application.parentInfo.phone,
          address: application.address,
          role: ROLES.PARENT,
          isEmailVerified: false,
        });

        if (!parentUser)
          return next(throwError("Failed to create parent account", 500));
      }

      // Generate roll number (first letter of first name + first letter of last name + random 4 digits)
      const rollPrefix = `${application.studentInfo.firstName.charAt(
        0
      )}${application.studentInfo.lastName.charAt(0)}`;
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const rollNumber = `${rollPrefix}${randomDigits}`;

      // Create student
      const student = await Student.create({
        firstName: application.studentInfo.firstName,
        lastName: application.studentInfo.lastName,
        dateOfBirth: application.studentInfo.dateOfBirth,
        gender: application.studentInfo.gender,
        address: application.address,
        admissionDate: new Date(),
        grade: application.studentInfo.grade,
        section: section,
        rollNumber: rollNumber,
        parentId: parentUser._id,
        admissionStatus: ADMISSION_STATUS.APPROVED,
        emergencyContact: application.emergencyContact,
      });

      if (!student)
        return next(throwError("Failed to create student record", 500));

      return res.status(200).json({
        success: true,
        message: "Application approved and student enrolled successfully",
        data: {
          application,
          student,
          parent: {
            ...parentUser.toObject(),
            password: undefined,
          },
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: application,
    });
  } catch (err) {
    return next(err);
  }
};

export const getAdmissionApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    const search = req.query.search || "";
    const filter: any = req.query.filter || "";
    let sortDirection = 1;

    if (filter.toLowerCase() === "ztoa") sortDirection = -1;
    const query = {
      status: ADMISSION_STATUS.PENDING,
      $or: [
        { "studentInfo.firstName": { $regex: search, $options: "i" } },
        { "studentInfo.lastName": { $regex: search, $options: "i" } },
        { "parentInfo.name": { $regex: search, $options: "i" } },
        { "parentInfo.email": { $regex: search, $options: "i" } },
      ],
    };

    const { data, pagination } = await getPaginatedData({
      model: AdmissionRequest,
      query,
      page,
      limit,
      sort: { applicationDate: sortDirection },
      populate: { path: "reviewedBy", select: "name email" },
    });

    return res.status(201).json({
      success: true,
      message: "Admission applications fetched successfully",
      data,
      pagination,
    });
  } catch (err) {
    return next(err);
  }
};
