"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { event, EventInsert, venue } from "@/server/db/schema";
import { revalidateIfNeeded } from "@/utils/revalidate-if-needed";
import { tryCatch } from "@/utils/try-catch";

type CreateEventInput = Omit<EventInsert, "id" | "createdAt" | "updatedAt">;
type UpdateEventInput = Partial<CreateEventInput>;

export const createEvent = async (
  input: CreateEventInput,
  options?: { revalidate?: string | string[] }
) => {
  const [created] = await db
    .insert(event)
    .values({ ...input })
    .returning();
  revalidateIfNeeded(options?.revalidate);

  return created;
};

export const getEvents = async () =>
  await db.select().from(event).orderBy(desc(event.createdAt));

export const getEvent = async (id: string) => {
  const rows = await db.select().from(event).where(eq(event.id, id)).limit(1);

  return rows[0] ?? null;
};

export const updateEvent = async (
  id: string,
  changes: UpdateEventInput,
  options?: { revalidate?: string | string[] }
) => {
  if (!changes || Object.keys(changes).length === 0) return getEvent(id);

  const [updated] = await db
    .update(event)
    .set({ ...changes, updatedAt: new Date() })
    .where(eq(event.id, id));
  revalidateIfNeeded(options?.revalidate);

  return updated ?? null;
};

export const deleteEvent = async (
  id: string,
  options?: { revalidate?: string | string[] }
) => {
  const [deleted] = await db.delete(event).where(eq(event.id, id)).returning();
  revalidateIfNeeded(options?.revalidate);

  return deleted ?? null;
};

export const getEventsWithVenue = async () => {
  const rows = await db
    .select({ event, venue })
    .from(event)
    .leftJoin(venue, eq(event.venueId, venue.id))
    .orderBy(desc(event.createdAt));
  return rows;
};

// Safe wrappers returning Result via tryCatch
export const safeCreateEvent = async (
  input: CreateEventInput,
  options?: { revalidate?: string | string[] }
) => {
  const result = await tryCatch(
    db
      .insert(event)
      .values({ ...input })
      .returning()
      .then((rows) => rows[0])
  );
  if (!result.error) revalidateIfNeeded(options?.revalidate);
  return result;
};

export const safeGetEvents = async () =>
  await tryCatch(db.select().from(event).orderBy(desc(event.createdAt)));

export const safeGetEvent = async (id: string) =>
  await tryCatch(
    db
      .select()
      .from(event)
      .where(eq(event.id, id))
      .limit(1)
      .then((rows) => rows[0] ?? null)
  );

export const safeUpdateEvent = async (
  id: string,
  changes: UpdateEventInput,
  options?: { revalidate?: string | string[] }
) => {
  if (!changes || Object.keys(changes).length === 0)
    return safeGetEvent(id);

  const result = await tryCatch(
    db
      .update(event)
      .set({ ...changes, updatedAt: new Date() })
      .where(eq(event.id, id))
      .returning()
      .then((rows) => rows[0] ?? null)
  );
  if (!result.error) revalidateIfNeeded(options?.revalidate);
  return result;
};

export const safeDeleteEvent = async (
  id: string,
  options?: { revalidate?: string | string[] }
) => {
  const result = await tryCatch(
    db.delete(event).where(eq(event.id, id)).returning().then((rows) => rows[0] ?? null)
  );
  if (!result.error) revalidateIfNeeded(options?.revalidate);
  return result;
};

export const safeGetEventsWithVenue = async () =>
  await tryCatch(
    db
      .select({ event, venue })
      .from(event)
      .leftJoin(venue, eq(event.venueId, venue.id))
      .orderBy(desc(event.createdAt))
  );
