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
import { Skeleton } from "@/components/ui/skeleton";
import { getAllEvent } from "@/firebase/event";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/types/types";

// Loading skeleton for desktop view
const TableLoadingSkeleton = () => (
  <div className="hidden md:block">
    <div className="space-y-4">
      <Skeleton className="h-8 w-[250px]" />
      <div className="border rounded-lg">
        <div className="divide-y">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center p-4 space-x-4">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Loading skeleton for mobile view
const CardLoadingSkeleton = () => (
  <div className="block md:hidden space-y-4">
    <Skeleton className="h-8 w-[200px]" />
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="w-full">
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-[100px]" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
      <div className="p-6">
        <TableLoadingSkeleton />
        <CardLoadingSkeleton />
      </div>
    );
  }

  // Desktop view
  const DesktopView = () => (
    <div className="hidden md:block">
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
                <TableCell className="font-medium">
                  {event.id || "Unnamed Event"}
                </TableCell>
                <TableCell>
                  {event.details?.date
                    ? new Date(event.details.date).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  ${event.report?.totalAmount?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => router.push(`./reports/${event.id}`)}
                    variant="outline"
                    size="sm"
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

  // Mobile view
  const MobileView = () => (
    <div className="block md:hidden space-y-4">
      {events.length > 0 ? (
        events.map((event, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">
                    {event.id || "Unnamed Event"}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Date:{" "}
                  {event.details?.date
                    ? new Date(event.details.date).toLocaleDateString()
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  Amount: ${event.report?.totalAmount?.toFixed(2) || "0.00"}
                </div>
                <Button
                  onClick={() => router.push(`./reports/${event.id}`)}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  View Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-4">No events found.</div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 my-2">
        Past Events
      </h1>
      <DesktopView />
      <MobileView />
    </div>
  );
};

export default EventList;
