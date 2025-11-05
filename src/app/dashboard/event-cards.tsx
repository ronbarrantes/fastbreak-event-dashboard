import { EventCards } from "@/components/event-cards";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SportEvent } from "@/types/types";
import { EditEventButton } from "./add-edit-event-dialog";
import { DeleteEventDialog } from "./delete-event-dialog";

type Venue = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  amenities: string | null;
};

export function DashboardEventCards({
  events,
  venues,
}: {
  events: SportEvent[];
  venues: Venue[];
}) {
  const renderActions = (event: SportEvent) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="More actions"
          className="border-slate-700 text-white hover:bg-slate-800"
        >
          …
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-48 border-slate-700 bg-slate-900/95 p-2 backdrop-blur"
      >
        <div className="flex flex-col gap-1">
          <EditEventButton sportEvent={event} venues={venues}>
            <Button
              variant="ghost"
              className="w-full justify-center text-white hover:bg-slate-800 hover:text-white"
            >
              Edit
            </Button>
          </EditEventButton>
          <DeleteEventDialog eventId={event.id} eventName={event.name}>
            <Button variant="destructive" className="w-full justify-center">
              Delete
            </Button>
          </DeleteEventDialog>
        </div>
      </PopoverContent>
    </Popover>
  );

  return <EventCards events={events} renderActions={renderActions} />;
}
