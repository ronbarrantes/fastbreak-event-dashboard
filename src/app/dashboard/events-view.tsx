"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useViewStore } from "@/state/view-store";
import { SportEvent } from "@/types/types";
import { createColumns } from "./columns";
import { DataTable } from "./data-table";
import { DashboardEventCards } from "./event-cards";

type Venue = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  amenities: string | null;
};

export function EventsView({
  events,
  venues,
}: {
  events: SportEvent[];
  venues: Venue[];
}) {
  const { viewType } = useViewStore();
  const columns = createColumns(venues);

  // GRID VIEW
  if (viewType === "grid") {
    return <DashboardEventCards events={events} venues={venues} />;
  }

  // TABLE VIEW
  return (
    <Card className="border-slate-700 bg-slate-900/50">
      <CardContent className="pt-6">
        <DataTable columns={columns} data={events} />
      </CardContent>
    </Card>
  );
}
