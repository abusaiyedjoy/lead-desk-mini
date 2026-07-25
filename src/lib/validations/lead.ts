import { z } from "zod";
import { BUDGET_RANGES } from "@/types/lead";

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  budgetRange: z
    .string()
    .min(1, { message: "Please select a budget range" })
    .refine((val) => BUDGET_RANGES.includes(val as typeof BUDGET_RANGES[number]), {
      message: "Please select a valid budget range",
    }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters long" })
    .max(2000, { message: "Message cannot exceed 2000 characters" }),
});

export const leadStatusUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"], {
    message: "Status must be NEW, CONTACTED, or CLOSED",
  }),
});

export type LeadFormSchema = z.infer<typeof leadFormSchema>;
export type LeadStatusUpdateSchema = z.infer<typeof leadStatusUpdateSchema>;
