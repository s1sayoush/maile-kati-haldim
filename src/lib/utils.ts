import { BillSummary, Item, Person } from "@/types/hisab";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (fullName?: string | null) => {
  if (!fullName?.trim()) return "";

  const nameParts = fullName
    .trim()
    .split(" ")
    .filter((part) => part.length > 0);

  // If there's only one word, use first and last letter of that word
  if (nameParts.length === 1) {
    const word = nameParts[0];
    return word.length > 1 ? word[0] + word[word.length - 1] : word[0];
  }

  // Use first letter of first word and first letter of last word
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts[nameParts.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
};

export function calculateBillSummary(
  items: Item[],
  people: Person[]
): BillSummary {
  // Initialize person breakdown with zeros
  const personBreakdown = people.map((person) => ({
    personId: person.id,
    paid: 0,
    shouldPay: 0,
    netAmount: 0,
  }));

  // Process each item
  items.forEach((item) => {
    // Calculate total old money (common funds) in this item
    const oldMoneyTotal = item.contributions
      .filter((contrib) => contrib.isOldMoney)
      .reduce((sum, contrib) => sum + contrib.amount, 0);

    // Calculate personal contributions
    const personalContributions = item.contributions.filter(
      (contrib) => !contrib.isOldMoney
    );

    // Count people who should split this item
    const splitCount = item.splits.filter((split) => split.shouldPay).length;
    if (splitCount === 0) return; // Skip if no one is splitting this item

    // Calculate per person share for this item
    const perPersonShare = (item.totalCost - oldMoneyTotal) / splitCount;

    // Update paid amounts (what each person contributed)
    personalContributions.forEach((contribution) => {
      const personIndex = personBreakdown.findIndex(
        (p) => p.personId === contribution.personId
      );
      if (personIndex !== -1) {
        personBreakdown[personIndex].paid += contribution.amount;
      }
    });

    // Distribute old money equally among all splitters
    const oldMoneyPerPerson = oldMoneyTotal / splitCount;

    // Update should pay amounts
    item.splits.forEach((split) => {
      if (split.shouldPay) {
        const personIndex = personBreakdown.findIndex(
          (p) => p.personId === split.personId
        );
        if (personIndex !== -1) {
          personBreakdown[personIndex].shouldPay += perPersonShare;
          // Add their share of old money to paid amount
          personBreakdown[personIndex].paid += oldMoneyPerPerson;
        }
      }
    });
  });

  // Calculate net amounts (negative means they owe money, positive means they should receive)
  personBreakdown.forEach((breakdown) => {
    breakdown.netAmount = breakdown.paid - breakdown.shouldPay;
  });

  return {
    totalAmount: items.reduce((sum, item) => sum + item.totalCost, 0),
    perPersonBreakdown: personBreakdown,
  };
}
