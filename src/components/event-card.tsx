import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SportEvent } from "@/types/types";

type EventCardProps = {
  event: SportEvent;
  actions?: React.ReactNode;
};

export const EventCard = ({ event, actions }: EventCardProps) => {
  return (
    <Card className="border-slate-700 bg-slate-900/50 transition-colors hover:bg-slate-900/70">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg text-white">{event.name}</CardTitle>
          {actions}
        </div>
        <Badge className="mt-2 w-fit border-cyan-500/30 bg-cyan-500/20 text-cyan-400">
          {event.sportType}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {event.startDate && (
          <time className="block text-sm text-slate-400">
            {new Date(event.startDate).toLocaleString()}
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
                      <span className="font-medium text-white">Capacity:</span>{" "}
                      {event.venue.capacity}
                    </div>
                  )}
                  {event.venue.amenities && (
                    <div className="col-span-2 space-y-2">
                      <span className="font-medium text-white">Amenities:</span>{" "}
                      <div className="mt-1 flex flex-wrap gap-2">
                        {event.venue.amenities
                          .split(",")
                          .map((amenity) => {
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
  );
};

