import { z } from "zod";

export const admissionFormSchema = z.object({
  studentInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.date({
      required_error: "Date of birth is required",
    }),
    gender: z.string().min(1, "Gender is required"),
    grade: z.string().min(1, "Grade is required"),
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
  }),
  parentInfo: z.object({
    name: z.string().min(1, "Parent's name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    relation: z.string().min(1, "Relation to student is required"),
    occupation: z.string().optional(),
  }),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relation: z.string().min(1, "Relation is required"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
  }),
});

export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;
