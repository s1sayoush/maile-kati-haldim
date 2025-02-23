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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Plus,
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

const TableLoadingSkeleton = () => (
  <div className="hidden md:block">
    <Card>
      <CardContent className="space-y-4 p-6">
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
      </CardContent>
    </Card>
  </div>
);

const CardLoadingSkeleton = () => (
  <div className="block md:hidden space-y-4">
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-8 w-[200px] mb-6" />
        <div className="space-y-4">
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
      </CardContent>
    </Card>
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
    router.push(`dashboard/events?eventId=${eventId}&edit=true`);
  };

  const handleDelete = async (event: Event) => {
    setDeleteDialog({ isOpen: true, event });
  };

  const confirmDelete = async () => {
    if (deleteDialog.event) {
      await deleteEvent(deleteDialog.event.id!);
      queryClient.invalidateQueries({
        queryKey: ["userEvents", userDetails?.uid],
      });
    }
    setDeleteDialog({ isOpen: false, event: null });
  };

  if (isLoading || userLoading) {
    return (
      <div className="p-6">
        <TableLoadingSkeleton />
        <CardLoadingSkeleton />
      </div>
    );
  }

  const DesktopView = () => (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="py-3">Event Name</TableHead>
            <TableHead className="py-3">Location</TableHead>
            <TableHead className="py-3">Date</TableHead>
            <TableHead className="py-3">Participants</TableHead>
            <TableHead className="py-3">Total Amount</TableHead>
            <TableHead className="py-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length > 0 ? (
            events.map((event, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="py-3 font-medium">
                  {event.details?.eventTitle || "Unnamed Event"}
                </TableCell>
                <TableCell className="py-3">
                  {event.details?.location || "No location"}
                </TableCell>
                <TableCell className="py-3">
                  {event.details?.date
                    ? new Date(event.details.date).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell className="py-3">
                  {event.participants?.length || 0}
                </TableCell>
                <TableCell className="py-3">
                  Rs.{event.report?.totalAmount?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/reports/${event.id}`)
                      }
                      variant="default"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
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
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">
                    No events found
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard/events")}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Event
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const MobileView = () => (
    <div className="block md:hidden space-y-4">
      {events.length > 0 ? (
        events.map((event, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {event.details?.eventTitle || "Unnamed Event"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">
                    {event.details?.location || "No location"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">
                    {event.participants?.length || 0} participants
                  </span>
                </div>
                <div className="flex items-center col-span-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">
                    Rs.{event.report?.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => router.push(`dashboard/reports/${event.id}`)}
                variant="default"
                size="sm"
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Report
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium mb-4">
            No events found
          </p>
          <Button
            onClick={() => router.push("/dashboard/events")}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Event
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Past Events</CardTitle>
          <Button onClick={() => router.push("/dashboard/events")} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <DesktopView />
        <MobileView />
      </CardContent>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteDialog((prev) => ({ ...prev, isOpen }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <h3 className="text-lg font-semibold">Delete Event</h3>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete{" "}
            <strong>
              {deleteDialog.event?.details?.eventTitle || "this event"}
            </strong>
            ?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default EventList;
