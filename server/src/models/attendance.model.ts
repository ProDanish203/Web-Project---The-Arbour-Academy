import { Schema, models, model, Model } from "mongoose";
import { IAttendance } from "../types/type";
import { ATTENDANCE_STATUS } from "../utils/constants";
import mongoosePaginate from "mongoose-paginate-v2";

const AttendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      ref: "Student",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      required: [true, "Attendance status is required"],
    },
    markedBy: {
      type: String,
      required: [true, "Teacher ID is required"],
      ref: "User",
    },
    remarks: String,
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

AttendanceSchema.plugin(mongoosePaginate);

export const Attendance =
  models.Attendance || model<IAttendance>("Attendance", AttendanceSchema);
