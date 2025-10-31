"use client";

import { SportEvent } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { useViewStore } from "@/state/view-store";
import { DataTable } from "./data-table";
import { EventCards } from "./event-cards";
import { columns } from "./columns";

export function EventsView({ events }: { events: SportEvent[] }) {
  const { viewType } = useViewStore();

  if (viewType === "grid") {
    return <EventCards events={events} />;
  }

  return (
    <Card className="border-slate-700 bg-slate-900/50">
      <CardContent className="pt-6">
        <DataTable columns={columns} data={events} />
      </CardContent>
    </Card>
  );
}

