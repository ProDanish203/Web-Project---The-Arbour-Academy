import { Schema, models, model, Model } from "mongoose";
import { ITeacher } from "../types/type";
import mongoosePaginate from "mongoose-paginate-v2";

const TeacherSchema = new Schema<ITeacher>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
      unique: true as any,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    qualifications: {
      type: [String],
      required: [true, "Qualifications are required"],
    },
    subjects: {
      type: [String],
      required: [true, "Subjects are required"],
    },
    grades: {
      type: [String],
      required: [true, "Grades are required"],
    },
    sections: {
      type: [String],
      required: [true, "Sections are required"],
    },
    joiningDate: {
      type: Date,
      required: [true, "Joining date is required"],
    },
    employmentType: {
      type: String,
      required: [true, "Employment type is required"],
      enum: ["full-time", "part-time", "contract"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
    },
  },
  {
    timestamps: true,
  }
);

TeacherSchema.plugin(mongoosePaginate);

export const Teacher =
  models.Teacher || model<ITeacher>("Teacher", TeacherSchema);
