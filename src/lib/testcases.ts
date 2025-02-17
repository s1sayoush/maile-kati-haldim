import { Person, Item } from "@/types/hisab";
import { calculateBillSummary } from "./utils";

// Test Data Setup
const people: Person[] = [
  { id: "p1", name: "Alice" },
  { id: "p2", name: "Bob" },
  { id: "p3", name: "Charlie" },
];

// Test Case 1: Simple equal split with no old money
const test1Items: Item[] = [
  {
    id: "item1",
    name: "Dinner",
    totalCost: 300,
    contributions: [{ personId: "p1", amount: 300, isOldMoney: false }],
    splits: [
      { personId: "p1", shouldPay: true },
      { personId: "p2", shouldPay: true },
      { personId: "p3", shouldPay: true },
    ],
  },
];

// Test Case 2: Multiple items with old money
const test2Items: Item[] = [
  {
    id: "item1",
    name: "Groceries",
    totalCost: 150,
    contributions: [
      { personId: "p1", amount: 100, isOldMoney: false },
      { personId: "common", amount: 50, isOldMoney: true },
    ],
    splits: [
      { personId: "p1", shouldPay: true },
      { personId: "p2", shouldPay: true },
    ],
  },
  {
    id: "item2",
    name: "Movie",
    totalCost: 90,
    contributions: [{ personId: "p2", amount: 90, isOldMoney: false }],
    splits: [
      { personId: "p1", shouldPay: true },
      { personId: "p2", shouldPay: true },
      { personId: "p3", shouldPay: true },
    ],
  },
];

// Test Case 3: Complex case with partial splits and multiple contributions
const test3Items: Item[] = [
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

// Run tests
console.log("Test Case 1 - Simple equal split:");
console.log(JSON.stringify(calculateBillSummary(test1Items, people), null, 2));

console.log("\nTest Case 2 - Multiple items with old money:");
console.log(JSON.stringify(calculateBillSummary(test2Items, people), null, 2));

console.log("\nTest Case 3 - Complex case:");
console.log(JSON.stringify(calculateBillSummary(test3Items, people), null, 2));
