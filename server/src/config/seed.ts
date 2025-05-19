import mongoose from "mongoose";
import {
  ROLES,
  ADMISSION_STATUS,
  FEE_STATUS,
  ATTENDANCE_STATUS,
} from "../utils/constants";
import { User } from "../models/user.model";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { Attendance } from "../models/attendance.model";
import { AdmissionRequest } from "../models/admission-request.model";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`Database Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

const pakistaniCities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
];

const pakistaniAreas = [
  "Defence Housing Authority",
  "Gulshan-e-Iqbal",
  "Clifton",
  "Johar Town",
  "Gulberg",
  "Bahria Town",
  "Model Town",
  "Askari",
  "Cantt",
  "North Nazimabad",
  "Saddar",
  "F-10",
  "E-11",
  "Blue Area",
  "G-9",
  "Satellite Town",
  "Hayatabad",
];

const pakistaniFirstNames = {
  male: [
    "Muhammad",
    "Ahmed",
    "Ali",
    "Hassan",
    "Hussain",
    "Ibrahim",
    "Usman",
    "Bilal",
    "Omar",
    "Faisal",
    "Zain",
    "Saad",
    "Asad",
    "Hamza",
    "Abdullah",
    "Talha",
    "Imran",
    "Farhan",
    "Adeel",
    "Rehan",
    "Kamran",
    "Shahid",
    "Tariq",
  ],
  female: [
    "Fatima",
    "Ayesha",
    "Zainab",
    "Maryam",
    "Amina",
    "Sana",
    "Hira",
    "Sara",
    "Noor",
    "Mahnoor",
    "Khadija",
    "Hafsa",
    "Asma",
    "Iqra",
    "Arooj",
    "Zahra",
    "Mehwish",
    "Sidra",
    "Alina",
    "Sadia",
    "Rabia",
    "Nadia",
    "Saima",
    "Farah",
  ],
};

const pakistaniLastNames = [
  "Khan",
  "Ahmed",
  "Ali",
  "Malik",
  "Qureshi",
  "Siddiqui",
  "Sheikh",
  "Raza",
  "Baig",
  "Mirza",
  "Butt",
  "Chaudhry",
  "Shah",
  "Javed",
  "Akhtar",
  "Hashmi",
  "Iqbal",
  "Cheema",
  "Bhatti",
  "Riaz",
  "Abbasi",
  "Farooq",
  "Akram",
  "Hassan",
];

function generatePakistaniAddress() {
  const houseNumber = Math.floor(Math.random() * 1000) + 1;
  const streetNumber = Math.floor(Math.random() * 50) + 1;
  const area =
    pakistaniAreas[Math.floor(Math.random() * pakistaniAreas.length)];
  const city =
    pakistaniCities[Math.floor(Math.random() * pakistaniCities.length)];

  return `House No. ${houseNumber}, Street ${streetNumber}, ${area}, ${city}, Pakistan`;
}

function generatePakistaniPhoneNumber() {
  const networkCodes = ["300", "301", "302", "303", "305"];
  const networkCode =
    networkCodes[Math.floor(Math.random() * networkCodes.length)];
  const subscriberNumber = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, "0");
  return `+92${networkCode}${subscriberNumber}`;
}

function generatePakistaniName(gender: "male" | "female") {
  const firstName =
    pakistaniFirstNames[gender][
      Math.floor(Math.random() * pakistaniFirstNames[gender].length)
    ];
  const lastName =
    pakistaniLastNames[Math.floor(Math.random() * pakistaniLastNames.length)];
  return { firstName, lastName, fullName: `${firstName} ${lastName}` };
}

function generateRollNumber(grade: string, index: number) {
  const year = new Date().getFullYear().toString().slice(-2);
  return `${grade}-${year}-${index.toString().padStart(3, "0")}`;
}

async function seedUsers() {
  try {
    await User.deleteMany({});
    console.log("Cleared existing users");

    const adminUser = new User({
      email: "danishsidd203@gmail.com",
      password: "Abc12345%",
      name: "Danish Siddiqui",
      phone: generatePakistaniPhoneNumber(),
      address: generatePakistaniAddress(),
      role: ROLES.ADMIN,
      isEmailVerified: true,
    });
    await adminUser.save();
    console.log("Admin user created");

    // Create teachers (20)
    const teacherUsers = [];
    for (let i = 0; i < 20; i++) {
      const gender = Math.random() > 0.5 ? "male" : "female";
      const { fullName } = generatePakistaniName(gender);

      const teacherUser = new User({
        email: `teacher${i + 1}@schoolmanagement.com`,
        password: "Abc12345%",
        name: fullName,
        phone: generatePakistaniPhoneNumber(),
        address: generatePakistaniAddress(),
        role: ROLES.TEACHER,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          fullName
        )}&background=random`,
        isEmailVerified: true,
      });

      const savedTeacher = await teacherUser.save();
      teacherUsers.push(savedTeacher);
    }
    console.log("20 teacher users created");

    // Create parents (30)
    const parentUsers = [];
    for (let i = 0; i < 30; i++) {
      const gender = Math.random() > 0.3 ? "male" : "female";
      const { fullName } = generatePakistaniName(gender);

      const parentUser = new User({
        email: `parent${i + 1}@example.com`,
        password: "Abc12345%",
        name: fullName,
        phone: generatePakistaniPhoneNumber(),
        address: generatePakistaniAddress(),
        role: ROLES.PARENT,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          fullName
        )}&background=random`,
        isEmailVerified: true,
      });

      const savedParent = await parentUser.save();
      parentUsers.push(savedParent);
    }
    console.log("30 parent users created");

    return { teacherUsers, parentUsers, adminUser };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedTeachers(teacherUsers: any[]) {
  try {
    await Teacher.deleteMany({});
    console.log("Cleared existing teachers");

    const qualifications = [
      "B.Ed",
      "M.Ed",
      "MA Education",
      "BS Education",
      "PhD Education",
      "BSc",
      "MSc",
      "BA",
      "MA",
      "MPhil",
      "PhD",
    ];

    const subjects = [
      "English",
      "Urdu",
      "Mathematics",
      "Science",
      "Social Studies",
      "Islamic Studies",
      "Arts",
      "Physical Education",
      "Islamic Studies",
    ];

    const grades = ["Toddlers", "Play-Group", "Nursery", "Kindergarten"];
    const sections = ["A", "B", "C", "D"];

    const teachers = [];
    for (let i = 0; i < teacherUsers.length; i++) {
      // Assign random grades (1-3 grades per teacher)
      const numGrades = Math.floor(Math.random() * 3) + 1;
      const teacherGrades: string[] = [];
      for (let j = 0; j < numGrades; j++) {
        const randomGrade = grades[Math.floor(Math.random() * grades.length)];
        if (!teacherGrades.includes(randomGrade)) {
          teacherGrades.push(randomGrade);
        }
      }

      // Assign sections based on grades
      const teacherSections: string[] = [];
      for (const grade of teacherGrades) {
        const randomSection =
          sections[Math.floor(Math.random() * sections.length)];
        if (!teacherSections.includes(randomSection)) {
          teacherSections.push(randomSection);
        }
      }

      // Assign random subjects (2-4 subjects per teacher)
      const numSubjects = Math.floor(Math.random() * 3) + 2;
      const subjects: string[] = [];

      for (let j = 0; j < numSubjects; j++) {
        const randomSubject =
          subjects[Math.floor(Math.random() * subjects.length)];
        if (!subjects.includes(randomSubject)) {
          subjects.push(randomSubject);
        }
      }

      // Assign random qualifications (1-3 qualifications per teacher)
      const numQualifications = Math.floor(Math.random() * 2) + 1;
      const teacherQualifications: string[] = [];
      for (let j = 0; j < numQualifications; j++) {
        const randomQualification =
          qualifications[Math.floor(Math.random() * qualifications.length)];
        if (!teacherQualifications.includes(randomQualification)) {
          teacherQualifications.push(randomQualification);
        }
      }

      // Generate random joining date (between 1 to 15 years ago)
      const yearsAgo = Math.floor(Math.random() * 15) + 1;
      const joiningDate = new Date();
      joiningDate.setFullYear(joiningDate.getFullYear() - yearsAgo);

      // Generate random employment type with weights
      const employmentTypeOptions = ["full-time", "part-time", "contract"];
      const employmentTypeWeights = [0.7, 0.2, 0.1]; // 70% full-time, 20% part-time, 10% contract
      const randomValue = Math.random();
      let employmentType = employmentTypeOptions[0];
      let cumulativeWeight = 0;

      for (let j = 0; j < employmentTypeOptions.length; j++) {
        cumulativeWeight += employmentTypeWeights[j];
        if (randomValue <= cumulativeWeight) {
          employmentType = employmentTypeOptions[j];
          break;
        }
      }

      // Generate salary based on employment type and experience
      let baseSalary = 0;
      if (employmentType === "full-time") {
        baseSalary = 60000;
      } else if (employmentType === "part-time") {
        baseSalary = 40000;
      } else {
        baseSalary = 50000;
      }

      // Add experience bonus (5% per year, up to 50%)
      const experienceBonus = Math.min(yearsAgo * 0.05, 0.5);
      const salary = Math.floor(baseSalary * (1 + experienceBonus));

      const teacher = new Teacher({
        userId: teacherUsers[i]._id,
        designation: ["Junior Teacher", "Senior Teacher", "Head Teacher"][
          Math.floor(Math.random() * 3)
        ],
        qualifications: teacherQualifications,
        subjects: subjects,
        grades: teacherGrades,
        sections: teacherSections,
        joiningDate: joiningDate,
        employmentType: employmentType,
        salary: salary,
      });

      const savedTeacher = await teacher.save();
      teachers.push(savedTeacher);
    }

    console.log(`${teachers.length} teachers created`);
    return teachers;
  } catch (error) {
    console.error("Error seeding teachers:", error);
    throw error;
  }
}

async function seedStudents(parentUsers: any[]) {
  try {
    await Student.deleteMany({});
    console.log("Cleared existing students");

    const grades = ["Toddlers", "Play-Group", "Nursery", "Kindergarten"];
    const sections = ["A", "B", "C", "D"];

    const usedRollNumbers = new Set();

    const students = [];
    let studentCount = 0;

    // Create 20 students for each grade (distributing across sections)
    for (const grade of grades) {
      for (let i = 0; i < 20; i++) {
        // Assign the student to one of the sections
        const section = sections[i % sections.length];

        let rollNumber;
        do {
          rollNumber = generateRollNumber(grade, i + 1);
        } while (usedRollNumbers.has(rollNumber));
        usedRollNumbers.add(rollNumber);

        // Assign to a random parent (some parents may have multiple children)
        const parentIndex = Math.floor(Math.random() * parentUsers.length);
        const parentId = parentUsers[parentIndex]._id;

        // Generate gender randomly with slight bias towards male (cultural context)
        const gender = Math.random() > 0.45 ? "male" : "female";

        // Generate Pakistani name
        const { firstName, lastName } = generatePakistaniName(gender);

        // Generate random date of birth appropriate for the grade
        const currentYear = new Date().getFullYear();
        let ageRange;

        if (grade === "Toddlers") {
          ageRange = { min: 2, max: 3 };
        } else if (grade === "Play-Group") {
          ageRange = { min: 3, max: 4 };
        } else if (grade === "Nursery") {
          ageRange = { min: 4, max: 5 };
        } else if (grade === "Kindergarten") {
          ageRange = { min: 5, max: 7 };
        } else {
          ageRange = { min: 7, max: 10 };
        }

        const birthYear =
          currentYear -
          ageRange.max -
          Math.floor(Math.random() * (ageRange.max - ageRange.min + 1));
        const birthMonth = Math.floor(Math.random() * 12);
        const birthDay = Math.floor(Math.random() * 28) + 1;
        const dateOfBirth = new Date(birthYear, birthMonth, birthDay);

        // Generate random admission date (between 1 month and 2 years ago)
        const admissionDate = new Date();
        const monthsAgo = Math.floor(Math.random() * 23) + 1;
        admissionDate.setMonth(admissionDate.getMonth() - monthsAgo);

        // Generate fee status with realistic distribution
        const feeStatusOptions = [FEE_STATUS.PAID, FEE_STATUS.UNPAID];
        const feeStatusWeights = [0.7, 0.2, 0.1];
        const randomValue = Math.random();
        let feeStatus = feeStatusOptions[0];
        let cumulativeWeight = 0;

        for (let j = 0; j < feeStatusOptions.length; j++) {
          cumulativeWeight += feeStatusWeights[j];
          if (randomValue <= cumulativeWeight) {
            feeStatus = feeStatusOptions[j];
            break;
          }
        }

        const relationOptions =
          gender === "male"
            ? ["Uncle", "Grandfather", "Elder Brother"]
            : ["Aunt", "Grandmother", "Elder Sister"];

        const emergencyContactRelation =
          relationOptions[Math.floor(Math.random() * relationOptions.length)];
        let emergencyContactName;

        if (
          emergencyContactRelation === "Elder Brother" ||
          emergencyContactRelation === "Elder Sister"
        ) {
          // For siblings, use the same last name
          const siblingGender =
            emergencyContactRelation === "Elder Brother" ? "male" : "female";
          const { firstName: siblingFirstName } =
            generatePakistaniName(siblingGender);
          emergencyContactName = `${siblingFirstName} ${lastName}`;
        } else {
          // For other relations, generate a new name but there's a chance to keep the same last name
          const keepLastName = Math.random() > 0.3;
          const emergencyContactGender =
            emergencyContactRelation === "Uncle" ||
            emergencyContactRelation === "Grandfather"
              ? "male"
              : "female";

          if (keepLastName) {
            const { firstName: emergencyFirstName } = generatePakistaniName(
              emergencyContactGender
            );
            emergencyContactName = `${emergencyFirstName} ${lastName}`;
          } else {
            const { fullName: emergencyFullName } = generatePakistaniName(
              emergencyContactGender
            );
            emergencyContactName = emergencyFullName;
          }
        }

        const student = new Student({
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          gender: gender,
          address: generatePakistaniAddress(),
          admissionDate: admissionDate,
          grade: grade,
          section: section,
          rollNumber: rollNumber,
          parentId: parentId,
          admissionStatus: ADMISSION_STATUS.APPROVED,
          feeStatus: feeStatus,
          emergencyContact: {
            name: emergencyContactName,
            relation: emergencyContactRelation,
            phone: generatePakistaniPhoneNumber(),
          },
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            firstName + "+" + lastName
          )}&background=random`,
        });

        const savedStudent = await student.save();
        students.push(savedStudent);
        studentCount++;
      }
    }

    console.log(
      `${studentCount} students created across ${grades.length} grades`
    );
    return students;
  } catch (error) {
    console.error("Error seeding students:", error);
    throw error;
  }
}

async function seedAttendance(students: any[], teachers: any[]) {
  try {
    await Attendance.deleteMany({});
    console.log("Cleared existing attendance records");

    const attendanceRecords = [];
    const today = new Date();
    const attendanceStatusOptions = Object.values(ATTENDANCE_STATUS);
    const attendanceStatusWeights = [0.85, 0.1, 0.05]; // 85% present, 10% absent, 5% late

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      // Skip weekends (Saturday and Sunday)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      // Assign a random teacher for each day to mark attendance
      const randomTeacherIndex = Math.floor(Math.random() * teachers.length);
      const markedBy = teachers[randomTeacherIndex].userId;

      // Create attendance record for each student
      for (const student of students) {
        // Randomize attendance status based on weights
        const randomValue = Math.random();
        let attendanceStatus = attendanceStatusOptions[0];
        let cumulativeWeight = 0;

        for (let j = 0; j < attendanceStatusOptions.length; j++) {
          cumulativeWeight += attendanceStatusWeights[j];
          if (randomValue <= cumulativeWeight) {
            attendanceStatus = attendanceStatusOptions[j];
            break;
          }
        }

        // Add remarks for absent or late students
        let remarks = "";
        if (attendanceStatus === ATTENDANCE_STATUS.ABSENT) {
          const absentReasons = [
            "Sick leave",
            "Family emergency",
            "Medical appointment",
            "Personal reasons",
            "Not informed",
          ];
          remarks =
            absentReasons[Math.floor(Math.random() * absentReasons.length)];
        } else if (attendanceStatus === ATTENDANCE_STATUS.LATE) {
          const lateReasons = [
            "Traffic issues",
            "Transport problem",
            "Woke up late",
            "Family issue",
            "No reason provided",
          ];
          remarks = lateReasons[Math.floor(Math.random() * lateReasons.length)];
        }

        const attendance = new Attendance({
          studentId: student._id,
          date: new Date(date),
          status: attendanceStatus,
          markedBy: markedBy,
          remarks: remarks,
        });

        try {
          const savedAttendance = await attendance.save();
          attendanceRecords.push(savedAttendance);
        } catch (error) {}
      }
    }

    console.log(`${attendanceRecords.length} attendance records created`);
    return attendanceRecords;
  } catch (error) {
    console.error("Error seeding attendance:", error);
    throw error;
  }
}

async function seedAdmissionRequests() {
  try {
    await AdmissionRequest.deleteMany({});
    console.log("Cleared existing admission requests");

    const grades = ["Toddlers", "Play-Group", "Nursery", "Kindergarten"];
    const statuses = Object.values(ADMISSION_STATUS);

    const admissionRequests = [];

    for (let i = 0; i < 15; i++) {
      const gender = Math.random() > 0.45 ? "male" : "female";
      const { firstName, lastName } = generatePakistaniName(gender);
      const grade = grades[Math.floor(Math.random() * grades.length)];

      const currentYear = new Date().getFullYear();
      let ageRange;

      if (grade === "Toddlers") {
        ageRange = { min: 2, max: 3 };
      } else if (grade === "Play-Group") {
        ageRange = { min: 3, max: 4 };
      } else if (grade === "Nursery") {
        ageRange = { min: 4, max: 5 };
      } else if (grade === "Kindergarten") {
        ageRange = { min: 5, max: 7 };
      } else {
        ageRange = { min: 7, max: 10 };
      }

      const birthYear =
        currentYear -
        ageRange.max +
        Math.floor(Math.random() * (ageRange.max - ageRange.min));
      const birthMonth = Math.floor(Math.random() * 12);
      const birthDay = Math.floor(Math.random() * 28) + 1;
      const dateOfBirth = new Date(birthYear, birthMonth, birthDay);

      // Generate parent name (with bias towards father as primary contact in cultural context)
      const parentGender = Math.random() > 0.8 ? "female" : "male";
      const { fullName: parentName } = generatePakistaniName(parentGender);
      const relation = parentGender === "male" ? "Father" : "Mother";

      // Generate random application date (within the last 3 months)
      const applicationDate = new Date();
      const daysAgo = Math.floor(Math.random() * 90);
      applicationDate.setDate(applicationDate.getDate() - daysAgo);

      // Weighted status distribution
      let status;
      if (i < 5) {
        status = ADMISSION_STATUS.PENDING; // 5 pending
      } else if (i < 12) {
        status = ADMISSION_STATUS.APPROVED; // 7 approved
      } else {
        status = ADMISSION_STATUS.REJECTED; // 3 rejected
      }

      // Generate comments based on status
      let comments = "";
      if (status === ADMISSION_STATUS.APPROVED) {
        const approvalComments = [
          "All documentation complete. Admission approved.",
          "Student meets all requirements. Welcome to our school!",
          "Excellent previous academic record. Approved.",
          "Admission granted based on entrance test performance.",
          "Approved. Please complete fee payment within 7 days.",
        ];
        comments =
          approvalComments[Math.floor(Math.random() * approvalComments.length)];
      } else if (status === ADMISSION_STATUS.REJECTED) {
        const rejectionComments = [
          "Incomplete documentation submitted.",
          "No seats available in the requested grade.",
          "Does not meet age requirements for the grade.",
          "Failed to meet minimum entrance test score.",
          "Application submitted after deadline.",
        ];
        comments =
          rejectionComments[
            Math.floor(Math.random() * rejectionComments.length)
          ];
      }

      // Generate emergency contact (different from parent)
      const emergencyContactRelation =
        relation === "Father" ? "Mother" : "Father";
      const emergencyContactGender =
        emergencyContactRelation === "Father" ? "male" : "female";
      const { fullName: emergencyContactName } = generatePakistaniName(
        emergencyContactGender
      );

      const admissionRequest = new AdmissionRequest({
        studentInfo: {
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          gender: gender,
          grade: grade,
        },
        parentInfo: {
          name: parentName,
          email: `${parentName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
          phone: generatePakistaniPhoneNumber(),
          relation: relation,
        },
        address: generatePakistaniAddress(),
        emergencyContact: {
          name: emergencyContactName,
          relation: emergencyContactRelation,
          phone: generatePakistaniPhoneNumber(),
        },
        status: status,
        applicationDate: applicationDate,
        comments: comments,
        // Only add review details if not pending
        ...(status !== ADMISSION_STATUS.PENDING && {
          reviewedBy: "admin", // Placeholder, would typically be an admin user ID
          reviewDate: new Date(
            applicationDate.getTime() +
              Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
          ), // 0-7 days after application
        }),
      });

      const savedRequest = await admissionRequest.save();
      admissionRequests.push(savedRequest);
    }

    console.log(`${admissionRequests.length} admission requests created`);
    return admissionRequests;
  } catch (error) {
    console.error("Error seeding admission requests:", error);
    throw error;
  }
}

async function seed() {
  try {
    await connectDB();

    console.log("Starting database seeding...");

    const { teacherUsers, parentUsers, adminUser } = await seedUsers();

    const teachers = await seedTeachers(teacherUsers);

    const students = await seedStudents(parentUsers);

    await seedAttendance(students, teachers);

    await seedAdmissionRequests();

    console.log("Database seeding completed successfully!");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB due to error");
    process.exit(1);
  }
}

seed();
