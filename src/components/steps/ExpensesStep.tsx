import React, { useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { BillItem } from "@/types/types";
import ExpensesTable from "./expenses/ExpensesTable";
import ExpenseDialog from "./expenses/ExpenseDialog";
import { ScrollArea } from "../ui/scroll-area";

const ExpensesStep = () => {
  const { currentEvent, addBillItem, updateBillItem, removeBillItem } =
    useEventStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItem | null>(null);

  const handleAddOrUpdateItem = (formData: Omit<BillItem, "id">) => {
    if (editingItem) {
      updateBillItem(editingItem.id, formData);
    } else {
      addBillItem(formData);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Expenses</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage event expenses and track payments
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setIsDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Receipt className="h-4 w-4" /> Add Expense
        </Button>
      </div>

      <ExpensesTable
        items={currentEvent?.items || []}
        onEdit={(item) => {
          setEditingItem(item);
          setIsDialogOpen(true);
        }}
        onDelete={removeBillItem}
      />

      <ExpenseDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleAddOrUpdateItem}
        editingItem={editingItem!}
      />
    </div>
  );
};

export default ExpensesStep;
