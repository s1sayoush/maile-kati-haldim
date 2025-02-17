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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutDialogProps {
  onLogout: () => void;
  isCollapsed?: boolean;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({
  onLogout,
  isCollapsed = false,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isCollapsed ? (
          <Button
            variant="destructive"
            size="sm"
            className="w-8 h-8 p-0 md:w-8 md:h-8"
          >
            <LogOut className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            className="w-full px-2 py-1.5 md:px-4 md:py-2 text-xs md:text-sm"
          >
            <LogOut className="h-3 w-3 md:h-4 md:w-4" />
            <span className="ml-1.5 md:ml-2">Log out</span>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[90%] max-w-md mx-auto rounded-lg md:w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg md:text-xl">
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm md:text-base">
            Are you sure you want to log out?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <AlertDialogCancel className="text-sm md:text-base">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white text-sm md:text-base"
            onClick={onLogout}
          >
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutDialog;
