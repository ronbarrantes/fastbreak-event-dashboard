import { columns } from "./columns";
import { DataTable, SportEvent, Venue } from "./data-table";

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
      <div>Menu</div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
