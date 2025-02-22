"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "../../ui/sidebar";
import { Button } from "../../ui/button";
import {
  Settings,
  ChevronDown,
  Shield,
  UserCircle,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import LogoutDialog from "@/components/ui/LogoutDialog";
import { Capacitor } from "@capacitor/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/providers/UserContext";

const AppTopbar = () => {
  const { userDetails } = useUser();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getInitials = (name: any) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n: any) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`${
        Capacitor.isNativePlatform()
          ? "fixed top-0 left-0 right-0 z-50"
          : "sticky top-0 z-50"
      } bg-background border-b`}
    >
      {Capacitor.isNativePlatform() && (
        <div className="w-full pt-[calc(env(safe-area-inset-top))] bg-background" />
      )}

      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden -ml-2" />
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">
              Let&apos;s Split the bill
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 gap-2 pl-2 pr-3 hover:bg-accent"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userDetails?.personalDetails.profileImage}
                    alt={userDetails?.personalDetails.fullName}
                  />
                  <AvatarFallback className="bg-primary/10">
                    {getInitials(userDetails?.personalDetails.fullName)}
                  </AvatarFallback>
                </Avatar>
                {/* <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {userDetails?.personalDetails.fullName || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {userDetails?.personalDetails.fullName || "Member"}
                  </span>
                </div> */}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userDetails?.personalDetails.fullName || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userDetails?.personalDetails.email ||
                      "userDetails@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="h-10 cursor-pointer gap-3"
                onSelect={() => router.push("/dashboard/profile/")}
              >
                <UserCircle className="h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                className="h-10 cursor-pointer gap-3"
                onSelect={() => router.push("/dashboard/preferences/")}
              >
                <Settings className="h-4 w-4" />
                Preferences
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <LogoutDialog onLogout={handleLogout} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default AppTopbar;
