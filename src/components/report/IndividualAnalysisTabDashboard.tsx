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
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Event } from "@/types/types";

const IndividualAnalysisTab = ({ data }: { data: Event }) => {
  const { participants, report } = data;

  // Calculate group average spending
  const totalSpent = Object.values(report.paidByPerson).reduce(
    (acc, amount) => acc + amount,
    0
  );
  const groupAverage = totalSpent / participants.length;

  // Prepare data for the bar chart (individual vs. group average)
  const barData = participants.map((participant) => ({
    name: participant.name,
    totalSpent: report.paidByPerson[participant.id],
    groupAverage,
  }));

  // Prepare data for the balance chart (net positions)
  const balanceData = participants.map((participant) => ({
    name: participant.name,
    netBalance: report.netBalances![participant.id],
  }));

  return (
    <div className="space-y-6">
      {/* Per-person Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map((participant) => (
          <Card key={participant.id}>
            <CardHeader>
              <CardTitle>{participant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Total Paid:</span> $
                  {report.paidByPerson[participant.id]}
                </p>
                <p>
                  <span className="font-medium">Total Owed:</span> $
                  {report.owedByPerson[participant.id]}
                </p>
                <p>
                  <span className="font-medium">Net Balance:</span>{" "}
                  <span
                    className={
                      report.netBalances![participant.id] >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    ${report.netBalances![participant.id]}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart: Individual vs. Group Average */}
      <Card>
        <CardHeader>
          <CardTitle>Spending vs. Group Average</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSpent" fill="#8884d8" name="Total Spent" />
                <Bar
                  dataKey="groupAverage"
                  fill="#82ca9d"
                  name="Group Average"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Balance Chart: Net Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Net Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="netBalance" name="Net Balance" fill="#8884d8">
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
  );
};

export default IndividualAnalysisTab;
