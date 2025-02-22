"use client";

import { Suspense, useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/providers/UserContext";
import { useEventStore } from "@/store/useEventStore";
import { StepperHeader } from "@/components/steps/StepperHeader";

import { EventInitializer } from "@/components/steps/EventInitializer";
import { StepperContent, STEPS } from "@/components/steps/StepperContent";

export default function ExpenseSplitterPage() {
  const { userDetails, loading: userLoading } = useUser();
  const [eventId, setEventId] = useState<string>("");
  const { initializeStore, currentStep } = useEventStore();

  const handleInitialize = useCallback(
    (id: string, isEdit: boolean) => {
      setEventId(id);
      if (userDetails) {
        initializeStore(id, isEdit);
      }
    },
    [userDetails, initializeStore]
  );

  if (userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Expense Splitter</CardTitle>
        </CardHeader>

        <StepperHeader steps={STEPS} currentStep={currentStep} />

        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <EventInitializer onInitialize={handleInitialize} />
            <StepperContent />
          </Suspense>
        </CardContent>
      </Card>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-muted rounded-md">
          <div className="text-sm font-mono">
            <div className="font-semibold mb-2">Current Form Data:</div>
            <pre>{JSON.stringify(useEventStore.getState(), null, 2)}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
