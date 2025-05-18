export const ROLES = Object.freeze({
  ADMIN: "admin",
  TEACHER: "teacher",
  PARENT: "parent",
} as const);

export const ADMISSION_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  WAITLISTED: "waitlisted",
  CANCELLED: "cancelled",
} as const);

export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  HALF_DAY: "half_day",
  LEAVE: "leave",
} as const);

export const FEE_STATUS = Object.freeze({
  PAID: "paid",
  UNPAID: "unpaid",
  WAIVED: "waived",
} as const);
