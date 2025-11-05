"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

async function resolveRedirectUrl(pathname: string) {
  const headersList = await headers();
  const origin = headersList.get("origin");

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

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function signInWithGoogle() {
  const supabase = await createClient();

  // const redirectTo = await resolveRedirectUrl("/auth/callback");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getURL(),
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

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
};
