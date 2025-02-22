"use client";
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Line, Doughnut } from "recharts";
import { Trophy, Code, Timer, Star } from "lucide-react";
import { useUser } from "@/providers/UserContext";
import NotificationBanner from "./NotificationBanner";
import ReportList from "@/components/report/ReportsList";

// const ComingSoonOverlay = ({ children }: any) => (
//   <div className="relative group">
//     <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-100 transition-opacity group-hover:opacity-90">
//       <Badge variant="outline" className="bg-background/50">
//         Coming Soon
//       </Badge>
//     </div>
//     <div className="opacity-50">{children}</div>
//   </div>
// );
const DashboardHome = () => {
  const { userDetails, loading } = useUser();
  console.log("userDetails", JSON.stringify(userDetails, null, 2));

  const profileComplelted = userDetails?.profileCompleted;

  return (
    <div className="p-3 sm:p-6 space-y-6 bg-background min-h-screen relative">
      {!profileComplelted && !loading && (
        <NotificationBanner
          variant="secondary"
          message="Welcome! Complete your profile"
          link="/dashboard/profile"
        />
      )}
      <ReportList />
    </div>
  );
};

export default DashboardHome;
