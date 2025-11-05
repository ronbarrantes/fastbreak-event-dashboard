"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createTicket } from "@/lib/actions/tickets";
import { SportEvent } from "@/types/types";
import { tryCatch } from "@/utils/try-catch";

type BuyTicketButtonProps = {
  event: SportEvent;
};

export const BuyTicketButton = ({ event }: BuyTicketButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const hasTicket = event.ticketStatus === "purchased";

  const handleBuyTicket = useCallback(async () => {
    if (hasTicket || isLoading) return;

    setIsLoading(true);
    try {
      // Get the event price from the database
      const { getEvent } = await import("@/lib/actions/events");
      const eventData = await getEvent(event.id);

      if (!eventData) {
        toast.error("Event not found");
        return;
      }

      const result = await tryCatch(
        createTicket(
          {
            eventId: event.id,
            price: eventData.price,
            type: "general",
            status: "sold",
          },
          { revalidate: ["/attending", "/search"] }
        )
      );

      if (result.error) {
        toast.error(
          result.error instanceof Error
            ? result.error.message
            : "Failed to purchase ticket"
        );
      } else {
        toast.success("Ticket purchased successfully!");
        // Use router.refresh() to update the page without losing search params
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }, [event.id, hasTicket, isLoading, router]);

  if (hasTicket) {
    return (
      <Button disabled className="cursor-not-allowed bg-slate-600 text-white">
        Already Purchased
      </Button>
    );
  }

  return (
    <Button
      onClick={handleBuyTicket}
      className="bg-cyan-500 text-white hover:bg-cyan-600"
      disabled={isLoading}
    >
      {isLoading ? "Purchasing..." : "Buy Ticket"}
    </Button>
  );
};
