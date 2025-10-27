"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import {
  event,
  EventInsert,
  EventsRow,
  venue,
  VenuesRow,
} from "@/server/db/schema";
import { revalidateIfNeeded } from "@/utils/revalidate-if-needed";
import { tryCatch } from "@/utils/try-catch";
import type { SportType } from "@/types/types";

type CreateEventInput = Omit<
  EventInsert,
  "id" | "createdAt" | "updatedAt" | "sportType"
> & { sportType: SportType };
type UpdateEventInput = Partial<CreateEventInput>;

export const createEvent = async (
  input: CreateEventInput,
  options?: { revalidate?: string | string[] }
): Promise<EventsRow> => {
  const [created] = await db
    .insert(event)
    .values({ ...input })
    .returning();
  revalidateIfNeeded(options?.revalidate);

  return created;
};

export const getEvents = async (): Promise<EventsRow[]> =>
  await db.select().from(event).orderBy(desc(event.createdAt));

export const getEvent = async (id: string): Promise<EventsRow | null> => {
  const rows = await db.select().from(event).where(eq(event.id, id)).limit(1);

  return rows[0] ?? null;
};

export const updateEvent = async (
  id: string,
  changes: UpdateEventInput,
  options?: { revalidate?: string | string[] }
): Promise<EventsRow | null> => {
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
): Promise<EventsRow | null> => {
  const [deleted] = await db.delete(event).where(eq(event.id, id)).returning();
  revalidateIfNeeded(options?.revalidate);

  return deleted ?? null;
};

export const getEventsWithVenue = async (): Promise<
  { event: EventsRow; venue: VenuesRow | null }[]
> => {
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
  const result = await tryCatch<EventsRow | undefined>(
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
  await tryCatch<EventsRow[]>(
    db.select().from(event).orderBy(desc(event.createdAt))
  );

export const safeGetEvent = async (id: string) =>
  await tryCatch<EventsRow | null>(
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

  const result = await tryCatch<EventsRow | null>(
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
  const result = await tryCatch<EventsRow | null>(
    db.delete(event).where(eq(event.id, id)).returning().then((rows) => rows[0] ?? null)
  );
  if (!result.error) revalidateIfNeeded(options?.revalidate);
  return result;
};

export const safeGetEventsWithVenue = async () =>
  await tryCatch<{ event: EventsRow; venue: VenuesRow | null }[]>(
    db
      .select({ event, venue })
      .from(event)
      .leftJoin(venue, eq(event.venueId, venue.id))
      .orderBy(desc(event.createdAt))
  );
