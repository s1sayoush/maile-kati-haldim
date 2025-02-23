import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExpenseAnalysisDashboardSkeleton = () => {
  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "expenses", label: "Expenses Breakdown" },
    { value: "individual", label: "Individual Analysis" },
    { value: "settlement", label: "Settlement Plan" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="p-4 bg-card rounded-lg">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Select Skeleton */}
      <div className="block md:hidden">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Desktop Tabs Skeleton */}
      <div className="hidden md:block">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} disabled>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content Skeleton */}
      <div className="mt-6 space-y-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[150px] rounded-lg" />
          <Skeleton className="h-[150px] rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalysisDashboardSkeleton;
