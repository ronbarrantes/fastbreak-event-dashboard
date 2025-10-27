import { Button } from "@/components/ui/button";
import { getEventsWithVenue } from "@/lib/actions/events";
import { SportEvent, SportType } from "@/types/types";
import { AddEditEventDialog } from "./add-edit-event-dialog";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const rows = await getEventsWithVenue();

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Events</div>
        <AddEditEventDialog>
          <Button>Create New Event</Button>
        </AddEditEventDialog>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
