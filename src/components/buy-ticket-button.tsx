"use client";

import { Button } from "@/components/ui/button";
import { SportEvent } from "@/types/types";

type BuyTicketButtonProps = {
  event: SportEvent;
};

export const BuyTicketButton = ({ event }: BuyTicketButtonProps) => {
  const handleBuyTicket = () => {
    // TODO: Implement ticket purchase functionality
    console.log("Buy ticket for event:", event.id);
  };

  return (
    <Button
      onClick={handleBuyTicket}
      className="bg-cyan-500 text-white hover:bg-cyan-600"
    >
      Buy Ticket
    </Button>
  );
};

