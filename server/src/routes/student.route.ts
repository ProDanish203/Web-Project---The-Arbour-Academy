import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";
import {
  getAllStudents,
  getStudentById,
  updateStudentInformation,
  removeStudent,
  getStudentsByGradeAndSection,
  getStudentsByParentId,
} from "../controllers/student.controller";
const router = Router();

router.get(
  "/",
  verifyAuth(Object.values([ROLES.ADMIN, ROLES.TEACHER])),
  getAllStudents
);
router.get(
  "/by-grade-and-section",
  verifyAuth(Object.values([ROLES.ADMIN, ROLES.TEACHER])),
  getStudentsByGradeAndSection
);
router.get(
  "/by-parent",
  verifyAuth(Object.values([ROLES.ADMIN, ROLES.PARENT])),
  getStudentsByParentId
);
router.get("/:id", verifyAuth(Object.values(ROLES)), getStudentById);
router.patch(
  "/:id",
  verifyAuth(Object.values([ROLES.ADMIN])),
  updateStudentInformation
);
router.delete("/:id", verifyAuth(Object.values([ROLES.ADMIN])), removeStudent);

export default router;
