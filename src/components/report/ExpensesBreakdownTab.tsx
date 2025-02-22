import {
  BarChart,
  Bar,
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
  TableCaption,
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
} from "../ui/card";

import { Event } from "@/types/types";

const ExpensesBreakdownTab = ({ data }: { data: Event }) => {
  const { items } = data;

  // Prepare data for the bar chart (category-wise breakdown)
  const categoryData = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.keys(categoryData).map((category) => ({
    category,
    total: categoryData[category],
  }));

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Category-wise Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of all expenses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid By</TableHead>
                <TableHead>Split Between</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.amount}</TableCell>
                  <TableCell>
                    {
                      data.participants.find(
                        (p) => p.id === item.payments[0].personId
                      )?.name
                    }
                  </TableCell>
                  <TableCell>
                    {item.liablePersons
                      .map(
                        (personId) =>
                          data.participants.find((p) => p.id === personId)?.name
                      )
                      .join(", ")}
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

export default ExpensesBreakdownTab;
