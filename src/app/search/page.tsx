import { Suspense } from "react";

import { BuyTicketButton } from "@/components/buy-ticket-button";
import { Container } from "@/components/container";
import { EventCards } from "@/components/event-cards";
import { SearchForm } from "@/components/search-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvailableSports, getEventsWithVenue } from "@/lib/actions/events";
import { getUserTickets } from "@/lib/actions/tickets";
import { SportEvent, SportType } from "@/types/types";

type SearchPageProps = {
  searchParams: Promise<{
    query?: string;
    sportType?: string;
  }>;
};

export default async function EventSearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = params.query ?? "";
  const sportType = params.sportType ?? "";

  const availableSports = await getAvailableSports(query || undefined);

  const [eventItems, userTickets] = await Promise.all([
    getEventsWithVenue({
      name: query || undefined,
      sports: sportType ? [sportType] : undefined,
    }),
    getUserTickets().catch(() => []),
  ]);

  const purchasedEventIds = new Set(
    userTickets.map((ticket) => ticket.eventId)
  );

  const events: SportEvent[] = eventItems.map(({ event, venue }) => ({
    id: event.id,
    name: event.eventName,
    sportType: event.sportType as SportType,
    date: event.startDate ?? null,
    description: event.description,
    startDate: event.startDate ?? null,
    endDate: event.endDate ?? null,
    ticketStatus: purchasedEventIds.has(event.id) ? "purchased" : "available",
    venue: venue
      ? {
          id: venue.id,
          name: venue.name,
          available: true,
          description: venue.description,
          capacity: venue.capacity,
          amenities: venue.amenities ?? undefined,
        }
      : undefined,
  }));

  const renderActions = (event: SportEvent) => (
    <BuyTicketButton key={event.id} event={event} />
  );

  return (
    <Container className="py-20">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Search Events
        </h1>
      </header>

      <Suspense
        fallback={
          <div className="grid grid-cols-[1fr_auto_auto] items-end gap-3">
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        }
      >
        <SearchForm availableSports={availableSports} />
      </Suspense>

      <div className="mt-8">
        {(query || sportType) && (
          <p className="mb-6 text-slate-400">
            {events.length} result{events.length !== 1 ? "s" : ""} found
            {query && ` for "${query}"`}
            {query && sportType && " • "}
            {sportType && `Sport: ${sportType}`}
          </p>
        )}
        <EventCards events={events} renderActions={renderActions} />
      </div>
    </Container>
  );
}
