import { Event } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import OverviewTab from "./OverviewTab";
import ExpensesBreakdownTab from "./ExpensesBreakdownTab";
import IndividualAnalysisTab from "./IndividualAnalysisTabDashboard";
import SettlementPlanTab from "./SettlementPlanTab";

const ExpenseAnalysisDashboard = ({ data }: { data: Event }) => {
  console.log(JSON.stringify(data, null, 2));
  const { participants, details, items, report } = data;

  return (
    <div className="p-6">
      {/* Header Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{details.eventTitle}</CardTitle>
          <CardDescription>
            {details.date ? details.date.toString() : ""} • {details.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div>
              <p className="text-sm text-gray-500">Total Expense</p>
              <p className="text-2xl font-bold">${report.totalAmount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              <p className="text-2xl font-bold">{participants.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses Breakdown</TabsTrigger>
          <TabsTrigger value="individual">Individual Analysis</TabsTrigger>
          <TabsTrigger value="settlement">Settlement Plan</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="overview">
          <OverviewTab data={data as Event} />
        </TabsContent>
        <TabsContent value="expenses">
          <ExpensesBreakdownTab data={data as Event} />
        </TabsContent>
        <TabsContent value="individual">
          <IndividualAnalysisTab data={data} />
        </TabsContent>
        <TabsContent value="settlement">
          <SettlementPlanTab data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseAnalysisDashboard;
