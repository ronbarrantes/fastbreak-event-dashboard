"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SportEvent } from "@/types/types";
import { DeleteEventDialog } from "./delete-event-dialog";
import { EditEventButton } from "./add-edit-event-dialog";

type Venue = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  amenities: string | null;
};

export const createColumns = (venues: Venue[]): ColumnDef<SportEvent>[] => [
  { accessorKey: "name", header: "Event Name" },
  { accessorKey: "sportType", header: "Sport Type" },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const value = row.original.startDate;
      return value ? new Date(value).toLocaleString() : "";
    },
  },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "venue",
    header: "Venue",
    cell: ({ row }) => {
      const venue = row.original.venue;

      if (!venue) return "";
      return (
        <Popover>
          <PopoverTrigger className="text-cyan-400 underline underline-offset-2 transition-colors hover:text-cyan-300">
            {venue.name}
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-80 border-slate-700 bg-slate-900/95 backdrop-blur"
          >
            <div className="space-y-3">
              <div className="text-sm font-semibold text-white">
                {venue.name}
              </div>
              {venue.description ? (
                <p className="text-sm text-slate-400">{venue.description}</p>
              ) : null}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {typeof venue.capacity === "number" ? (
                  <div className="text-slate-300">
                    <span className="font-medium text-white">Capacity:</span>{" "}
                    {venue.capacity}
                  </div>
                ) : null}
                {venue.amenities ? (
                  <div className="col-span-2 space-y-2">
                    <span className="font-medium text-white">Amenities:</span>{" "}
                    <div className="mt-1 flex flex-wrap gap-2">
                      {venue.amenities.split(",").map((amenity) => {
                        const trimmed = amenity.trim();
                        return (
                          <Badge
                            key={`${row.id}--${trimmed}`}
                            className="border-cyan-500/30 bg-cyan-500/20 text-cyan-400"
                          >
                            {trimmed}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="More actions">
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
                  className="text-white hover:bg-slate-800 hover:text-white"
                >
                  Edit
                </Button>
              </EditEventButton>

              <DeleteEventDialog eventId={event.id} eventName={event.name}>
                <Button variant="destructive" className="w-full justify-start">
                  Delete
                </Button>
              </DeleteEventDialog>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
