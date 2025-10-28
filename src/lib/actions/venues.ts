"use server";

import { desc } from "drizzle-orm";

import { db } from "@/server/db";
import { venue } from "@/server/db/schema";
import { revalidateIfNeeded } from "@/utils/revalidate-if-needed";

export const getVenues = async () => {
  const rows = await db.select().from(venue).orderBy(desc(venue.createdAt));
  return rows;
};

export const createVenue = async (
  input: Omit<typeof venue.$inferInsert, "id" | "createdAt" | "updatedAt">,
  options?: { revalidate?: string | string[] }
) => {
  const [created] = await db.insert(venue).values({ ...input }).returning();
  revalidateIfNeeded(options?.revalidate);
  return created;
};
