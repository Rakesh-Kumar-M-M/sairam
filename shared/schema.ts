import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  year: text("year").notNull(),
  department: text("department").notNull(),
  section: text("section").notNull(),
  secId: text("sec_id").notNull(),
  college: text("college").notNull(),
  preferredCountry: text("preferred_country").notNull(),
  phoneNumber: text("phone_number").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).pick({
  fullName: true,
  year: true,
  department: true,
  section: true,
  secId: true,
  college: true,
  preferredCountry: true,
  phoneNumber: true,
}).extend({
  year: z.enum(["I", "II", "III", "IV"]),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  section: z.string().min(1, "Section is required"),
  secId: z.string().min(1, "SEC ID is required"),
  college: z.string().min(2, "College name must be at least 2 characters"),
  preferredCountry: z.string().min(2, "Preferred country must be at least 2 characters"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
