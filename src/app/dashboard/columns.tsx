"use client";

import { ColumnDef } from "@tanstack/react-table";

import { SportEvent } from "@/types/types";

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
    cell: ({ row }) => row.original.venue?.name ?? "",
  },
];
