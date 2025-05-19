export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  PARENT: "PARENT",
} as const);

export const ADMISSION_STATUS = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  WAITLISTED: "WAITLISTED",
  CANCELLED: "CANCELLED",
} as const);

export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  HALF_DAY: "HALF_DAY",
  LEAVE: "LEAVE",
} as const);

export const FEE_STATUS = Object.freeze({
  PAID: "PAID",
  UNPAID: "UNPAID",
  WAIVED: "WAIVED",
} as const);
