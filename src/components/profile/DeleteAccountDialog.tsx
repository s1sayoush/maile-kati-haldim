import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  isLoading: boolean;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onOpenChange,
  password,
  onPasswordChange,
  onDelete,
  isLoading,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="w-[90%] max-w-md mx-auto rounded-lg md:w-full">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="my-4">
        <Input
          type="password"
          placeholder="Enter your password to confirm"
          value={password}
          onChange={onPasswordChange}
          className="mt-2"
        />
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onDelete}
          disabled={!password || isLoading}
          className="bg-destructive text-inherit hover:bg-destructive/90"
        >
          {isLoading ? "Deleting..." : "Delete Account"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
