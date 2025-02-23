import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Event, SettlementTransaction } from "@/types/types";
import { ArrowRight } from "lucide-react";

interface SettlementPlanTabProps {
  data: Event;
}

const SettlementPlanTab = ({ data }: SettlementPlanTabProps) => {
  const { participants, report } = data;
  const transactions = report.settlementPlan?.transactions || [];
  const deductibleAmount = report.deductible?.amount || 0;

  const findParticipantName = (id: string) =>
    participants.find((p) => p.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      {/* Settlement Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Settlement Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            A minimum transaction settlement plan to balance all payments
          </div>

          <div className="space-y-4">
            {transactions && transactions.length > 0 ? (
              transactions.map(
                (transaction: SettlementTransaction, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                      <span className="font-medium">
                        {findParticipantName(transaction.from)}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                      <span>{findParticipantName(transaction.to)}</span>
                    </div>
                    <div className="font-medium">
                      Rs.{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-center p-4">
                No settlement transactions needed
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Net Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Net Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Final balance after applying deductible of Rs.
            {deductibleAmount.toFixed(2)}
          </div>

          <div className="space-y-4">
            {participants.map((participant) => {
              const netBalance = report.netBalances?.[participant.id] || 0;
              const initialPaid = report.paidByPerson[participant.id] || 0;

              return (
                <div
                  key={participant.id}
                  className="p-4 rounded-lg bg-muted/50"
                >
                  <div className="font-medium mb-2">{participant.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Initial Share:
                      </span>
                      <span className="ml-2">Rs.{initialPaid.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Net Balance:
                      </span>
                      <span
                        className={`ml-2 ${
                          netBalance >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        Rs.{netBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span>Rs.{report.totalAmount.toFixed(2)}</span>
                </div>

                {report.deductible.isApplied &&
                  report.deductible.amount &&
                  report.deductible.reason && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Deductible ({report.deductible.reason}):
                      </span>
                      <span>-Rs.{report.deductible.amount.toFixed(2)}</span>
                    </div>
                  )}

                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Final Total:</span>
                  <span>
                    Rs.{(report.finalTotal || report.totalAmount).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Number of Transactions:</span>
                  <span>{transactions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettlementPlanTab;
