"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import EventDetailsStep from "@/components/steps/EventDetailsStep";
import ParticipantsStep from "@/components/steps/ParticipantsStep";
import ReviewStep from "@/components/steps/ReviewStep";
import ExpensesStep from "@/components/steps/ExpensesStep";
import { useUser } from "@/providers/UserContext";
import { pushEvent } from "@/firebase/event";
import { nanoid } from "nanoid";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const STEPS = [
  {
    id: "details",
    title: "Event Details",
    component: EventDetailsStep,
  },
  {
    id: "participants",
    title: "Participants",
    component: ParticipantsStep,
  },
  {
    id: "expenses",
    title: "Expenses",
    component: ExpensesStep,
  },
  {
    id: "review",
    title: "Review",
    component: ReviewStep,
  },
] as const;

// Separate component for the search params logic
function EventInitializer({
  onInitialize,
}: {
  onInitialize: (id: string, isEdit: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const params = useParams();

  const queryEventId = searchParams.get("eventId");
  const isEditMode =
    searchParams.get("edit") === "true" && Boolean(queryEventId);

  useEffect(() => {
    const id = queryEventId || params.id || nanoid();
    onInitialize(id as string, isEditMode);
  }, [queryEventId, params.id, isEditMode, onInitialize]);

  return null;
}

function StepperContent() {
  const { currentStep, nextStep, previousStep } = useEventStore();
  const CurrentStepComponent = STEPS[currentStep].component;
  const [finishing, setFinishing] = useState(false);
  const router = useRouter();
  const { userDetails } = useUser();
  const currentState = useEventStore.getState();

  const event = {
    ...currentState.currentEvent,
  };

  const handleNext = async () => {
    if (currentStep === STEPS.length - 1) {
      setFinishing(true);
      try {
        await pushEvent(userDetails?.uid || "", event);
        useEventStore.getState().resetStore();
        router.refresh();
        router.push(`./reports/${event.id}`);
      } catch (error) {
        console.error("Error pushing event:", error);
        // Handle error appropriately
      } finally {
        setFinishing(false);
      }
    } else {
      nextStep();
    }
  };

  return (
    <>
      <CurrentStepComponent />
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={previousStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={finishing}>
          {finishing
            ? "Finishing"
            : currentStep === STEPS.length - 1
            ? "Finish"
            : "Next"}
        </Button>
      </div>
    </>
  );
}

export default function ExpenseSplitterPage() {
  const { userDetails, loading: userLoading } = useUser();
  const [eventId, setEventId] = useState<string>("");
  const { initializeStore } = useEventStore();

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

        {/* Horizontal Stepper */}
        <div className="relative flex justify-between items-center px-6 md:px-12 pb-6">
          {STEPS.map((step, index) => {
            const isActive = index === useEventStore.getState().currentStep;
            const isCompleted = index <= useEventStore.getState().currentStep;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center w-full relative"
              >
                {index !== 0 && (
                  <div
                    className={cn(
                      "absolute left-[-50%] right-[50%] top-4 h-0.5",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium z-10",
                    isActive && "border-primary bg-primary text-white",
                    isCompleted && "border-primary bg-primary text-white",
                    !isActive &&
                      !isCompleted &&
                      "border-muted bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 text-sm font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

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
