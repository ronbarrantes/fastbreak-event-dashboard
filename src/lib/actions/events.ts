"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { event } from "@/server/db/schema";
import type { EventInsert, EventsRow } from "@/server/db/schema";

type CreateEventInput = Omit<EventInsert, "id" | "createdAt" | "updatedAt">;
type UpdateEventInput = Partial<CreateEventInput>;

function revalidateIfNeeded(paths?: string | string[]) {
  if (!paths) return;
  const list = Array.isArray(paths) ? paths : [paths];
  for (const p of list) revalidatePath(p);
}

export async function createEvent(
  input: CreateEventInput,
  options?: { revalidate?: string | string[] }
): Promise<EventsRow> {
  const [created] = await db.insert(event).values({ ...input }).returning();
  revalidateIfNeeded(options?.revalidate);
  return created;
}

export async function getEvent(id: string): Promise<EventsRow | null> {
  const rows = await db.select().from(event).where(eq(event.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listEvents(): Promise<EventsRow[]> {
  return db.select().from(event).orderBy(desc(event.createdAt));
}

export async function updateEvent(
  id: string,
  changes: UpdateEventInput,
  options?: { revalidate?: string | string[] }
): Promise<EventsRow | null> {
  if (!changes || Object.keys(changes).length === 0) {
    return getEvent(id);
  }
  const [updated] = await db
    .update(event)
    .set({ ...changes, updatedAt: new Date() })
    .where(eq(event.id, id))
    .returning();
  revalidateIfNeeded(options?.revalidate);
  return updated ?? null;
}

export async function deleteEvent(
  id: string,
  options?: { revalidate?: string | string[] }
): Promise<EventsRow | null> {
  const [deleted] = await db.delete(event).where(eq(event.id, id)).returning();
  revalidateIfNeeded(options?.revalidate);
  return deleted ?? null;
}
