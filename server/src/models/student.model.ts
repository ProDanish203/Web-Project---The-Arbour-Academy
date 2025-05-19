import { Schema, models, model, Model } from "mongoose";
import { IStudent } from "../types/type";
import { ADMISSION_STATUS, FEE_STATUS } from "../utils/constants";
import mongoosePaginate from "mongoose-paginate-v2";

const StudentSchema = new Schema<IStudent>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    admissionDate: {
      type: Date,
      required: [true, "Admission date is required"],
      default: Date.now,
    },
    grade: {
      type: String,
      required: [true, "Grade is required"],
    },
    section: {
      type: String,
      required: [true, "Section is required"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true as any,
    },
    parentId: {
      type: String,
      required: [true, "Parent ID is required"],
      ref: "User",
    },
    admissionStatus: {
      type: String,
      enum: Object.values(ADMISSION_STATUS),
      default: ADMISSION_STATUS.APPROVED,
    },
    feeStatus: {
      type: String,
      enum: Object.values(FEE_STATUS),
      default: FEE_STATUS.UNPAID,
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, "Emergency contact name is required"],
      },
      relation: {
        type: String,
        required: [true, "Relation is required"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
    },
    avatar: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

StudentSchema.plugin(mongoosePaginate);

export const Student =
  models.Student || model<IStudent>("Student", StudentSchema);
