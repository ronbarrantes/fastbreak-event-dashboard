import { Badge } from "@/components/ui/badge";

type UpcomingEventProps = {
  name: string;
  date: Date | null;
};

export const UpcomingEvent = ({ name, date }: UpcomingEventProps) => {
  const eventDate = date ? new Date(date) : null;
  const isUpcoming = eventDate && eventDate > new Date();

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4 transition-colors hover:bg-slate-800/50">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-slate-400">
            {eventDate
              ? eventDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Date TBD"}
          </p>
        </div>
        {isUpcoming && (
          <Badge className="border-cyan-500/30 bg-cyan-500/20 text-cyan-400">
            Soon
          </Badge>
        )}
      </div>
    </div>
  );
};
