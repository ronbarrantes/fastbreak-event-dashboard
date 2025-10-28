"use client";

import { ColumnDef } from "@tanstack/react-table";
import classNames from "classnames";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SportEvent, VenueOption } from "@/types/types";
import { AddEditEventDialog } from "./add-edit-event-dialog";

export const createColumns = (
  venues: VenueOption[]
): ColumnDef<SportEvent>[] => [
  { accessorKey: "name", header: "Event Name" },
  { accessorKey: "sportType", header: "Sport Type" },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const value = row.original.date;
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
          <PopoverTrigger className="text-primary underline underline-offset-2 hover:opacity-80">
            {venue.name}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80">
            <div className="space-y-2">
              <div className="text-sm font-semibold">{venue.name}</div>
              {venue.description ? (
                <p className="text-muted-foreground text-sm">
                  {venue.description}
                </p>
              ) : null}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {typeof venue.capacity === "number" ? (
                  <div>
                    <span className="font-medium">Capacity:</span>{" "}
                    {venue.capacity}
                  </div>
                ) : null}
                {venue.amenities ? (
                  <div className="col-span-2">
                    <span className="font-medium">Amenities:</span>{" "}
                    {venue.amenities.split(",").map((amenity) => {
                      const trimmed = amenity.trim();
                      return (
                        <Badge key={`${row.id}--${trimmed}`}>{trimmed}</Badge>
                      );
                    })}
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
      const id = row.original.id;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="More actions">
              …
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-2">
            <div className="flex flex-col gap-1">
              <AddEditEventDialog venues={venues} sportEvent={row.original}>
                <Button
                  variant="ghost"
                  onClick={() => console.log(`editing ${id}`)}
                >
                  Edit
                </Button>
              </AddEditEventDialog>

              <Button
                variant="destructive"
                onClick={() => console.log(`deleting ${id}`)}
              >
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];
