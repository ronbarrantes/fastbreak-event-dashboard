import { Button } from "@/components/ui/button";
import { getEventsWithVenue } from "@/lib/actions/events";
import { getVenues } from "@/lib/actions/venues";
import { SportEvent, SportType, VenueOption } from "@/types/types";
import { AddEditEventDialog } from "./add-edit-event-dialog";
import { createColumns } from "./columns";
import { DataTable } from "./data-table";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [rows, venuesRows] = await Promise.all([getEventsWithVenue(), getVenues()]);

  const data: SportEvent[] = rows.map(({ event, venue }) => ({
    id: event.id,
    name: event.eventName,
    sportType: event.sportType as SportType,
    date: event.startDate ?? null,
    description: event.description,
    venue: venue
      ? {
          name: venue.name,
          available: true,
          description: venue.description,
          capacity: venue.capacity,
          amenities: venue.amenities ?? undefined,
        }
      : undefined,
  }));
  const venueOptions: VenueOption[] = venuesRows.map((v) => ({ id: v.id, name: v.name }));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Events</div>
        <AddEditEventDialog venues={venueOptions}>
          <Button>Create New Event</Button>
        </AddEditEventDialog>
      </div>
      <DataTable columns={createColumns(venueOptions)} data={data} />
    </div>
  );
}
