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
import { SportEvent } from "@/types/types";
import { AddEditEventDialog } from "./add-edit-event-dialog";

export const columns: ColumnDef<SportEvent>[] = [
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
          <PopoverTrigger className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors">
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
                <p className="text-slate-400 text-sm">{venue.description}</p>
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
                    <div className="flex flex-wrap gap-2 mt-1">
                      {venue.amenities.split(",").map((amenity) => {
                        const trimmed = amenity.trim();
                        return (
                          <Badge
                            key={`${row.id}--${trimmed}`}
                            className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
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
      const id = row.original.id;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="More actions">
              …
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-48 p-2 border-slate-700 bg-slate-900/95 backdrop-blur"
          >
            <div className="flex flex-col gap-1">
              <AddEditEventDialog>
                <Button
                  variant="ghost"
                  onClick={() => console.log(`editing ${id}`)}
                  className="text-white hover:bg-slate-800 hover:text-white"
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
