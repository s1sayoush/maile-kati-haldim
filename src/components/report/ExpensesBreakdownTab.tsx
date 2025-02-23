import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Event } from "@/types/types";
import { Receipt, Users } from "lucide-react";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

const ExpensesBreakdownTab = ({ data }: { data: Event }) => {
  const { items, participants } = data;

  // Helper function to format payments
  const formatPayments = (payments: { personId: string; amount: number }[]) => {
    const validPayments = payments.filter((p) => p.amount > 0);

    if (validPayments.length <= 2) {
      return (
        <div className="flex flex-wrap gap-1">
          {validPayments.map((p, i) => (
            <Badge key={i} variant="secondary">
              {participants.find((person) => person.id === p.personId)?.name}{" "}
              <span className="font-bold">Rs.{p.amount.toFixed(2)}</span>
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-wrap gap-1 cursor-help">
              {validPayments.slice(0, 2).map((p, i) => (
                <Badge key={i} variant="secondary">
                  {
                    participants.find((person) => person.id === p.personId)
                      ?.name
                  }{" "}
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
                  <span>
                    {
                      participants.find((person) => person.id === p.personId)
                        ?.name
                    }
                  </span>
                  <span className="font-bold">Rs.{p.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    );
  };

  // Helper function to format liable persons
  const formatLiablePersons = (personIds: string[]) => {
    if (personIds.length <= 3) {
      return (
        <div className="flex flex-wrap gap-1">
          {personIds.map((id, i) => (
            <Badge key={i} variant="outline">
              {participants.find((p) => p.id === id)?.name}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-wrap gap-1 cursor-help">
              {personIds.slice(0, 3).map((id, i) => (
                <Badge key={i} variant="outline">
                  {participants.find((p) => p.id === id)?.name}
                </Badge>
              ))}
              <Badge variant="outline">+{personIds.length - 3} more</Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1 p-1">
              {personIds.map((id, i) => (
                <div key={i}>{participants.find((p) => p.id === id)?.name}</div>
              ))}
            </div>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    );
  };

  // Prepare data for charts
  const categoryData = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([category, total]) => ({
    category,
    total,
    percentage: (
      (total / items.reduce((sum, item) => sum + Number(item.amount), 0)) *
      100
    ).toFixed(1),
  }));

  const paymentMethodData = items.reduce((acc, item) => {
    acc[item.paymentMethod] =
      (acc[item.paymentMethod] || 0) + Number(item.amount);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(paymentMethodData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category-wise Expenses</CardTitle>
            <CardDescription>
              Distribution of expenses across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="font-medium">
                              {payload[0].payload.category}
                            </p>
                            <p>Rs.{Number(payload[0].value).toFixed(2)}</p>
                            <p>{payload[0].payload.percentage}% of total</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(1)}%)`
                    }
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Expense Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Comprehensive list of all expenses</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead>Split Between</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.itemName || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge>{item.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      Rs.{Number(item.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>{item.paymentMethod}</TableCell>
                    <TableCell>{formatPayments(item.payments)}</TableCell>
                    <TableCell>
                      {formatLiablePersons(item.liablePersons)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {items.map((item, index) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Header with item details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          #{index + 1}
                        </span>
                        <h3 className="font-medium">{item.itemName || "-"}</h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge>{item.category}</Badge>
                        <Badge variant="secondary">
                          Rs.{Number(item.amount).toFixed(2)}
                        </Badge>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesBreakdownTab;
