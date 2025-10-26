import { SportEvent, Venue } from "@/types/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import LogoutButton from "@/components/logout-button";

const venues: Venue[] = [
  {
    name: "soccer stadium",
    available: true,
  },
  {
    name: "gymnasium",
    available: true,
  },
];

const data: SportEvent[] = [
  {
    id: "m5gr84i9",
    name: "School championship",
    sportType: "soccer",
    date: new Date(2025, 10, 3, 1, 30),
    description: "a really exciting soccer game",
    venue: venues[0],
  },

  {
    id: "m5gr84i9",
    name: "School championship",
    sportType: "baseball",
    date: new Date(2025, 10, 3, 1, 30),
    description: "a really exciting soccer game",
    venue: venues[1],
  },

  {
    id: "m5gr84i9",
    name: "School championship",
    sportType: "football",
    date: new Date(2025, 10, 3, 1, 30),
    description: "a really exciting soccer game",
    venue: venues[0],
  },
];

export default function Dashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-semibold">Menu</div>
        <LogoutButton />
      </div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
