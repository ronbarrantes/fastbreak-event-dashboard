"use server";

import { revalidatePath } from "next/cache";

import { createClient as createBrowserSupabaseClient } from "@/utils/supabase/client";

export const signOutAction = async () => {
  const supabase = createBrowserSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
};
