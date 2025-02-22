"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvent } from "@/firebase/event";
import { useParams } from "next/navigation";
import React from "react";
import { Event } from "@/types/types";
import ExpenseAnalysisDashboard from "@/components/report/ExpenseAnalysisDashboard";

const Report = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const cachedEvent = queryClient.getQueryData(["userEvents", id]);

  const { data, isLoading } = useQuery({
    queryKey: ["userEvents", id],
    queryFn: () => getEvent(id as string),
    enabled: !!id && !cachedEvent,
    initialData: cachedEvent as Event,
  });

  return (
    <div className="container mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : data ? (
        <ExpenseAnalysisDashboard data={data} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default Report;
