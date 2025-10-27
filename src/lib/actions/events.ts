"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/server/db";
import { event, EventInsert } from "@/server/db/schema";

type CreateEventInput = Omit<EventInsert, "id" | "createdAt" | "updatedAt">;
type UpdateEventInput = Partial<CreateEventInput>;

const revalidateIfNeeded = (paths?: string | string[]) => {
  if (!paths) return;
  const list = Array.isArray(paths) ? paths : [paths];
  for (const path of list) revalidatePath(path);
};

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

export const getEvent = async () => {};
export const getEvents = async () => {};
export const updateEvent = async () => {};
export const deleteEvent = async () => {};
