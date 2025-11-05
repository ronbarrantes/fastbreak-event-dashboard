"use client";

import { useState } from "react";

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

  const handleBuyTicket = async () => {
    setIsLoading(true);
    // Get the event price from the database
    const { getEvent } = await import("@/lib/actions/events");
    const eventData = await getEvent(event.id);
    
    if (!eventData) {
      toast.error("Event not found");
      setIsLoading(false);
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
      router.refresh();
    }

    setIsLoading(false);
  };

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

