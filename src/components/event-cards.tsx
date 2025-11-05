import { SportEvent } from "@/types/types";
import { EventCard } from "./event-card";

type EventCardsProps = {
  events: SportEvent[];
  renderActions?: (event: SportEvent) => React.ReactNode;
};

export const EventCards = ({ events, renderActions }: EventCardsProps) => {
  if (events.length === 0) {
    return <p className="py-12 text-center text-slate-400">No events found.</p>;
  }

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          actions={renderActions?.(event)}
        />
      ))}
    </section>
  );
};

