import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

interface StepWrapperProps {
  children: React.ReactNode;
  currentStep: number;
  isLastStep: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export const StepWrapper = ({
  children,
  currentStep,
  isLastStep,
  onNext,
  onPrevious,
  onSubmit,
}: StepWrapperProps) => {
  const stepRef = useRef<{ validate: () => boolean } | null>(null);

  const handleNext = () => {
    if (stepRef.current?.validate()) {
      onNext();
    }
  };

  const handleSubmit = () => {
    if (stepRef.current?.validate()) {
      onSubmit();
    }
  };

  return (
    <div>
      <div>
        {React.cloneElement(children as React.ReactElement, { ref: stepRef })}
      </div>

      <div className="flex justify-between items-center pt-6">
        <Button
          onClick={onPrevious}
          className="bg-tertiary text-white hover:bg-tertiary/40 active:scale-95 transition-all duration-300"
          variant="outline"
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {isLastStep ? (
          <Button onClick={handleSubmit} className="flex items-center">
            Submit Lease
            <Check className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-secondary/90 disabled:bg-secondary/60 hover:bg-secondary active:scale-95 transition-all duration-300"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
