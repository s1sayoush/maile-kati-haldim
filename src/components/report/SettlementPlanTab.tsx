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
import { Button } from "@/components/ui/button";
import { Event } from "@/types/types";

const SettlementPlanTab = ({ data }: { data: Event }) => {
  const { participants, report } = data;

  // Generate settlement plan
  const settlementPlan = generateSettlementPlan(
    report.netBalances!,
    participants
  );

  return (
    <div className="space-y-6">
      {/* Settlement Plan Table */}
      <Card>
        <CardHeader>
          <CardTitle>Settlement Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              A plan to settle all debts with minimal transactions.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlementPlan.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {participants.find((p) => p.id === transaction.from)?.name}
                  </TableCell>
                  <TableCell>
                    {participants.find((p) => p.id === transaction.to)?.name}
                  </TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>
                    {transaction.status === "pending" ? (
                      <span className="text-yellow-500">Pending</span>
                    ) : (
                      <span className="text-green-500">Completed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Net Balances Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Net Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Net Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>
                    <span
                      className={
                        report.netBalances![participant.id] >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      ${report.netBalances![participant.id]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettlementPlanTab;

// Helper function to generate an optimized settlement plan
const generateSettlementPlan = (
  netBalances: Record<string, number>,
  participants: any[]
) => {
  const debts = Object.entries(netBalances)
    .map(([id, balance]) => ({ id, balance }))
    .filter(({ balance }) => balance !== 0);

  const creditors = debts.filter(({ balance }) => balance > 0);
  const debtors = debts.filter(({ balance }) => balance < 0);

  const settlementPlan: {
    from: string;
    to: string;
    amount: number;
    status: string;
  }[] = [];

  debtors.forEach((debtor) => {
    let remainingDebt = Math.abs(debtor.balance);

    while (remainingDebt > 0) {
      const creditor = creditors.find((c) => c.balance > 0);
      if (!creditor) break;

      const amount = Math.min(remainingDebt, creditor.balance);
      settlementPlan.push({
        from: debtor.id,
        to: creditor.id,
        amount,
        status: "pending",
      });

      remainingDebt -= amount;
      creditor.balance -= amount;
    }
  });

  return settlementPlan;
};

// // Helper function to mark a transaction as completed
// const markTransactionAsCompleted = (index: number) => {
//   // Update the status of the transaction in the settlement plan
//   // (This would typically involve updating state or making an API call)
//   console.log(`Transaction ${index} marked as completed.`);
// };
