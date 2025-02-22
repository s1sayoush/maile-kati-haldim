import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Step } from "@/types/types";

interface StepperHeaderProps {
  steps: Step[];
  currentStep: number;
}

export function StepperHeader({ steps, currentStep }: StepperHeaderProps) {
  return (
    <div className="relative flex justify-between items-center px-6 md:px-12 pb-6">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index <= currentStep;
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
  );
}
