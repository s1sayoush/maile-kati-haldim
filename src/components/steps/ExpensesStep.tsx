import { useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { BillItem } from "@/types/types";
import ExpensesTable from "./expenses/ExpensesTable";
import ExpenseDialog from "./expenses/ExpenseDialog";
import { Alert } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const ExpensesStep = () => {
  const {
    currentEvent,
    addBillItem,
    updateBillItem,
    removeBillItem,
    updateReport,
  } = useEventStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItem | null>(null);

  // State for the delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: BillItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const handleAddOrUpdateItem = (formData: Omit<BillItem, "id">) => {
    if (editingItem) {
      updateBillItem(editingItem.id, formData);
    } else {
      addBillItem(formData);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
    console.log("trying to update report");
    updateReport();
  };

  // Handle item deletion
  const handleDelete = (item: BillItem) => {
    setDeleteDialog({
      isOpen: true,
      item, // Store the item to be deleted
    });
  };

  console.log("currentItem");

  // Confirm deletion
  const confirmDelete = () => {
    if (deleteDialog.item) {
      removeBillItem(deleteDialog.item.id); // Pass the correct item ID to remove
    }
    setDeleteDialog({
      isOpen: false,
      item: null, // Reset the state after deletion
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Expenses</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
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
        handleDelete={handleDelete} // Pass delete handler
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteDialog((prev) => ({ ...prev, isOpen }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <h3>Are you sure you want to remove this item?</h3>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This action cannot be undone. You are about to delete the item:{" "}
            <strong>{deleteDialog.item?.itemName}</strong>
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteDialog({ isOpen: false, item: null })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpensesStep;
