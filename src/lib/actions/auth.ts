"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

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

export const resolveRedirectUrl = async (pathname: string) => {
  const baseUrl = getURL();
  // Remove trailing slash from baseUrl if present, then add pathname
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${pathname}`;
};

export const signInWithGoogle = async () => {
  const supabase = await createClient();

  const redirectTo = await resolveRedirectUrl("/auth/callback");

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
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
};
