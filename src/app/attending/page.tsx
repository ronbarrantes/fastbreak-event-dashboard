import { Container } from "@/components/container";
import { EventCards } from "@/components/event-cards";
import { RemoveTicketButton } from "@/components/remove-ticket-button";
import { getUserTicketsWithEvents } from "@/lib/actions/tickets";
import { SportEvent, SportType } from "@/types/types";

export const dynamic = "force-dynamic";

export default async function AttendingPage() {
  // Fetch user's tickets with event and venue data
  const rows = await getUserTicketsWithEvents();

  // Transform to SportEvent format
  const events: SportEvent[] = rows
    .filter((row) => row.event) // Only include rows with valid events
    .map((row) => ({
      id: row.event!.id,
      name: row.event!.eventName,
      sportType: row.event!.sportType as SportType,
      date: row.event!.startDate ?? null,
      description: row.event!.description,
      startDate: row.event!.startDate ?? null,
      endDate: row.event!.endDate ?? null,
      venue: row.venue
        ? {
            id: row.venue.id,
            name: row.venue.name,
            available: true,
            description: row.venue.description,
            capacity: row.venue.capacity,
            amenities: row.venue.amenities ?? undefined,
          }
        : undefined,
    }));

  // Create a map of event IDs to ticket IDs for the remove button
  const eventToTicketMap = new Map(
    rows.filter((row) => row.event).map((row) => [row.event!.id, row.ticket.id])
  );

  const renderActions = (event: SportEvent) => {
    const ticketId = eventToTicketMap.get(event.id);
    if (!ticketId) return null;

    return <RemoveTicketButton event={event} ticketId={ticketId} />;
  };

  return (
    <Container className="py-20">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Attending Events
        </h1>
      </header>

      <div className="mt-8">
        {events.length === 0 ? (
          <p className="py-12 text-center text-slate-400">
            {`You don't have any tickets yet. Browse events and purchase tickets to see them here!`}
          </p>
        ) : (
          <>
            <p className="mb-6 text-slate-400">
              {`You're attending ${events.length} event${events.length !== 1 ? "s" : ""}`}
            </p>
            <EventCards events={events} renderActions={renderActions} />
          </>
        )}
      </div>
    </Container>
  );
}
