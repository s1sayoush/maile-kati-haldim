import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { AlertTriangle } from "lucide-react";

const FORM_STEPS = [
  {
    id: "details",
    title: "Event Details",
    description: "Basic information about the event",
  },
  {
    id: "participants",
    title: "Participants",
    description: "Add people involved in the event",
  },
  {
    id: "expenses",
    title: "Expenses",
    description: "Add all expenses and payments",
  },
  {
    id: "review",
    title: "Review",
    description: "Review and finalize",
  },
] as const;

interface FormWrapperProps {
  children: React.ReactNode;
}

export const FormWrapper = ({ children }: FormWrapperProps) => {
  const { currentStep, nextStep, previousStep } = useEventStore();
  const currentStepData = FORM_STEPS[currentStep];

  const methods = useForm({
    mode: "onChange",
  });

  const {
    formState: { errors, isValid, isDirty },
  } = methods;

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      nextStep();
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            {/* Progress Bar */}
            <div className="w-full py-4">
              <div className="flex justify-between">
                {FORM_STEPS.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        index <= currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      )}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={cn(
                        "mt-2 text-sm font-medium",
                        index <= currentStep ? "text-blue-600" : "text-gray-400"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Form Content */}
            {children}

            {/* Validation Errors */}
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {Object.entries(errors).map(
                      ([key, error]: [string, any]) => (
                        <li key={key}>{error.message}</li>
                      )
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNext} disabled={!isValid || !isDirty}>
                {currentStep === FORM_STEPS.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};
