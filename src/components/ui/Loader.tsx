import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loader = () => {
  return (
    <Card className="w-full mt-6 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Skeleton className="h-8 w-48" />
        </CardTitle>
      </CardHeader>

      {/* Stepper Header Skeleton */}
      <div className="flex justify-between px-6 mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      <CardContent>
        {/* Form Fields Skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex justify-between mt-8">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Loader;
