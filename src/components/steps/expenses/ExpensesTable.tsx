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
import { Pencil, Trash, Receipt, Users } from "lucide-react";
import { useEventStore } from "@/store/useEventStore";
import { BillItem } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

interface ExpensesViewProps {
  items: BillItem[];
  onEdit: (item: BillItem) => void;
  handleDelete: (item: BillItem) => void;
}

// Shared formatting functions
const useFormatters = () => {
  const { personIdtoName } = useEventStore();

  const formatPayments = (payments: { personId: string; amount: number }[]) => {
    const validPayments = payments.filter((p) => p.amount > 0);

    if (validPayments.length <= 2) {
      return (
        <div className="flex flex-wrap gap-1">
          {validPayments.map((p, i) => (
            <Badge key={i} variant="secondary">
              {personIdtoName(p.personId)!}{" "}
              <span className="font-bold">Rs.{p.amount.toFixed(2)}</span>
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-wrap gap-1 cursor-help">
              {validPayments.slice(0, 2).map((p, i) => (
                <Badge key={i} variant="secondary">
                  {personIdtoName(p.personId)!}{" "}
                  <span className="font-bold">Rs.{p.amount.toFixed(2)}</span>
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
                  <span className="font-bold">Rs.{p.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const formatLiablePersons = (personIds: string[]) => {
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

  return { formatPayments, formatLiablePersons };
};

// Desktop Table Component
const DesktopView = ({ items, onEdit, handleDelete }: ExpensesViewProps) => {
  const { formatPayments, formatLiablePersons } = useFormatters();

  return (
    <div className="hidden md:block">
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
                <TableCell>Rs.{Number(item.amount).toFixed(2)}</TableCell>
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
                    onClick={() => handleDelete(item)}
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
                No expenses added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Mobile Card Component
const MobileView = ({ items, onEdit, handleDelete }: ExpensesViewProps) => {
  const { formatPayments, formatLiablePersons } = useFormatters();

  return (
    <div className="md:hidden space-y-4">
      {items.length ? (
        items.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header with number and actions */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        #{index + 1}
                      </span>
                      <h3 className="font-medium">{item.itemName || "-"}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge>{item.category}</Badge>
                      <Badge variant="secondary">
                        Rs.{Number(item.amount).toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                      onClick={() => handleDelete(item)}
                      className="text-destructive "
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Payment details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Receipt className="h-4 w-4 mt-1 text-gray-500" />
                    <div className="space-y-1">
                      <div className="font-medium">Payment</div>
                      <div>{item.paymentMethod}</div>
                      <div>{formatPayments(item.payments)}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-1 text-gray-500" />
                    <div className="space-y-1">
                      <div className="font-medium">Split Between</div>
                      <div>{formatLiablePersons(item.liablePersons)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No expenses added yet.
        </div>
      )}
    </div>
  );
};

// Main Component
const ExpensesTable = ({ items, onEdit, handleDelete }: ExpensesViewProps) => {
  return (
    <>
      <DesktopView items={items} onEdit={onEdit} handleDelete={handleDelete} />
      <MobileView items={items} onEdit={onEdit} handleDelete={handleDelete} />
    </>
  );
};

export default ExpensesTable;
