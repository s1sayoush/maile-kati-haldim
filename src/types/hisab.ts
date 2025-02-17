// types.ts
export interface Location {
  name: string;
  date: string;
  description?: string;
}

export interface Person {
  id: string;
  name: string;
}

export interface ItemContribution {
  personId: string;
  amount: number;
  isOldMoney?: boolean;
}

export interface ItemSplit {
  personId: string;
  shouldPay: boolean;
}

export interface Item {
  id: string;
  name: string;
  totalCost: number;
  contributions: ItemContribution[];
  splits: ItemSplit[];
}

export interface BillSummary {
  totalAmount: number;
  perPersonBreakdown: {
    personId: string;
    paid: number;
    shouldPay: number;
    netAmount: number;
  }[];
}
