import { z } from "zod";

export const locationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

export const personSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const itemContributionSchema = z.object({
  personId: z.string(),
  amount: z.number().min(0),
  isOldMoney: z.boolean().optional(),
});

export const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  totalCost: z.number().min(0, "Cost must be positive"),
  contributions: z.array(itemContributionSchema),
  splits: z.array(
    z.object({
      personId: z.string(),
      shouldPay: z.boolean(),
    })
  ),
});
