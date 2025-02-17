"use client";
import React from "react";
import { AppSidebar } from "@/components/(dashboard)/dashboardLayout/AppSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import AppTopbar from "@/components/(dashboard)/dashboardLayout/AppTopbar";
import { AppTabs } from "@/components/(dashboard)/dashboardLayout/AppTabs";
import { Capacitor } from "@capacitor/core";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen  flex">
        <div className="!bg-red-300">
          <AppSidebar />
        </div>
        <div className="flex-1 relative">
          <AppTopbar />
          <main
            className={`pb-32 ${
              Capacitor.isNativePlatform()
                ? Capacitor.getPlatform() === "android"
                  ? "mt-28"
                  : "mt-20"
                : ""
            }`}
          >
            {children}
          </main>{" "}
          {/* Fixed Tabs at the Bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <AppTabs />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
