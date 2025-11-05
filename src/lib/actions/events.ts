"use server";

import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";

import { db } from "@/server/db";
import { event, EventInsert, venue } from "@/server/db/schema";
import { revalidateIfNeeded } from "@/utils/revalidate-if-needed";
import { createClient } from "@/utils/supabase/server";

type CreateEventInput = Omit<
  EventInsert,
  "id" | "userId" | "createdAt" | "updatedAt"
>;
type UpdateEventInput = Partial<CreateEventInput>;

export const createEvent = async (
  input: CreateEventInput,
  options?: { revalidate?: string | string[] }
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to create events");
  }

  const [created] = await db
    .insert(event)
    .values({ ...input, userId: user.id })
    .returning();
  revalidateIfNeeded(options?.revalidate);

  return created;
};

export const getEvents = async () =>
  await db.select().from(event).orderBy(desc(event.createdAt));

export const getEvent = async (id: string) => {
  const events = await db.select().from(event).where(eq(event.id, id)).limit(1);

  return events[0] ?? null;
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

type GetEventsWithVenueOptions = {
  name?: string;
  sports?: string[];
};

export const getEventsWithVenue = async (
  options?: GetEventsWithVenueOptions
) => {
  const conditions = [];

  if (options?.name) {
    const searchPattern = `%${options.name}%`;
    conditions.push(
      or(
        ilike(event.eventName, searchPattern),
        ilike(event.description, searchPattern)
      )!
    );
  }

  if (options?.sports && options.sports.length > 0) {
    conditions.push(inArray(event.sportType, options.sports));
  }

  const baseQuery = db
    .select({ event, venue })
    .from(event)
    .leftJoin(venue, eq(event.venueId, venue.id));

  const query =
    conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

  const events = await query.orderBy(desc(event.createdAt));
  return events;
};

export const getUpcomingEvents = async (limit: number = 3) => {
  const events = await db
    .select({ event, venue })
    .from(event)
    .limit(limit)
    .leftJoin(venue, eq(event.venueId, venue.id))
    .orderBy(desc(event.startDate));
  return events;
};

/**
 * Get distinct sport types available in events that match the given query
 * (excluding sport type filter to show all available sports for the query)
 */
export const getAvailableSports = async (query?: string) => {
  const conditions = [];

  // Filter by name (case-insensitive search in eventName and description)
  if (query) {
    const searchPattern = `%${query}%`;
    conditions.push(
      or(
        ilike(event.eventName, searchPattern),
        ilike(event.description, searchPattern)
      )!
    );
  }

  const baseQuery = db
    .selectDistinct({ sportType: event.sportType })
    .from(event);

  // Apply conditions if any
  const queryBuilder =
    conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

  const results = await queryBuilder.orderBy(event.sportType);
  return results.map((r) => r.sportType);
};
