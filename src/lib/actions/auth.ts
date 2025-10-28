"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";

async function getRequestOrigin(): Promise<string> {
  const headerStore = await headers();
  const forwardedProto = headerStore.get("x-forwarded-proto");
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = headerStore.get("host");
  const originHeader = headerStore.get("origin");

  const originFromHeaders = originHeader
    ?? (forwardedHost ? `${forwardedProto ?? "https"}://${forwardedHost}` : undefined)
    ?? (host ? `${forwardedProto ?? "http"}://${host}` : undefined);

  return (
    originFromHeaders ?? process.env.NEXT_PUBLIC_SITE_URL ?? ""
  );
}

export async function signInWithGoogle() {
  const origin = await getRequestOrigin();
  const callbackUrl = `${origin}/auth/callback`;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    redirect("/login?message=oauth_signin_failed");
  }

  if (data?.url) {
    redirect(data.url);
  }

  redirect("/login");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
