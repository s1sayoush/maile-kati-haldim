import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useEventStore } from "@/store/useEventStore";
import { BillItem } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExpensesTableProps {
  items: BillItem[];
  onEdit: (item: BillItem) => void;
  onDelete: (id: string) => void;
}

const ExpensesTable = ({ items, onEdit, onDelete }: ExpensesTableProps) => {
  const { personIdtoName } = useEventStore();

  const formatPayments = (payments: { personId: string; amount: number }[]) => {
    const validPayments = payments.filter((p) => p.amount > 0);

    // If the list is short, show it directly
    if (validPayments.length <= 2) {
      return (
        <div className="flex flex-wrap gap-1">
          {validPayments.map((p, i) => (
            <Badge key={i} variant="secondary">
              {personIdtoName(p.personId)!}{" "}
              <span className="font-bold">${p.amount.toFixed(2)}</span>
            </Badge>
          ))}
        </div>
      );
    }

    // If the list is long, show the first two with a "+X more" that expands on hover
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-wrap gap-1 cursor-help">
              {validPayments.slice(0, 2).map((p, i) => (
                <Badge key={i} variant="secondary">
                  {personIdtoName(p.personId)!}
                  <span className="font-bold">${p.amount.toFixed(2)}</span>
                </Badge>
              ))}
              <Badge variant="outline">+{validPayments.length - 2} more</Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="flex flex-col gap-1 p-1">
              {validPayments.map((p, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <span>{personIdtoName(p.personId)!}</span>
                  <span className="font-bold">${p.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const formatLiablePersons = (personIds: string[]) => {
    // If the list is short, show it directly
    if (personIds.length <= 3) {
      return (
        <div className="flex flex-wrap gap-1">
          {personIds.map((id, i) => (
            <Badge key={i} variant="outline">
              {personIdtoName(id)!}
            </Badge>
          ))}
        </div>
      );
    }

    // If the list is long, show the first three with a "+X more" that expands on hover
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-wrap gap-1 cursor-help">
              {personIds.slice(0, 3).map((id, i) => (
                <Badge key={i} variant="outline">
                  {personIdtoName(id)!}
                </Badge>
              ))}
              <Badge variant="outline">+{personIds.length - 3} more</Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1 p-1">
              {personIds.map((id, i) => (
                <div key={i}>{personIdtoName(id)!}</div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">SN</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Paid By</TableHead>
          <TableHead>Split Between</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length ? (
          items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">
                {item.itemName || "-"}
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>${Number(item.amount).toFixed(2)}</TableCell>
              <TableCell>{item.paymentMethod}</TableCell>
              <TableCell>{formatPayments(item.payments)}</TableCell>
              <TableCell>{formatLiablePersons(item.liablePersons)}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(item.id)}
                  className="text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-center py-8 text-muted-foreground"
            >
              No expenses added yet. Click &quot;Add Expense&quot; to get
              started.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ExpensesTable;
