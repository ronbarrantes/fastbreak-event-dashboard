import { Suspense } from "react";

import { BuyTicketButton } from "@/components/buy-ticket-button";
import { Container } from "@/components/container";
import { EventCards } from "@/components/event-cards";
import { SearchForm } from "@/components/search-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getEventsWithVenue } from "@/lib/actions/events";
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

  // Fetch all events for now (we'll filter client-side or add server-side filtering later)
  const rows = await getEventsWithVenue();

  // Transform and filter events
  let events: SportEvent[] = rows.map(({ event, venue }) => ({
    id: event.id,
    name: event.eventName,
    sportType: event.sportType as SportType,
    date: event.startDate ?? null,
    description: event.description,
    startDate: event.startDate ?? null,
    endDate: event.endDate ?? null,
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

  // Filter by query (case-insensitive search in name and description)
  if (query) {
    const lowerQuery = query.toLowerCase();
    events = events.filter(
      (event) =>
        event.name.toLowerCase().includes(lowerQuery) ||
        event.description?.toLowerCase().includes(lowerQuery)
    );
  }

  // Filter by sport type
  if (sportType) {
    events = events.filter((event) => event.sportType === sportType);
  }

  const renderActions = (event: SportEvent) => (
    <BuyTicketButton event={event} />
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
        <SearchForm />
      </Suspense>

      {/* Display search results */}
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
