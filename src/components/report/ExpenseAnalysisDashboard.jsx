import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExpenseAnalysisDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState("charts");

  const eventData = data || {
    details: {
      eventTitle: "rajin birthday",
      location: "Nagarkot",
      coordinates: [27.718508, 85.51973],
    },
    participants: [
      {
        id: "553Mk7dxjbmajJQ3ts6qW",
        name: "tika",
        phone: "1234567890",
        email: "tgaire13@gmail.com",
      },
      {
        id: "euUBctKnUbz55YkPWFhje",
        name: "sanatan",
        phone: "1234567900",
        email: "sanatan@gmail.com",
      },
      {
        id: "8LvQsIpJOKYMt3kBs1Mvg",
        name: "sdfds",
        phone: "1234567890",
        email: "alexander.smith@example.com",
      },
      {
        id: "sOOS5wf246ZdSKcmmkWRu",
        name: "suraj",
        phone: "9862785168",
        email: "surajpathak2057@gmail.com",
      },
      {
        id: "W_-aH-snNgdLuG-e7T-E5",
        name: "Sayoush Subedi",
        phone: "9867785168",
        email: "sayoushstark@gmail.com",
      },
    ],
    items: [
      {
        itemName: "JD",
        amount: 70000,
        category: "Drinks",
        paymentMethod: "Single",
        payments: [
          {
            personId: "553Mk7dxjbmajJQ3ts6qW",
            amount: 70000,
          },
        ],
        liablePersons: [
          "553Mk7dxjbmajJQ3ts6qW",
          "euUBctKnUbz55YkPWFhje",
          "8LvQsIpJOKYMt3kBs1Mvg",
          "sOOS5wf246ZdSKcmmkWRu",
          "W_-aH-snNgdLuG-e7T-E5",
        ],
        id: "QqBrT9Yw1D9xWtKu95fxO",
      },
      {
        itemName: "Momo",
        amount: 1000,
        category: "Food",
        paymentMethod: "Single",
        payments: [
          {
            personId: "sOOS5wf246ZdSKcmmkWRu",
            amount: 1000,
          },
        ],
        liablePersons: [
          "553Mk7dxjbmajJQ3ts6qW",
          "euUBctKnUbz55YkPWFhje",
          "8LvQsIpJOKYMt3kBs1Mvg",
          "sOOS5wf246ZdSKcmmkWRu",
          "W_-aH-snNgdLuG-e7T-E5",
        ],
        id: "8y5I9HPsMCXz-DlB8Tsj7",
      },
      {
        itemName: "Hotel",
        amount: 10000,
        category: "Accomodation",
        paymentMethod: "Combination",
        payments: [
          {
            personId: "W_-aH-snNgdLuG-e7T-E5",
            amount: 1000,
          },
          {
            personId: "euUBctKnUbz55YkPWFhje",
            amount: 9000,
          },
        ],
        liablePersons: [
          "553Mk7dxjbmajJQ3ts6qW",
          "euUBctKnUbz55YkPWFhje",
          "8LvQsIpJOKYMt3kBs1Mvg",
          "sOOS5wf246ZdSKcmmkWRu",
          "W_-aH-snNgdLuG-e7T-E5",
        ],
        id: "HUE84OzuCslFCxA6i7d1m",
      },
    ],
    report: {
      totalAmount: 81000,
      deductible: {
        amount: 1000,
        reason: "hotel discount",
      },
      paidByPerson: {
        "553Mk7dxjbmajJQ3ts6qW": 70000,
        euUBctKnUbz55YkPWFhje: 9000,
        "8LvQsIpJOKYMt3kBs1Mvg": 0,
        sOOS5wf246ZdSKcmmkWRu: 1000,
        "W_-aH-snNgdLuG-e7T-E5": 1000,
      },
      owedByPerson: {
        "553Mk7dxjbmajJQ3ts6qW": 16200,
        euUBctKnUbz55YkPWFhje: 16200,
        "8LvQsIpJOKYMt3kBs1Mvg": 16200,
        sOOS5wf246ZdSKcmmkWRu: 16200,
        "W_-aH-snNgdLuG-e7T-E5": 16200,
      },
      finalTotal: 80000,
      finalOwedByPerson: {
        "553Mk7dxjbmajJQ3ts6qW": 16000,
        euUBctKnUbz55YkPWFhje: 16000,
        "8LvQsIpJOKYMt3kBs1Mvg": 16000,
        sOOS5wf246ZdSKcmmkWRu: 16000,
        "W_-aH-snNgdLuG-e7T-E5": 16000,
      },
      netBalances: {
        "553Mk7dxjbmajJQ3ts6qW": 54000,
        euUBctKnUbz55YkPWFhje: -7000,
        "8LvQsIpJOKYMt3kBs1Mvg": -16000,
        sOOS5wf246ZdSKcmmkWRu: -15000,
        "W_-aH-snNgdLuG-e7T-E5": -15000,
      },
    },
  };

  // Prepare data for contributor chart (who contributed most)
  const contributionData = Object.entries(eventData.report.paidByPerson)
    .map(([id, amount]) => {
      const participant = eventData.participants.find((p) => p.id === id);
      return {
        name: participant?.name || id,
        amount: Number(amount),
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Prepare data for net balances chart
  const netBalanceData = Object.entries(eventData.report.netBalances)
    .map(([id, balance]) => {
      const participant = eventData.participants.find((p) => p.id === id);
      return {
        name: participant?.name || id,
        balance: Number(balance),
        color: Number(balance) >= 0 ? "#10b981" : "#ef4444",
      };
    })
    .sort((a, b) => b.balance - a.balance);

  // Prepare data for remaining payments chart (who still needs to pay)
  const remainingPaymentData = Object.entries(eventData.report.netBalances)
    .filter(([_, balance]) => Number(balance) < 0)
    .map(([id, balance]) => {
      const participant = eventData.participants.find((p) => p.id === id);
      return {
        name: participant?.name || id,
        amount: Math.abs(Number(balance)),
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Prepare data for categories pie chart
  const categoryData = eventData.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    acc[item.category] += item.amount;
    return acc;
  }, {});

  const categoryPieData = Object.entries(categoryData).map(
    ([category, amount]) => ({
      name: category,
      value: Number(amount),
    })
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="bg-secondary p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          {eventData.details.eventTitle}
        </h1>
        <p className="text-muted-foreground">
          Location: {eventData.details.location} | Total Amount:{" "}
          {formatCurrency(eventData.report.totalAmount)} | Final Total:{" "}
          {formatCurrency(eventData.report.finalTotal)} | Discount:{" "}
          {formatCurrency(eventData.report.deductible.amount)} (
          {eventData.report.deductible.reason})
        </p>
      </div>

      {/* Custom Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "charts"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("charts")}
        >
          Charts
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "summary"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("summary")}
        >
          Summary Tables
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "details"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Expense Details
        </button>
      </div>

      {/* Charts Tab */}
      {activeTab === "charts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Who Contributed Most</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contributionData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => `Contributor: ${label}`}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Net Balance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Net Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={netBalanceData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => `Person: ${label}`}
                    />
                    <Bar
                      dataKey="balance"
                      fill="#10b981"
                      shape={(props) => {
                        const { x, y, width, height, balance } = props;
                        const color = balance >= 0 ? "#10b981" : "#ef4444";
                        const actualY = balance >= 0 ? y : y + height;
                        const actualHeight = Math.abs(height);

                        return (
                          <rect
                            x={x}
                            y={actualY}
                            width={width}
                            height={actualHeight}
                            fill={color}
                            radius={[2, 2, 0, 0]}
                          />
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Remaining Payment Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Who Still Needs to Pay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={remainingPaymentData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => `Person: ${label}`}
                    />
                    <Bar dataKey="amount" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Tables Tab */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* Payment Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Person</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Owed</TableHead>
                      <TableHead className="text-right">Net Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventData.participants.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell className="font-medium">
                          {person.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            eventData.report.paidByPerson[person.id] || 0
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            eventData.report.finalOwedByPerson[person.id] || 0
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            eventData.report.netBalances[person.id] >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(
                            eventData.report.netBalances[person.id] || 0
                          )}
                        </TableCell>
                        <TableCell>
                          {eventData.report.netBalances[person.id] > 0 ? (
                            <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              To be paid back
                            </span>
                          ) : eventData.report.netBalances[person.id] < 0 ? (
                            <span className="inline-flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              Needs to pay
                            </span>
                          ) : (
                            <span className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                              Settled
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Category Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(categoryData).map(
                      ([category, amount], index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {category}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {(
                              (Number(amount) / eventData.report.totalAmount) *
                              100
                            ).toFixed(1)}
                            %
                          </TableCell>
                        </TableRow>
                      )
                    )}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(eventData.report.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        100%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expense Details Tab */}
      {activeTab === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Split Between</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventData.items.map((item) => {
                    const paidBy = item.payments
                      .map((payment) => {
                        const person = eventData.participants.find(
                          (p) => p.id === payment.personId
                        );
                        return `${
                          person?.name || payment.personId
                        } (${formatCurrency(payment.amount)})`;
                      })
                      .join(", ");

                    const splitBetween = item.liablePersons
                      .map((personId) => {
                        const person = eventData.participants.find(
                          (p) => p.id === personId
                        );
                        return person?.name || personId;
                      })
                      .join(", ");

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.itemName}
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell>{item.paymentMethod}</TableCell>
                        <TableCell>{paidBy}</TableCell>
                        <TableCell className="text-sm">
                          {splitBetween}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExpenseAnalysisDashboard;
