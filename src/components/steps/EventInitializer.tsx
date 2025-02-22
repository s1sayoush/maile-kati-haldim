import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";

interface EventInitializerProps {
  onInitialize: (id: string, isEdit: boolean) => void;
}

export function EventInitializer({ onInitialize }: EventInitializerProps) {
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
