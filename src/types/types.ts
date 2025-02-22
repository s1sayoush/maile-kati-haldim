export interface EventDetails {
  eventTitle?: string;
  location?: string;
  coordinates?: [number, number];
  date?: string | Date;
}

export interface Person {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export enum PaymentMethod {
  SINGLE = "Single",
  COMBINATION = "Combination",
}

export interface PaymentDetail {
  personId: string;
  amount: number;
}

export enum BillCategory {
  FOOD = "Food",
  DRINKS = "Drinks",
  TRANSPORT = "Transport",
  ACCOMODATION = "Accomodation",
  ENTERTAINMENT = "Entertainment",
  MISCALLENOUS = "Miscallenous",
}

export interface BillItem {
  id: string;
  itemName?: string;
  amount: number;
  category: BillCategory;
  paymentMethod: PaymentMethod;
  payments: PaymentDetail[]; // Can include both personal payments and common fund
  liablePersons: string[]; // People who need to split this expense
}

export interface Deductible {
  amount: number;
  reason: string;
}

export interface Event {
  id?: string;
  details: EventDetails;
  participants: Person[];

  items: BillItem[];
  report: Report;
}

export interface Report {
  totalAmount: number;
  deductible: Deductible;
  paidByPerson: { [personId: string]: number };
  owedByPerson: { [personId: string]: number };
  finalTotal?: number;
  finalOwedByPerson?: { [personId: string]: number };
  netBalances?: { [personId: string]: number };
}
