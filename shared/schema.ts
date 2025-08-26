import { z } from "zod";

// User schema for admin authentication
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration schema for MongoDB
export const insertRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  year: z.enum(["I", "II", "III", "IV"], {
    errorMap: () => ({ message: "Year must be I, II, III, or IV" })
  }),
  department: z.string().min(2, "Department must be at least 2 characters"),
  section: z.string().min(1, "Section is required"),
  secId: z.string().min(1, "SEC ID is required"),
  college: z.string().min(2, "College name must be at least 2 characters"),
  preferredCountry: z.string().min(2, "Preferred country must be at least 2 characters"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  committee: z.enum(["UNEP", "UNSC"], {
    errorMap: () => ({ message: "Committee must be UNEP or UNSC" })
  }),
  paymentScreenshot: z.string().optional(), // Base64 or URL of payment screenshot
});

// Registration status configuration schema
export const registrationStatusSchema = z.object({
  isOpen: z.boolean(),
  message: z.string().optional(),
  closedAt: z.date().optional(),
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type RegistrationStatus = z.infer<typeof registrationStatusSchema>;

// MongoDB Registration interface (for Mongoose)
export interface IRegistration {
  _id?: string;
  fullName: string;
  year: 'I' | 'II' | 'III' | 'IV';
  department: string;
  section: string;
  secId: string;
  college: string;
  preferredCountry: string;
  phoneNumber: string;
  committee: 'UNEP' | 'UNSC';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentScreenshot?: string; // Base64 or URL of payment screenshot
  createdAt: Date;
}
