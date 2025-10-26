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
  { accessorKey: "sportType", header: "SportType" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "venue", header: "Venue" },
];
