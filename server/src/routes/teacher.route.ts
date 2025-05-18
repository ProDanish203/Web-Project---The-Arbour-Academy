import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";
import {
  getAllTeachers,
  addTeacher,
  updateTeacherInformation,
  removeTeacher,
} from "../controllers/teacher.controller";
const router = Router();

router.get("/", verifyAuth(Object.values([ROLES.ADMIN])), getAllTeachers);
router.post("/", verifyAuth(Object.values([ROLES.ADMIN])), addTeacher);
router.patch(
  "/:id",
  verifyAuth(Object.values([ROLES.ADMIN])),
  updateTeacherInformation
);
router.delete("/:id", verifyAuth(Object.values([ROLES.ADMIN])), removeTeacher);

export default router;
