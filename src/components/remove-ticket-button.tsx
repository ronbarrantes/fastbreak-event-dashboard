"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { deleteTicket } from "@/lib/actions/tickets";
import { SportEvent } from "@/types/types";
import { tryCatch } from "@/utils/try-catch";

type RemoveTicketButtonProps = {
  event: SportEvent;
  ticketId: string;
};

export const RemoveTicketButton = ({
  event,
  ticketId,
}: RemoveTicketButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRemoveTicket = async () => {
    setIsLoading(true);
    const result = await tryCatch(
      deleteTicket(ticketId, { revalidate: "/attending" })
    );

    if (result.error) {
      toast.error(
        result.error instanceof Error
          ? result.error.message
          : "Failed to remove ticket"
      );
    } else {
      toast.success("Ticket removed successfully!");
      setIsOpen(false);
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="destructive"
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Remove Ticket
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 border-slate-700 bg-slate-900/95 backdrop-blur"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Remove Ticket?</h3>
            <p className="mt-1 text-sm text-slate-400">
              Are you sure you want to remove your ticket? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
              onClick={handleRemoveTicket}
              disabled={isLoading}
            >
              {isLoading ? "Removing..." : "Yes, Remove"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
