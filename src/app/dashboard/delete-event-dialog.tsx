"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/lib/actions/events";
import { useDialogStore } from "@/state/dialog-store";
import { tryCatch } from "@/utils/try-catch";

const DeleteEventDialogContent = ({
  eventId,
  eventName,
}: {
  eventId: string;
  eventName: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { handleDialogClose } = useDialogStore();

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await tryCatch(
      deleteEvent(eventId, { revalidate: "/dashboard" })
    );

    if (result.error) {
      toast.error(
        result.error instanceof Error
          ? result.error.message
          : "Failed to delete event"
      );
    } else {
      toast.success("Event deleted successfully!");
      handleDialogClose();
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Are you sure you want to delete{" "}
        <strong className="text-white">{eventName}</strong>? This action cannot
        be undone.
      </p>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleDialogClose}
          className="border-slate-700 text-white hover:bg-slate-800"
          disabled={isLoading}
        >
          No, Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </Button>
      </div>
    </div>
  );
};

export const DeleteEventDialog = ({
  children,
  eventId,
  eventName,
}: {
  children: React.ReactNode;
  eventId: string;
  eventName: string;
}) => {
  const { handleDialog } = useDialogStore();

  return (
    <div
      onClick={() =>
        handleDialog({
          content: (
            <DeleteEventDialogContent eventId={eventId} eventName={eventName} />
          ),
          title: "Delete Event",
        })
      }
    >
      {children}
    </div>
  );
};
