import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";
import {
  markAttendance,
  getAttendaceBySection,
  getAttendanceForStudent,
  getAttendanceForTeacher,
  getTodayAttendanceStatus,
  getAttendanceForAllChildren,
} from "../controllers/attendance.controller";
const router = Router();

router.post(
  "/mark",
  verifyAuth(Object.values([ROLES.TEACHER])),
  markAttendance
);
router.get(
  "/for-parents",
  verifyAuth(Object.values([ROLES.PARENT])),
  getAttendanceForAllChildren
);
router.get("/section", verifyAuth(Object.values(ROLES)), getAttendaceBySection);
router.get(
  "/student/:id",
  verifyAuth(Object.values(ROLES)),
  getAttendanceForStudent
);
router.get(
  "/teacher/:id",
  verifyAuth(Object.values([ROLES.TEACHER])),
  getAttendanceForTeacher
);
router.get(
  "/today-status",
  verifyAuth(Object.values([ROLES.TEACHER])),
  getTodayAttendanceStatus
);

export default router;
