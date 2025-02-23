import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Event } from "@/types/types";

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

interface Balance {
  id: string;
  balance: number;
}

const SettlementPlanTab = ({ data }: { data: Event }) => {
  const { participants, report } = data;
  const settlementPlan = generateSettlementPlan(
    report.netBalances!,
    participants
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settlement Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Optimized settlement plan with minimum transactions
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">From</TableHead>
                <TableHead className="w-1/3">To</TableHead>
                <TableHead className="w-1/3 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlementPlan.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {participants.find((p) => p.id === transaction.from)?.name}
                  </TableCell>
                  <TableCell>
                    {participants.find((p) => p.id === transaction.to)?.name}
                  </TableCell>
                  <TableCell className="text-right">
                    Rs.{transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Participant</TableHead>
                <TableHead className="w-1/2 text-right">Net Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => {
                const balance = report.netBalances![participant.id];
                return (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">
                      {participant.name}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Rs.{balance.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const generateSettlementPlan = (
  netBalances: Record<string, number>,
  participants: Event["participants"]
): Transaction[] => {
  // Convert balances to array and sort by absolute value
  const balances: Balance[] = Object.entries(netBalances)
    .map(([id, balance]) => ({ id, balance }))
    .filter(({ balance }) => Math.abs(balance) > 0.01) // Ignore negligible amounts
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

  const settlements: Transaction[] = [];

  while (balances.length > 1) {
    const debtor = balances.find((b) => b.balance < 0);
    const creditor = balances.find((b) => b.balance > 0);

    if (!debtor || !creditor) break;

    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

    if (amount > 0.01) {
      // Only add significant transactions
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Number(amount.toFixed(2)),
      });
    }

    debtor.balance += amount;
    creditor.balance -= amount;

    // Remove settled participants
    const settled = balances.filter((b) => Math.abs(b.balance) <= 0.01);
    settled.forEach((s) => {
      const index = balances.findIndex((b) => b.id === s.id);
      if (index !== -1) balances.splice(index, 1);
    });
  }

  return settlements;
};

export default SettlementPlanTab;
