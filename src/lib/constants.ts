import {
  billItemSchema,
  eventDetailsSchema,
  eventSchema,
  participantSchema,
} from "@/app/schemas/Schema";
import { z } from "zod";

export const FORM_STEPS = [
  {
    id: "details",
    title: "Event Details",
    description: "Basic information about the event",
    validationSchema: eventDetailsSchema,
  },
  {
    id: "participants",
    title: "Participants",
    description: "Add people involved in the event",
    validationSchema: z.object({
      participants: participantSchema.array().min(1),
    }),
  },
  {
    id: "expenses",
    title: "Expenses",
    description: "Add all expenses and payments",
    validationSchema: z.object({
      items: billItemSchema.array(),
    }),
  },
  {
    id: "review",
    title: "Review",
    description: "Review and finalize",
    validationSchema: eventSchema,
  },
] as const;

export type FormStep = (typeof FORM_STEPS)[number];
