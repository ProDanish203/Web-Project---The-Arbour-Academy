import { Schema, models, model, Model } from "mongoose";
import { IStudentProgress } from "../types/type";
import mongoosePaginate from "mongoose-paginate-v2";

const StudentProgressSchema = new Schema<IStudentProgress>(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      ref: "Student",
    },
    term: {
      type: String,
      required: [true, "Term is required"],
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
    },
    subjects: [
      {
        name: {
          type: String,
          required: [true, "Subject name is required"],
        },
        grade: {
          type: String,
          required: [true, "Grade is required"],
        },
        remarks: {
          type: String,
          required: [true, "Remarks are required"],
        },
        teacherId: {
          type: String,
          required: [true, "Teacher ID is required"],
          ref: "User",
        },
      },
    ],
    overallRemarks: {
      type: String,
      required: [true, "Overall remarks are required"],
    },
    createdBy: {
      type: String,
      required: [true, "Creator ID is required"],
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

StudentProgressSchema.index(
  { studentId: 1, term: 1, academicYear: 1 },
  { unique: true }
);

StudentProgressSchema.plugin(mongoosePaginate);

export const StudentProgress =
  models.StudentProgress ||
  model<IStudentProgress>("StudentProgress", StudentProgressSchema);
