import React from "react";
import { Event } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OverviewTab from "./OverviewTab";
import ExpensesBreakdownTab from "./ExpensesBreakdownTab";
import IndividualAnalysisTab from "./IndividualAnalysisTabDashboard";
import SettlementPlanTab from "./SettlementPlanTab";

const ExpenseAnalysisDashboard = ({ data }: { data: Event }) => {
  const [activeTab, setActiveTab] = React.useState("overview");
  const { participants, details, report } = data;

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "expenses", label: "Expenses Breakdown" },
    { value: "individual", label: "Individual Analysis" },
    { value: "settlement", label: "Settlement Plan" },
  ];

  const renderTabContent = (value: string) => {
    switch (value) {
      case "overview":
        return <OverviewTab data={data} />;
      case "expenses":
        return <ExpensesBreakdownTab data={data} />;
      case "individual":
        return <IndividualAnalysisTab data={data} />;
      case "settlement":
        return <SettlementPlanTab data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold">
            {details.eventTitle}
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            {details.date ? new Date(details.date).toLocaleDateString() : ""} •{" "}
            {details.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-lg">
              <p className="text-sm text-gray-500">Total Expense</p>
              <p className="text-xl md:text-2xl font-bold">
                Rs.{report.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <p className="text-sm text-gray-500">Participants</p>
              <p className="text-xl md:text-2xl font-bold">
                {participants.length}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <p className="text-sm text-gray-500">Per Person</p>
              <p className="text-xl md:text-2xl font-bold">
                Rs.{(report.totalAmount / participants.length).toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <p className="text-sm text-gray-500">Items</p>
              <p className="text-xl md:text-2xl font-bold">
                {data.items.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Select */}
      <div className="block md:hidden">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderTabContent(activeTab)}</div>
    </div>
  );
};

export default ExpenseAnalysisDashboard;
