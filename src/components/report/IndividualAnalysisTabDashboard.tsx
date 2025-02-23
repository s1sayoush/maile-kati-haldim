import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import { Event } from "@/types/types";

const IndividualAnalysisTab = ({ data }: { data: Event }) => {
  const { participants, report } = data;

  // Calculate group statistics
  const totalSpent = Object.values(report.paidByPerson).reduce(
    (acc, amount) => acc + amount,
    0
  );
  const groupAverage = totalSpent / participants.length;
  const maxSpent = Math.max(...Object.values(report.paidByPerson));
  const minSpent = Math.min(...Object.values(report.paidByPerson));

  // Helper function to calculate percentage difference from average
  const getPercentageDiff = (value: number) => {
    return (((value - groupAverage) / groupAverage) * 100).toFixed(1);
  };

  // Prepare data for charts
  const spendingData = participants.map((participant) => ({
    name: participant.name,
    totalSpent: report.paidByPerson[participant.id],
    groupAverage,
    percentageFromAverage: Number(
      getPercentageDiff(report.paidByPerson[participant.id])
    ),
  }));

  const balanceData = participants.map((participant) => ({
    name: participant.name,
    netBalance: report.netBalances![participant.id],
    totalPaid: report.paidByPerson[participant.id],
    totalOwed: report.owedByPerson[participant.id],
  }));

  // Calculate contribution percentages for pie chart
  const contributionData = participants.map((participant) => ({
    name: participant.name,
    value: report.paidByPerson[participant.id],
    percentage: (
      (report.paidByPerson[participant.id] / totalSpent) *
      100
    ).toFixed(1),
  }));

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
    "#d88484",
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs.{totalSpent.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              Avg. Rs.{groupAverage.toFixed(2)} per person
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Highest Spender</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs.{maxSpent.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              {
                participants.find((p) => report.paidByPerson[p.id] === maxSpent)
                  ?.name
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Lowest Spender</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs.{minSpent.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              {
                participants.find((p) => report.paidByPerson[p.id] === minSpent)
                  ?.name
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map((participant) => {
          const netBalance = report.netBalances![participant.id];
          const totalPaid = report.paidByPerson[participant.id];
          const percentFromAvg = Number(getPercentageDiff(totalPaid));

          return (
            <Card key={participant.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{participant.name}</CardTitle>
                  <Badge
                    variant={netBalance >= 0 ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {netBalance >= 0 ? "To Receive" : "To Pay"}
                  </Badge>
                </div>
                <CardDescription>
                  {percentFromAvg > 0 ? (
                    <span className="flex items-center text-green-600">
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                      {Math.abs(percentFromAvg)}% above average
                    </span>
                  ) : percentFromAvg < 0 ? (
                    <span className="flex items-center text-red-600">
                      <ArrowDownIcon className="w-4 h-4 mr-1" />
                      {Math.abs(percentFromAvg)}% below average
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-600">
                      <MinusIcon className="w-4 h-4 mr-1" />
                      At average
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Paid
                    </span>
                    <span className="font-medium">
                      Rs.{totalPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Owed
                    </span>
                    <span className="font-medium">
                      Rs.{report.owedByPerson[participant.id].toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Net Balance</span>
                    <span
                      className={`font-bold ${
                        netBalance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Rs.{Math.abs(netBalance).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Spending Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Contribution Distribution</CardTitle>
            <CardDescription>
              Share of total expenses by each participant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                  >
                    {contributionData.map((_, index) => (
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

        {/* Net Balances */}
        <Card>
          <CardHeader>
            <CardTitle>Net Balances</CardTitle>
            <CardDescription>
              Amount to be received (+) or paid (-)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="font-medium">{data.name}</p>
                            <p>Paid: Rs.{data.totalPaid.toFixed(2)}</p>
                            <p>Owed: Rs.{data.totalOwed.toFixed(2)}</p>
                            <p
                              className={
                                data.netBalance >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              Net: Rs.{data.netBalance.toFixed(2)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="netBalance" name="Net Balance">
                    {balanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.netBalance >= 0 ? "#82ca9d" : "#ff8042"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndividualAnalysisTab;
