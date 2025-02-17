import { calculateBillSummary } from "@/lib/utils";
import { Item, Person } from "@/types/hisab";
import { NextRequest, NextResponse } from "next/server";

// Sample Test Data
const people: Person[] = [
  { id: "p1", name: "Alice" },
  { id: "p2", name: "Bob" },
  { id: "p3", name: "Charlie" },
];

const testItems: Item[] = [
  {
    id: "item1",
    name: "Lunch",
    totalCost: 200,
    contributions: [
      { personId: "p1", amount: 150, isOldMoney: false },
      { personId: "p2", amount: 50, isOldMoney: false },
    ],
    splits: [
      { personId: "p1", shouldPay: true },
      { personId: "p2", shouldPay: true },
      { personId: "p3", shouldPay: false },
    ],
  },
  {
    id: "item2",
    name: "Snacks",
    totalCost: 60,
    contributions: [{ personId: "common", amount: 60, isOldMoney: true }],
    splits: [
      { personId: "p1", shouldPay: true },
      { personId: "p2", shouldPay: true },
      { personId: "p3", shouldPay: true },
    ],
  },
];

// API Route Handler
export async function GET(req: NextRequest) {
  try {
    const result = calculateBillSummary(testItems, people);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
