// src/components/steps/ParticipantStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { EventDetails } from "@/types/types";
import { useEventStore } from "@/store/useEventStore";

const ParticipantsStep = () => {
  const { currentEvent, setEventDetails } = useEventStore();
  const { register, handleSubmit } = useForm<EventDetails>({
    defaultValues: currentEvent?.details,
  });

  const onSubmit = (data: EventDetails) => {
    setEventDetails(data);
  };

  return (
    <form onChange={handleSubmit(onSubmit)}>
      <div>hello world</div>
    </form>
  );
};

export default ParticipantsStep;
