"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAllEvent } from "@/firebase/event";

const OldReports = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Start as true

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvent();
        setEvents(data as any);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-semibold">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Old Reports</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length > 0 ? (
            events.map((event, index) => (
              <TableRow key={index}>
                <TableCell>{event.id || "Unnamed Event"}</TableCell>
                <TableCell>{event.details?.date || "N/A"}</TableCell>
                <TableCell>
                  ${event.report?.totalAmount?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => router.push(`./reports/${event.id}`)}
                    variant="outline"
                  >
                    View Report
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No events found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OldReports;
