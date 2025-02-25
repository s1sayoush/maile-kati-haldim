import { z } from "zod";
import { BillCategory, PaymentMethod } from "@/types/types";

// Event Details Schema
export const eventDetailsSchema = z.object({
  eventTitle: z.string().min(1, "Event title is required"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  coordinates: z.tuple([
    z.number().min(-90).max(90), // latitude
    z.number().min(-180).max(180), // longitude
  ]),
});

// Participant Schema
export const participantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// Payment Detail Schema
export const paymentDetailSchema = z.object({
  personId: z.string(),
  amount: z.number().min(0, "Amount must be positive"),
});

// Bill Item Schema
export const billItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().min(0, "Amount must be positive"),
  category: z.nativeEnum(BillCategory),
  paymentMethod: z.nativeEnum(PaymentMethod),
  payments: z.array(
    z.object({
      personId: z.string(),
      amount: z.number().min(0),
    })
  ),
  liablePersons: z
    .array(z.string())
    .min(1, "At least one person must be liable"),
});

// Full Event Schema
export const eventSchema = z.object({
  details: eventDetailsSchema,
  participants: z
    .array(participantSchema)
    .min(1, "At least one participant is required"),
  items: z.array(billItemSchema),
});

export const expenseSchema = z
  .object({
    itemName: z.string().min(1, "Item name is required"),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be greater than 0",
    }),
    category: z.nativeEnum(BillCategory),
    paymentMethod: z.nativeEnum(PaymentMethod),
    payments: z.array(
      z.object({
        personId: z.string(),
        amount: z.number().min(0),
      })
    ),
    liablePersons: z
      .array(z.string())
      .min(1, "At least one person must be selected"),
    selectedPayer: z.string().min(1, "Payer must be selected"),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === PaymentMethod.SINGLE) {
        return data.selectedPayer.length > 0;
      }
      if (data.paymentMethod === PaymentMethod.COMBINATION) {
        const totalPaid = data.payments.reduce((sum, p) => sum + p.amount, 0);
        return Math.abs(totalPaid - Number(data.amount)) < 0.01;
      }
      return true;
    },
    {
      message:
        "For combination payments, the sum must equal the total amount. For single payment, a payer must be selected.",
    }
  );

type ExpenseFormData = z.infer<typeof expenseSchema>;
