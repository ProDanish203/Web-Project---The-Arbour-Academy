import { NextFunction, Response } from "express";
import { Student } from "../models/student.model";
import { Teacher } from "../models/teacher.model";
import { Attendance } from "../models/attendance.model";
import { throwError, getPaginatedData } from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ATTENDANCE_STATUS, ROLES } from "../utils/constants";

export const markAttendance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const { attendanceRecords, section, grade } = req.body;

    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return next(
        throwError("Attendance records are required and must be an array", 400)
      );
    }

    if (!section) return next(throwError("Section is required", 400));
    if (!grade) return next(throwError("Grade is required", 400));

    const teacherId = req.user._id;
    const teacher = await Teacher.findOne({ userId: teacherId });

    if (!teacher) return next(throwError("Teacher profile not found", 404));

    if (
      !teacher.sections.includes(section) ||
      !teacher.grades.includes(grade)
    ) {
      return next(
        throwError(
          "You are not authorized to mark attendance for this section/grade",
          403
        )
      );
    }

    const sectionStudents = await Student.find({ section, grade });

    if (sectionStudents.length === 0)
      return next(throwError("No students found in this section", 404));

    // Validate attendance records
    const studentIds = sectionStudents.map((student) => student._id.toString());

    for (const record of attendanceRecords) {
      if (!record.studentId) {
        return next(
          throwError("Student ID is required for each attendance record", 400)
        );
      }

      if (!studentIds.includes(record.studentId)) {
        return next(
          throwError(
            `Student ${record.studentId} not found in this section`,
            400
          )
        );
      }

      if (
        !record.status ||
        !Object.values(ATTENDANCE_STATUS).includes(record.status)
      ) {
        return next(
          throwError(
            `Invalid attendance status for student ${record.studentId}`,
            400
          )
        );
      }
    }

    const attendanceDate = new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.find({
      studentId: { $in: studentIds },
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    const results = [];
    const operations = [];

    for (const record of attendanceRecords) {
      // Check if this record already exists
      const existing = existingAttendance.find(
        (a) => a.studentId.toString() === record.studentId
      );

      if (existing) {
        // Update existing record
        operations.push({
          updateOne: {
            filter: { _id: existing._id },
            update: {
              status: record.status,
              remarks: record.remarks,
              markedBy: teacherId,
            },
          },
        });
      } else {
        // Create new record
        operations.push({
          insertOne: {
            document: {
              studentId: record.studentId,
              date: attendanceDate,
              status: record.status,
              remarks: record.remarks || "",
              markedBy: teacherId,
            },
          },
        });
      }
    }

    if (operations.length > 0) {
      const result = await Attendance.bulkWrite(operations);

      const updatedAttendance = await Attendance.find({
        studentId: { $in: studentIds },
        date: {
          $gte: attendanceDate,
          $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
        },
      }).populate("studentId", "firstName lastName rollNumber");

      return res.status(200).json({
        success: true,
        message: "Attendance marked successfully",
        data: {
          records: updatedAttendance,
          stats: {
            inserted: result.insertedCount || 0,
            updated: result.modifiedCount || 0,
            total: updatedAttendance.length,
          },
          date: attendanceDate,
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: "No attendance records were processed",
      data: null,
    });
  } catch (err) {
    return next(err);
  }
};

export const getAttendaceBySection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const { section, grade, startDate, endDate } = req.query;

    if (!section) return next(throwError("Section is required", 400));
    if (!grade) return next(throwError("Grade is required", 400));

    let dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter = {};

      if (startDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0);
        dateFilter.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
    } else {
      // Default to today if no dates provided
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    const students = await Student.find({
      section: section as string,
      grade: grade as string,
    });

    if (students.length === 0)
      return next(throwError("No students found in this section", 404));

    const studentIds = students.map((student) => student._id);

    const attendanceRecords = await Attendance.find({
      studentId: { $in: studentIds },
      date: dateFilter,
    })
      .populate("studentId", "firstName lastName rollNumber")
      .populate("markedBy", "name");

    // Organize attendance by date
    const attendanceByDate: any = {};
    attendanceRecords.forEach((record) => {
      const dateKey = record.date.toISOString().split("T")[0];

      if (!attendanceByDate[dateKey]) {
        attendanceByDate[dateKey] = [];
      }

      attendanceByDate[dateKey].push(record);
    });

    const stats: any = {
      total: students.length,
      dates: Object.keys(attendanceByDate).length,
      statusCounts: {},
    };

    Object.values(ATTENDANCE_STATUS).forEach((status) => {
      stats.statusCounts[status] = 0;
    });

    attendanceRecords.forEach((record) => {
      stats.statusCounts[record.status]++;
    });

    return res.status(200).json({
      success: true,
      message: "Attendance records fetched successfully",
      data: {
        attendanceByDate,
        students,
        stats,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const getAttendanceForStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (req.user.role === ROLES.PARENT) {
      const parentStudents = await Student.find({ parentId: req.user._id });
      const parentStudentIds = parentStudents.map((s) => s._id.toString());

      if (!parentStudentIds.includes(id)) {
        return next(
          throwError(
            "You are not authorized to view this student's attendance",
            403
          )
        );
      }
    }

    const student = await Student.findById(id);
    if (!student) return next(throwError("Student not found", 404));

    let dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter = {};

      if (startDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0);
        dateFilter.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
    } else {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      dateFilter = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    }

    const attendance = await Attendance.find({
      studentId: id,
      date: dateFilter,
    })
      .sort({ date: 1 })
      .populate("markedBy", "name");

    const stats: any = {
      total: attendance.length,
      statusCounts: {},
    };

    Object.values(ATTENDANCE_STATUS).forEach((status) => {
      stats.statusCounts[status] = 0;
    });

    attendance.forEach((record) => {
      stats.statusCounts[record.status]++;
    });

    return res.status(200).json({
      success: true,
      message: "Student attendance fetched successfully",
      data: {
        student,
        attendance,
        stats,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const getAttendanceForTeacher = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const { id } = req.params;
    const { date, startDate, endDate, section, grade } = req.query;

    if (req.user.role === ROLES.TEACHER && req.user._id !== id) {
      return next(
        throwError("You can only view attendance records you've marked", 403)
      );
    }

    const teacher = await Teacher.findOne({ userId: id });
    if (!teacher) return next(throwError("Teacher not found", 404));

    const query: any = { markedBy: id };

    if (date) {
      const specificDate = new Date(date as string);
      specificDate.setHours(0, 0, 0, 0);
      query.date = {
        $gte: specificDate,
        $lt: new Date(specificDate.getTime() + 24 * 60 * 60 * 1000),
      };
    } else if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    if (section && grade) {
      const sectionStudents = await Student.find({
        section: section as string,
        grade: grade as string,
      });

      if (sectionStudents.length > 0) {
        const studentIds = sectionStudents.map((student) => student._id);
        query.studentId = { $in: studentIds };
      }
    }

    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 50);

    const { data: attendanceRecords, pagination } = await getPaginatedData({
      model: Attendance,
      query,
      page,
      limit,
      sort: { date: -1 },
      populate: [
        {
          path: "studentId",
          select: "firstName lastName rollNumber grade section",
        },
      ],
    });

    // Group by date and section
    const groupedAttendance: any = {};
    attendanceRecords.forEach((record: any) => {
      const dateKey = new Date(record.date).toISOString().split("T")[0];

      if (!groupedAttendance[dateKey]) {
        groupedAttendance[dateKey] = {};
      }

      const studentSection = record.studentId?.section;
      const studentGrade = record.studentId?.grade;

      if (studentSection && studentGrade) {
        const sectionKey = `${studentGrade}-${studentSection}`;

        if (!groupedAttendance[dateKey][sectionKey]) {
          groupedAttendance[dateKey][sectionKey] = [];
        }

        groupedAttendance[dateKey][sectionKey].push(record);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Teacher attendance records fetched successfully",
      data: {
        teacher,
        attendance: groupedAttendance,
        pagination,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const getTodayAttendanceStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    if (req.user.role !== ROLES.TEACHER)
      return next(throwError("Unauthorized access", 403));

    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return next(throwError("Teacher profile not found", 404));

    const sections = teacher.sections;
    const grades = teacher.grades;

    if (!sections.length || !grades.length) {
      return res.status(200).json({
        success: true,
        message: "No sections assigned to this teacher",
        data: { sections: [] },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const results = [];

    for (const grade of grades) {
      for (const section of sections) {
        const students = await Student.find({ section, grade });
        if (students.length === 0) continue;
        const studentIds = students.map((s) => s._id);

        // Check if attendance is marked for these students today
        const attendanceCount = await Attendance.countDocuments({
          studentId: { $in: studentIds },
          date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        });

        results.push({
          grade,
          section,
          totalStudents: students.length,
          attendanceMarked: attendanceCount,
          isComplete: attendanceCount === students.length,
          progress:
            students.length > 0
              ? Math.round((attendanceCount / students.length) * 100)
              : 0,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Today's attendance status fetched successfully",
      data: { sections: results },
    });
  } catch (err) {
    return next(err);
  }
};

export const getAttendanceForAllChildren = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    if (req.user.role !== ROLES.PARENT)
      return next(throwError("Only parents can access this endpoint", 403));

    const parentId = req.user._id;
    const { startDate, endDate } = req.query;

    const children = await Student.find({ parentId });

    if (children.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No children found for this parent",
        data: {
          children: [],
          attendanceData: [],
        },
      });
    }

    let dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter = {};

      if (startDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0);
        dateFilter.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
    } else {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      dateFilter = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    }

    const childrenIds = children.map((child) => child._id);

    const attendanceRecords = await Attendance.find({
      studentId: { $in: childrenIds },
      date: dateFilter,
    })
      .sort({ date: 1 })
      .populate("markedBy", "name");

    // Process the data to organize by child
    const attendanceData = [];

    for (const child of children) {
      // Filter attendance records for this child
      const childAttendance = attendanceRecords.filter(
        (record) => record.studentId.toString() === child._id.toString()
      );

      // Calculate statistics for this child
      const stats: any = {
        total: childAttendance.length,
        statusCounts: {},
      };

      // Initialize counts for each status type
      Object.values(ATTENDANCE_STATUS).forEach((status) => {
        stats.statusCounts[status] = 0;
      });

      // Count occurrences of each status
      childAttendance.forEach((record) => {
        stats.statusCounts[record.status]++;
      });

      // Add child's data to the response
      attendanceData.push({
        student: child,
        attendance: childAttendance,
        stats,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Children's attendance fetched successfully",
      data: {
        children,
        attendanceData,
      },
    });
  } catch (err) {
    return next(err);
  }
};
