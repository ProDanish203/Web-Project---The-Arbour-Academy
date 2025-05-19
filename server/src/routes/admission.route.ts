import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";
import {
  submitAdmissionRequest,
  reviewAdmissionRequest,
  getAdmissionApplications,
} from "../controllers/admission.controller";
const router = Router();

router.post("/submit-application", submitAdmissionRequest);
router.put(
  "/review/:id",
  verifyAuth(Object.values([ROLES.ADMIN])),
  reviewAdmissionRequest
);
router.get(
  "/applications",
  verifyAuth(Object.values([ROLES.ADMIN])),
  getAdmissionApplications
);

export default router;
