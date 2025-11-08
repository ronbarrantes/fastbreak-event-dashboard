"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { event, ticket, TicketInsert, venue } from "@/server/db/schema";
import { revalidateIfNeeded } from "@/utils/revalidate-if-needed";
import { createClient } from "@/utils/supabase/server";

type CreateTicketInput = Omit<TicketInsert, "id" | "userId" | "issuedAt">;
type UpdateTicketInput = Partial<Omit<CreateTicketInput, "eventId">>;

export const getUserTicketForEvent = async (eventId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const tickets = await db
    .select()
    .from(ticket)
    .where(and(eq(ticket.eventId, eventId), eq(ticket.userId, user.id)))
    .limit(1);

  return tickets[0] ?? null;
};

export const createTicket = async (
  input: CreateTicketInput,
  options?: { revalidate?: string | string[] }
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to create tickets");
  }

  // Check if user already has a ticket for this event
  const existingTicket = await getUserTicketForEvent(input.eventId);
  if (existingTicket) {
    throw new Error("You already have a ticket for this event");
  }

  const [created] = await db
    .insert(ticket)
    .values({ ...input, userId: user.id })
    .returning();
  revalidateIfNeeded(options?.revalidate);

  return created;
};

export const getTickets = async () =>
  await db.select().from(ticket).orderBy(desc(ticket.issuedAt));

export const getTicket = async (id: string) => {
  const tickets = await db
    .select()
    .from(ticket)
    .where(eq(ticket.id, id))
    .limit(1);

  return tickets[0] ?? null;
};

export const getUserTickets = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to get tickets");
  }

  return await db
    .select()
    .from(ticket)
    .where(eq(ticket.userId, user.id))
    .orderBy(desc(ticket.issuedAt));
};

export const getUserTicketsWithEvents = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to get tickets");
  }

  return await db
    .select({ ticket, event, venue })
    .from(ticket)
    .where(eq(ticket.userId, user.id))
    .leftJoin(event, eq(ticket.eventId, event.id))
    .leftJoin(venue, eq(event.venueId, venue.id))
    .orderBy(desc(ticket.issuedAt));
};

export const getTicketsByEvent = async (eventId: string) => {
  return await db
    .select()
    .from(ticket)
    .where(eq(ticket.eventId, eventId))
    .orderBy(desc(ticket.issuedAt));
};

export const getTicketsWithEvent = async () => {
  return await db
    .select({ ticket, event })
    .from(ticket)
    .leftJoin(event, eq(ticket.eventId, event.id))
    .orderBy(desc(ticket.issuedAt));
};

export const updateTicket = async (
  id: string,
  changes: UpdateTicketInput,
  options?: { revalidate?: string | string[] }
) => {
  if (!changes || Object.keys(changes).length === 0) return getTicket(id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to update tickets");
  }

  // Verify the ticket belongs to the user
  const existingTicket = await getTicket(id);
  if (existingTicket?.userId !== user.id) {
    throw new Error("You can only update your own tickets");
  }

  const [updated] = await db
    .update(ticket)
    .set(changes)
    .where(eq(ticket.id, id))
    .returning();
  revalidateIfNeeded(options?.revalidate);

  return updated ?? null;
};

export const deleteTicket = async (
  id: string,
  options?: { revalidate?: string | string[] }
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to delete tickets");
  }

  // Verify the ticket belongs to the user
  const existingTicket = await getTicket(id);
  if (existingTicket?.userId !== user.id) {
    throw new Error("You can only delete your own tickets");
  }

  const [deleted] = await db
    .delete(ticket)
    .where(eq(ticket.id, id))
    .returning();
  revalidateIfNeeded(options?.revalidate);

  return deleted ?? null;
};
