"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import EventDetailsStep from "@/components/steps/EventDetailsStep";
import ParticipantsStep from "@/components/steps/ParticipantsStep";
import ReviewStep from "@/components/steps/ReviewStep";
import ExpensesStep from "@/components/steps/ExpensesStep";
import { useAuth } from "@/providers/AuthProvider";
import { useUser } from "@/providers/UserContext";
import { Event } from "@/types/types";
import { pushEvent } from "@/firebase/event";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

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

export default function ExpenseSplitterPage() {
  const { currentStep, nextStep, previousStep, resetStore } = useEventStore();
  const currentState = useEventStore.getState();
  const CurrentStepComponent = STEPS[currentStep].component;
  const router = useRouter();
  const event = {
    ...currentState.currentEvent,
  };
  const { userDetails } = useUser();
  const { uid } = userDetails;
  const [finishing, setFinishing] = useState(false);

  console.log("currentState", JSON.stringify(currentState, null, 2));
  const handleNext = async () => {
    const id = nanoid();
    if (currentStep == STEPS.length - 1) {
      setFinishing(true);
      await pushEvent(uid, event, id);
      resetStore();
      setFinishing(false);
      router.refresh();
      router.push(`./reports/${id}`);
    }
    nextStep();
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Expense Splitter</CardTitle>
        </CardHeader>

        {/* Horizontal Stepper */}
        <div className="relative flex justify-between items-center px-6 md:px-12 pb-6">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index <= currentStep;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center w-full relative"
              >
                {/* Progress line */}
                {index !== 0 && (
                  <div
                    className={cn(
                      "absolute left-[-50%] right-[50%] top-4 h-0.5",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
                {/* Step Indicator */}
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
                {/* Step Title */}
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
            </Button>{" "}
          </div>
        </CardContent>
      </Card>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-muted rounded-md">
          <div className="text-sm font-mono">
            <div className="font-semibold mb-2">Current Form Data:</div>
            <pre>{JSON.stringify(currentState, null, 2)}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
