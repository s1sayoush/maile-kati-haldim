export interface EventDetails {
  eventTitle?: string;
  location?: string;
  coordinates?: [number, number];
}

export interface Person {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export enum PaymentMethod {
  SINGLE = "SINGLE", // One person paid the full amount
  COMBINATION = "COMBINATION", // Multiple people including possible common funds
  COMMON = "COMMON", // Fully paid from common funds (like group winnings)
}

export interface PaymentDetail {
  personId: string; // Will be "common" for common fund payments
  amount: number;
}

export enum BillCategory {
  Food = "FOOD",
  Drinks = "DRINKS",
  Transport = "TRANSPORT",
  Accommodation = "ACCOMMODATION",
  Entertainment = "ENTERTAINMENT",
  Miscellaneous = "MISCELLANEOUS",
}

export interface BillItem {
  id: string;
  description: string;
  amount: number;
  category: BillCategory;
  paymentMethod: PaymentMethod;
  payments: PaymentDetail[]; // Can include both personal payments and common fund
  liablePersons: string[]; // People who need to split this expense
}

export interface Event {
  details: EventDetails;
  participants: Person[];
  items: BillItem[];
}

export interface SummaryReport {
  totalAmount: number;
  commonFundAmount: number; // Total amount in common fund (sum of all common payments)
  paidByPerson: { [personId: string]: number }; // How much each person paid
  owedByPerson: { [personId: string]: number }; // How much each person owes
}

export interface DetailedItemReport {
  itemId: string;
  description: string;
  amount: number;
  payments: PaymentDetail[];
  liablePersons: string[];
  splitAmount: number; // Amount per liable person after considering common payments
}

export interface DetailedReport {
  eventDetails: EventDetails;
  itemReports: DetailedItemReport[];
  summary: SummaryReport;
}

// Example usage:
const exampleBillItems: BillItem[] = [
  {
    // Regular expense paid by one person
    id: "1",
    description: "Dinner",
    amount: 100,
    category: BillCategory.Food,
    paymentMethod: PaymentMethod.SINGLE,
    payments: [{ personId: "person1", amount: 100 }],
    liablePersons: ["person1", "person2", "person3"],
  },
  {
    // Common fund (like prize money)
    id: "2",
    description: "Tournament prize",
    amount: 300,
    category: BillCategory.Miscellaneous,
    paymentMethod: PaymentMethod.COMMON,
    payments: [{ personId: "common", amount: 300 }],
    liablePersons: [], // Empty because it benefits everyone
  },
  {
    // Combination of personal and common fund
    id: "3",
    description: "Hotel stay",
    amount: 1000,
    category: BillCategory.Accommodation,
    paymentMethod: PaymentMethod.COMBINATION,
    payments: [
      { personId: "common", amount: 400 }, // Part from common fund
      { personId: "person1", amount: 300 }, // Rest split between people
      { personId: "person2", amount: 300 },
    ],
    liablePersons: ["person1", "person2", "person3"],
  },
];
