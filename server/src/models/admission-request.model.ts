import { Schema, models, model, Model } from "mongoose";
import { IAdmissionRequest } from "../types/type";
import { ADMISSION_STATUS } from "../utils/constants";
import mongoosePaginate from "mongoose-paginate-v2";

const AdmissionRequestSchema = new Schema<IAdmissionRequest>(
  {
    studentInfo: {
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
      grade: {
        type: String,
        required: [true, "Grade is required"],
      },
    },
    parentInfo: {
      name: {
        type: String,
        required: [true, "Parent name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
      relation: {
        type: String,
        required: [true, "Relation is required"],
      },
    },
    address: {
      type: String,
      required: [true, "Address is required"],
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
    status: {
      type: String,
      enum: Object.values(ADMISSION_STATUS),
      default: ADMISSION_STATUS.PENDING,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    comments: String,
    reviewedBy: {
      type: String,
      ref: "User",
    },
    reviewDate: Date,
  },
  {
    timestamps: true,
  }
);

AdmissionRequestSchema.plugin(mongoosePaginate);

export const AdmissionRequest =
  models.AdmissionRequest ||
  model<IAdmissionRequest>("AdmissionRequest", AdmissionRequestSchema);
