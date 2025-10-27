"use client";

import { ColumnDef } from "@tanstack/react-table";

import { SportEvent } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

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
      const v = row.original.venue;
      if (!v) return "";
      return (
        <Popover>
          <PopoverTrigger className="underline underline-offset-2 text-primary hover:opacity-80">
            {v.name}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80">
            <div className="space-y-2">
              <div className="text-sm font-semibold">{v.name}</div>
              {v.description ? (
                <p className="text-sm text-muted-foreground">{v.description}</p>
              ) : null}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {typeof v.capacity === "number" ? (
                  <div>
                    <span className="font-medium">Capacity:</span> {v.capacity}
                  </div>
                ) : null}
                {v.amenities ? (
                  <div className="col-span-2">
                    <span className="font-medium">Amenities:</span> {v.amenities}
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
              <Button
                variant="ghost"
                onClick={() => console.log(`editing ${id}`)}
              >
                Edit
              </Button>
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
