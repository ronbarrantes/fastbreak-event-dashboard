"use server";

import { db } from "@/server/db";
import { venue } from "@/server/db/schema";

export const getVenues = async () => {
  return await db.select().from(venue);
};
