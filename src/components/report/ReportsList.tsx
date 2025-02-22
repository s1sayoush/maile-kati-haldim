"use client";

import React, { useState } from "react";
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
import { deleteEvent, getAllUserEvents } from "@/firebase/event";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  FileText,
  Calendar,
} from "lucide-react";
import { Event } from "@/types/types";
import { useUser } from "@/providers/UserContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";

// Loading skeletons remain the same...
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
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CardLoadingSkeleton = () => (
  <div className="block md:hidden space-y-4">
    <Skeleton className="h-8 w-[200px]" />
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="w-full">
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-[100px]" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const EventList = () => {
  const { userDetails, loading: userLoading } = useUser();
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["userEvents", userDetails?.uid],
    queryFn: async () => {
      if (!userDetails?.uid) return [];
      return await getAllUserEvents(userDetails.uid);
    },
    enabled: !!userDetails?.uid,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({
    isOpen: false,
    event: null,
  });

  const handleEdit = (eventId: string) => {
    router.push(`./events/edit/${eventId}`);
  };

  const handleDelete = async (event: Event) => {
    setDeleteDialog({
      isOpen: true,
      event,
    });
  };

  const confirmDelete = async () => {
    if (deleteDialog.event) {
      await deleteEvent(deleteDialog.event.id!);

      queryClient.invalidateQueries({
        queryKey: ["userEvents", userDetails?.uid],
      });
    }
    setDeleteDialog({
      isOpen: false,
      event: null, // Reset the state after deletion
    });
  };
  if (isLoading || userLoading) {
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
      <Table className="border rounded-lg">
        <TableHeader className="bg-card">
          <TableRow>
            <TableHead className="px-4 py-2">Event Name</TableHead>
            <TableHead className="px-4 py-2">Location</TableHead>
            <TableHead className="px-4 py-2">Date</TableHead>
            <TableHead className="px-4 py-2">Participants</TableHead>
            <TableHead className="px-4 py-2">Total Amount</TableHead>
            <TableHead className="px-4 py-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length > 0 ? (
            events.map((event, index) => (
              <TableRow key={index}>
                <TableCell className="px-4 py-2 font-medium">
                  {event.details?.eventTitle || "Unnamed Event"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {event.details?.location || "No location"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {event.details?.date
                    ? new Date(event.details.date).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {event.participants?.length || 0}
                </TableCell>
                <TableCell className="px-4 py-2">
                  ${event.report?.totalAmount?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell className="px-4 py-2 space-x-2">
                  <Button
                    onClick={() =>
                      router.push(`/dashboard/reports/${event.id}`)
                    }
                    variant="outline"
                    size="sm"
                  >
                    View Report
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(event.id!)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(event)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="px-4 py-2 text-center">
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
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className=" p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {event.details?.eventTitle || "Unnamed Event"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {event.details?.date
                        ? new Date(event.details.date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(event.id!)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(event)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {event.details?.location || "No location"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      {event.participants?.length || 0} participants
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">
                      ${event.report?.totalAmount?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => router.push(`dashboard/reports/${event.id}`)}
                    variant="default"
                    size="sm"
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No events found</p>
        </div>
      )}
    </div>
  );
  return (
    <div className="p-2">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 my-2">
        Past Events
      </h1>
      <DesktopView />
      <MobileView />

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteDialog((prev) => ({ ...prev, isOpen }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <h3>Are you sure you want to remove this item?</h3>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This action cannot be undone. You are about to delete the item:{" "}
            <strong>
              {deleteDialog.event?.details?.eventTitle}{" "}
              {deleteDialog.event?.details?.date
                ? new Date(deleteDialog.event.details.date).toLocaleDateString()
                : "N/A"}
            </strong>
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteDialog({ isOpen: false, event: null })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventList;
