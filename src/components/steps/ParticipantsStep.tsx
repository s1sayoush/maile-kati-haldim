import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Person } from "@/types/types";
import { useEventStore } from "@/store/useEventStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash, UserPlus, Phone, Mail } from "lucide-react";

// Desktop Table Component
const DesktopView = ({
  participants,
  openDialog,
  handleDelete,
}: {
  participants: Person[];
  openDialog: (person?: Person) => void;
  handleDelete: (person: Person) => void;
}) => (
  <div className="hidden md:block">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">SN</TableHead>
          <TableHead>Person</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.length ? (
          participants.map((participant, index) => (
            <TableRow key={participant.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{participant.name}</TableCell>
              <TableCell>{participant.phone || "-"}</TableCell>
              <TableCell>{participant.email || "-"}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => openDialog(participant)}
                  className="hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(participant)}
                  className="hover:bg-red-100"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
              No participants added yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

// Mobile Card Component
const MobileView = ({
  participants,
  openDialog,
  handleDelete,
}: {
  participants: Person[];
  openDialog: (person?: Person) => void;
  handleDelete: (person: Person) => void;
}) => (
  <div className="md:hidden space-y-4">
    {participants.length ? (
      participants.map((participant, index) => (
        <Card key={participant.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                  <h3 className="font-medium">{participant.name}</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{participant.phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{participant.email || "No email"}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => openDialog(participant)}
                  className="hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(participant)}
                  className="hover:bg-red-100"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    ) : (
      <div className="text-center py-8 text-gray-500">
        No participants added yet.
      </div>
    )}
  </div>
);

// Main Component
const ParticipantsStep = () => {
  const { currentEvent, addParticipant, updateParticipant, removeParticipant } =
    useEventStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    person: Person | null;
  }>({
    isOpen: false,
    person: null,
  });
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Person>();

  const onSubmit = (data: Person) => {
    if (editingPerson) {
      updateParticipant(editingPerson.id, data);
    } else {
      addParticipant(data);
    }
    closeDialog();
  };

  const openDialog = (person?: Person) => {
    if (person) {
      setEditingPerson(person);
      setValue("name", person.name);
      setValue("email", person.email || "");
      setValue("phone", person.phone || "");
    } else {
      setEditingPerson(null);
      reset();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPerson(null);
    reset();
  };

  const handleDelete = (person: Person) => {
    setDeleteDialog({ isOpen: true, person });
  };

  const confirmDelete = () => {
    if (deleteDialog.person) {
      removeParticipant(deleteDialog.person.id);
      setDeleteDialog({ isOpen: false, person: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Participants</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Manage event participants and their contact information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => openDialog()}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" /> Add Participant
            </Button>
          </DialogTrigger>
          <DialogContent>
            {/* Form content remains the same */}
            <DialogHeader>
              <DialogTitle>
                {editingPerson ? "Edit Participant" : "Add New Participant"}
              </DialogTitle>
              <DialogDescription>
                {editingPerson
                  ? "Update the participant's information below"
                  : "Fill in the participant's details below"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  {...register("phone", {
                    validate: (value) =>
                      !value ||
                      /^\d{10}$/.test(value) ||
                      "Phone number must be 10 digits",
                  })}
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPerson ? "Update Participant" : "Add Participant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Render both views - they will be shown/hidden based on screen size */}
      <DesktopView
        participants={currentEvent?.participants || []}
        openDialog={openDialog}
        handleDelete={handleDelete}
      />
      <MobileView
        participants={currentEvent?.participants || []}
        openDialog={openDialog}
        handleDelete={handleDelete}
      />

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) => setDeleteDialog({ isOpen, person: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Participant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {deleteDialog.person?.name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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

export default ParticipantsStep;
