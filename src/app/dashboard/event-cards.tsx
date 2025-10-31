"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SportEvent } from "@/types/types";
import { AddEditEventDialog } from "./add-edit-event-dialog";

export function EventCards({ events }: { events: SportEvent[] }) {
  if (events.length === 0) {
    return <p className="py-12 text-center text-slate-400">No events found.</p>;
  }

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card
          key={event.id}
          className="border-slate-700 bg-slate-900/50 transition-colors hover:bg-slate-900/70"
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg text-white">{event.name}</CardTitle>
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
                    <AddEditEventDialog>
                      <Button
                        variant="ghost"
                        onClick={() => console.log(`editing ${event.id}`)}
                        className="text-white hover:bg-slate-800 hover:text-white"
                      >
                        Edit
                      </Button>
                    </AddEditEventDialog>
                    <Button
                      variant="destructive"
                      onClick={() => console.log(`deleting ${event.id}`)}
                    >
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Badge className="mt-2 w-fit border-cyan-500/30 bg-cyan-500/20 text-cyan-400">
              {event.sportType}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {event.date && (
              <time className="block text-sm text-slate-400">
                {new Date(event.date).toLocaleString()}
              </time>
            )}
            {event.description && (
              <p className="line-clamp-3 text-sm text-slate-300">
                {event.description}
              </p>
            )}
            {event.venue && (
              <Popover>
                <PopoverTrigger className="text-sm text-cyan-400 underline underline-offset-2 transition-colors hover:text-cyan-300">
                  {event.venue.name}
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-80 border-slate-700 bg-slate-900/95 backdrop-blur"
                >
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-white">
                      {event.venue.name}
                    </div>
                    {event.venue.description && (
                      <p className="text-sm text-slate-400">
                        {event.venue.description}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {typeof event.venue.capacity === "number" && (
                        <div className="text-slate-300">
                          <span className="font-medium text-white">
                            Capacity:
                          </span>{" "}
                          {event.venue.capacity}
                        </div>
                      )}
                      {event.venue.amenities && (
                        <div className="col-span-2 space-y-2">
                          <span className="font-medium text-white">
                            Amenities:
                          </span>{" "}
                          <div className="mt-1 flex flex-wrap gap-2">
                            {event.venue.amenities.split(",").map((amenity) => {
                              const trimmed = amenity.trim();
                              return (
                                <Badge
                                  key={`${event.id}--${trimmed}`}
                                  className="border-cyan-500/30 bg-cyan-500/20 text-cyan-400"
                                >
                                  {trimmed}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
