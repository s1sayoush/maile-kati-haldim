import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users } from "lucide-react";
import { useEventStore } from "@/store/useEventStore";
import { BillCategory, PaymentMethod, BillItem } from "@/types/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// Types
interface ExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<BillItem, "id">) => void;
  editingItem?: BillItem;
}

interface PaymentCardProps {
  label: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

interface FormData {
  itemName: string;
  amount: string;
  category: BillCategory;
  paymentMethod: PaymentMethod;
  payments: Array<{ personId: string; amount: number }>;
  liablePersons: string[];
  selectedPayer: string;
}

// Components
const PaymentCard: React.FC<PaymentCardProps> = ({ label, children, icon }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ExpenseDialog: React.FC<ExpenseDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editingItem,
}) => {
  const { currentEvent } = useEventStore();
  const [formData, setFormData] = React.useState<FormData>({
    itemName: editingItem?.itemName || "",
    amount: editingItem?.amount?.toString() || "",
    category: editingItem?.category || BillCategory.FOOD,
    paymentMethod: editingItem?.paymentMethod || PaymentMethod.SINGLE,
    payments: editingItem?.payments || [],
    liablePersons: editingItem?.liablePersons || [],
    selectedPayer: editingItem?.payments?.[0]?.personId || "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Helper functions
  const getNumericValue = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateTotalContributed = (): number => {
    return formData.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const calculateRemainingAmount = (): number => {
    return getNumericValue(formData.amount) - calculateTotalContributed();
  };

  // Event handlers
  const handleAmountChange = (value: string, personId?: string) => {
    if (personId) {
      const newPayments = [
        ...formData.payments.filter((p) => p.personId !== personId),
        {
          personId,
          amount: getNumericValue(value),
        },
      ];
      setFormData((prev) => ({ ...prev, payments: newPayments }));
    } else {
      setFormData((prev) => ({ ...prev, amount: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null); // Reset error state
    const totalAmount = getNumericValue(formData.amount);

    // 🔹 Validation: Ensure at least one liable person is selected
    if (formData.liablePersons.length === 0) {
      setFormError("Please select at least one liable person.");
      return;
    }

    let payments: { personId: string; amount: number }[] = [];

    switch (formData.paymentMethod) {
      case PaymentMethod.SINGLE:
        if (!formData.selectedPayer) {
          setFormError("Please select a payer for the expense.");
          return;
        }
        payments = [{ personId: formData.selectedPayer, amount: totalAmount }];
        break;

      case PaymentMethod.COMBINATION:
        payments = formData.payments.filter((p) => p.amount > 0);
        if (payments.length === 0) {
          setFormError("At least one person must contribute to the payment.");
          return;
        }
        if (calculateRemainingAmount() !== 0) {
          setFormError("Total amount does not match the sum of contributions.");
          return;
        }
        break;

      default:
        setFormError("Invalid payment method selected.");
        return;
    }

    // 🔹 If no errors, submit the form
    onSubmit({
      itemName: formData.itemName,
      amount: totalAmount,
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      payments,
      liablePersons: formData.liablePersons,
    });
  };

  const renderPaymentSection = () => {
    switch (formData.paymentMethod) {
      case PaymentMethod.SINGLE:
        return (
          <div className="space-y-2">
            <Label>Paid By</Label>
            <Select
              value={formData.selectedPayer}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, selectedPayer: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                {currentEvent?.participants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    {participant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case PaymentMethod.COMBINATION:
        const remainingAmount = calculateRemainingAmount();

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Distribution</h3>
              <div className="text-sm text-muted-foreground">
                Total: ${getNumericValue(formData.amount).toFixed(2)}
              </div>
            </div>

            <ScrollArea>
              <div className="gap-6  max-h-[33vh] overflow-y-auto">
                <PaymentCard
                  label="Individual Contributions"
                  icon={<DollarSign className="h-4 w-4" />}
                >
                  <div className="space-y-4">
                    {currentEvent?.participants.map((participant) => {
                      const payment = formData.payments.find(
                        (p) => p.personId === participant.id
                      );
                      const amount = payment?.amount || 0;
                      const percentage = formData.amount
                        ? (amount / getNumericValue(formData.amount)) * 100
                        : 0;

                      return (
                        <div key={participant.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <Label>{participant.name}</Label>
                            <span className="text-muted-foreground">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount || ""}
                            className="h-8"
                            onChange={(e) =>
                              handleAmountChange(e.target.value, participant.id)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </PaymentCard>
              </div>
            </ScrollArea>

            <div className="flex justify-between items-center px-4 py-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Remaining to allocate</span>
              <span
                className={`text-sm font-medium ${
                  remainingAmount !== 0 ? "text-destructive" : "text-green-600"
                }`}
              >
                ${remainingAmount.toFixed(2)}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit" : "Add"} Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={formData.itemName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    itemName: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value as BillCategory,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BillCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: value as PaymentMethod,
                    payments: [],
                    selectedPayer: "",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.SINGLE}>Single</SelectItem>
                  <SelectItem value={PaymentMethod.COMBINATION}>
                    Combination
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderPaymentSection()}

          <div className="space-y-2">
            <div className="flex items-center justify-start gap-2">
              <Label className="text-base">Split Between</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={
                    currentEvent?.participants.length ===
                      formData.liablePersons.length &&
                    formData.liablePersons.length > 0
                  }
                  onCheckedChange={(checked) => {
                    const allParticipantIds =
                      currentEvent?.participants.map((p) => p.id) || [];
                    setFormData((prev) => ({
                      ...prev,
                      liablePersons: checked ? allParticipantIds : [],
                    }));
                  }}
                />
                <Label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer hover:text-primary"
                >
                  Select All
                </Label>
              </div>
            </div>
            <ScrollArea className="max-h-[10vh] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentEvent?.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`participant-${participant.id}`}
                      checked={formData.liablePersons.includes(participant.id)}
                      onCheckedChange={(checked) => {
                        const newLiablePersons = checked
                          ? [...formData.liablePersons, participant.id]
                          : formData.liablePersons.filter(
                              (id) => id !== participant.id
                            );
                        setFormData((prev) => ({
                          ...prev,
                          liablePersons: newLiablePersons,
                        }));
                      }}
                    />
                    <Label
                      htmlFor={`participant-${participant.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {participant.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          {formError && (
            <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
              {formError}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingItem ? "Update" : "Add"} Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
