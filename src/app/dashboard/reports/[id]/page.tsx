"use client";
import ExpenseAnalysisDashboard from "@/components/report/ExpenseAnalysisDashboard";
import { getEvent } from "@/firebase/event";
import { Event } from "@/types/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Report = () => {
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Event | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const details = await getEvent(id as string);
        setData(details!);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mx-auto">
      {loading ? (
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
