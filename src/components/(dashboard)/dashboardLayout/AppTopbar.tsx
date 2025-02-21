"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "../../ui/sidebar";
import { Button } from "../../ui/button";
import { Bell, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import LogoutDialog from "@/components/ui/LogoutDialog";
import { Capacitor } from "@capacitor/core";

const AppTopbar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const settingsLinks = [
    { label: "Bank Settings", href: "/settings/bank" },
    { label: "Credit Card Settings", href: "/settings/cards" },
    { label: "Auto-Pay", href: "/settings/autopay" },
    { label: "Profile", href: "/settings/profile" },
    { label: "Notifications", href: "/settings/notifications" },
    { label: "Privacy & Security", href: "/settings/privacy" },
    { label: "Help", href: "/settings/help" },
    { label: "Contact", href: "/settings/contact" },
  ];

  return (
    <>
      {/* {Capacitor.isNativePlatform() && (
        <div className={`w-full  h-[calc(env(safe-area-inset-top)+3rem)]`} />
        // <div>
      )} */}

      <div
        className={`${
          Capacitor.isNativePlatform()
            ? "fixed top-0   left-0 right-0 z-50"
            : "sticky top-0 z-50"
        } bg-background border-b z-50`}
      >
        {Capacitor.isNativePlatform() && (
          <div className="w-full pt-[calc(env(safe-area-inset-top))] bg-background" /> // <div />
        )}

        {/* Main header content */}
        <div className="h-16 sm:h-16   flex items-center justify-between px-2 sm:px-4">
          <div className="flex  items-center gap-2 sm:gap-4">
            <SidebarTrigger className="lg:hidden -ml-1" />
            <h1 className="text-lg sm:text-xl  font-semibold truncate">
              Maile Kati Haldim
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-35 md:w-56"
                sideOffset={8}
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="h-9 sm:h-10 cursor-pointer"
                  onSelect={() => router.push("/dashboard/profile/")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutDialog onLogout={handleLogout} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppTopbar;
