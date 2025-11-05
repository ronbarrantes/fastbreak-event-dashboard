"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createTicket, getUserTicketForEvent } from "@/lib/actions/tickets";
import { SportEvent } from "@/types/types";
import { tryCatch } from "@/utils/try-catch";

type BuyTicketButtonProps = {
  event: SportEvent;
};

export const BuyTicketButton = ({ event }: BuyTicketButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkExistingTicket = async () => {
      const result = await tryCatch(getUserTicketForEvent(event.id));
      if (result.data) {
        setHasTicket(true);
      }
      setChecking(false);
    };

    checkExistingTicket();
  }, [event.id]);

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
      if (
        result.error instanceof Error &&
        result.error.message.includes("already have a ticket")
      ) {
        setHasTicket(true);
      }
    } else {
      toast.success("Ticket purchased successfully!");
      setHasTicket(true);
      router.refresh();
    }

    setIsLoading(false);
  };

  if (checking) {
    return (
      <Button disabled className="bg-slate-600 text-white">
        Checking...
      </Button>
    );
  }

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
