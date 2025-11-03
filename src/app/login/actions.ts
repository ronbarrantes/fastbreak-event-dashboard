"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

function resolveRedirectUrl(pathname: string) {
  const origin = headers().get("origin");

  if (origin) {
    return `${origin}${pathname}`;
  }

  const fallback = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL;

  if (fallback) {
    const resolved = fallback.startsWith("http")
      ? fallback
      : `https://${fallback}`;

    return `${resolved}${pathname}`;
  }

  throw new Error(
    "Unable to determine redirect URL for Supabase OAuth callback. Ensure NEXT_PUBLIC_SITE_URL or VERCEL_URL is set."
  );
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const redirectTo = resolveRedirectUrl("/auth/callback");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    redirect("/error");
  }

  if (data?.url) {
    redirect(data.url);
  }

  redirect("/login");
}
