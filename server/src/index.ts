import express from "express";
import { config } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware";
import { connectDb } from "./config/dbConnection";
// Routes imports
import authRoute from "./routes/auth.route";
import usersRoute from "./routes/user.route";
import admissionsRoute from "./routes/admission.route";
import teacherRoute from "./routes/teacher.route";
import attendanceRoute from "./routes/attendance.route";
import studentRoute from "./routes/student.route";

config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
// For url inputs
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.disable("x-powered-by");
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Base Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "The Arbour Academy - API",
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/admission", admissionsRoute);
app.use("/api/v1/teachers", teacherRoute);
app.use("/api/v1/attendance", attendanceRoute);
app.use("/api/v1/student", studentRoute);

// Middlewares
app.use(errorMiddleware);

// Listen To Server
const PORT = process.env.PORT || 8000;
// Connect To database first then start the server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Database Connection Error: ${error}`);
  });
