"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteEvent } from "@/lib/actions/events";
import { tryCatch } from "@/utils/try-catch";

export function DeleteEventDialog({
  eventId,
  eventName,
  children,
}: {
  eventId: string;
  eventName: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      setIsOpen(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-slate-700 bg-slate-900/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-white">Delete Event</DialogTitle>
          <DialogDescription className="text-slate-400">
            Are you sure you want to delete &quot;{eventName}&quot;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
