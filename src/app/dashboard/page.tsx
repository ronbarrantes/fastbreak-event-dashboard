import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { getEventsWithVenue } from "@/lib/actions/events";
import { SportEvent, SportType } from "@/types/types";
import { AddEditEventDialog } from "./add-edit-event-dialog";
import { EventsView } from "./events-view";
import { ViewToggle } from "./view-toggle";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const rows = await getEventsWithVenue();

  const data: SportEvent[] = rows.map(({ event, venue }) => ({
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

  return (
    <Container className="py-20">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Events</h1>
        <div className="flex items-center gap-4">
          <ViewToggle />
          <AddEditEventDialog>
            <Button className="bg-cyan-500 text-white hover:bg-cyan-600">
              Create New Event
            </Button>
          </AddEditEventDialog>
        </div>
      </header>
      <EventsView events={data} />
    </Container>
  );
}
