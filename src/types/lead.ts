export type LeadStatus = "NEW" | "CONTACTED" | "CLOSED";

export const BUDGET_RANGES = [
  "< $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

export interface Lead {
  id: string;
  name: string;
  email: string;
  budgetRange: string;
  message: string;
  status: LeadStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface LeadFormData {
  name: string;
  email: string;
  budgetRange: string;
  message: string;
}
