import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/useEventStore";
import { useUser } from "@/providers/UserContext";
import { pushEvent } from "@/firebase/event";
import { Step } from "@/types/types";
import EventDetailsStep from "./EventDetailsStep";
import ParticipantsStep from "./ParticipantsStep";
import ExpensesStep from "./ExpensesStep";
import ReviewStep from "./ReviewStep";

export const STEPS: Step[] = [
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

export const StepperContent = () => {
  const { currentStep, nextStep, previousStep } = useEventStore();
  const CurrentStepComponent = STEPS[currentStep]?.component;
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
};
