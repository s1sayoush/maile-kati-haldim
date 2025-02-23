import React, { useEffect, useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const ReviewStep = () => {
  const { currentEvent, updateReport, personIdtoName } = useEventStore();
  const [hasDeductible, setHasDeductible] = useState("no");
  const [deductibleAmount, setDeductibleAmount] = useState("");
  const [deductibleReason, setDeductibleReason] = useState("");

  useEffect(() => {
    updateReport();
  }, [updateReport]);

  const totalAmount = currentEvent.items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const handleDeductibleSubmit = () => {
    if (hasDeductible === "yes" && deductibleAmount && deductibleReason) {
      const amount = parseFloat(deductibleAmount);
      if (!isNaN(amount)) {
        currentEvent.report.deductible = {
          amount,
          reason: deductibleReason,
        };
      }
    } else {
      currentEvent.report.deductible = {
        amount: 0,
        reason: "",
      };
    }
    updateReport();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deductible Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup
              value={hasDeductible}
              onValueChange={setHasDeductible}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No deductible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes, apply deductible</Label>
              </div>
            </RadioGroup>

            {hasDeductible === "yes" && (
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="deductibleAmount">Amount</Label>
                  <Input
                    type="number"
                    id="deductibleAmount"
                    value={deductibleAmount}
                    onChange={(e) => setDeductibleAmount(e.target.value)}
                    placeholder="Enter deductible amount"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="deductibleReason">Reason</Label>
                  <Input
                    type="text"
                    id="deductibleReason"
                    value={deductibleReason}
                    onChange={(e) => setDeductibleReason(e.target.value)}
                    placeholder="Enter reason (e.g., prize money, discount)"
                  />
                </div>
                <Button onClick={handleDeductibleSubmit}>
                  Apply Deductible
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEvent.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemName || "Unnamed Item"}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">
                    Rs.{item.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">
                  Rs.{totalAmount.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              {currentEvent.report.deductible.amount > 0 && (
                <>
                  <TableRow className="text-muted-foreground">
                    <TableCell colSpan={2}>
                      Deductible ({currentEvent.report.deductible.reason})
                    </TableCell>
                    <TableCell className="text-right">
                      -Rs.{currentEvent.report.deductible.amount.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="font-medium">
                    <TableCell colSpan={2}>Final Total</TableCell>
                    <TableCell className="text-right">
                      Rs.{currentEvent.report.finalTotal?.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Owed</TableHead>
                <TableHead className="text-right">Net Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEvent.participants.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell className="text-right">
                    Rs.
                    {currentEvent.report.paidByPerson[person.id]?.toFixed(2) ||
                      "0.00"}
                  </TableCell>
                  <TableCell className="text-right">
                    Rs.
                    {currentEvent.report.finalOwedByPerson?.[
                      person.id
                    ]?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell
                    className={`text-right Rs.{
                      (currentEvent.report.netBalances?.[person.id] || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Rs.
                    {currentEvent.report.netBalances?.[person.id]?.toFixed(2) ||
                      "0.00"}
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

export default ReviewStep;
