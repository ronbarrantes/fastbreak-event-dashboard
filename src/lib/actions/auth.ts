"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const getURL = () => {
  const envVars = {
    NEXT_PUBLIC_SITE_URL: process?.env?.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_VERCEL_URL: process?.env?.NEXT_PUBLIC_VERCEL_URL,
    VERCEL_URL: process?.env?.VERCEL_URL,
  };

  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Can be manually set in Vercel
    process?.env?.VERCEL_URL ?? // Automatically set by Vercel (server-side only)
    "http://localhost:3000/";

  // Trim any whitespace
  url = url.trim();

  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;

  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;

  console.log("[getURL] Environment variables:", envVars);
  console.log("[getURL] Resolved URL:", url);

  return url;
};

export const resolveRedirectUrl = async (pathname: string) => {
  const baseUrl = getURL();
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${pathname}`;
};

export const signInWithGoogle = async () => {
  const supabase = await createClient();

  const redirectTo = await resolveRedirectUrl("/auth/callback");

  console.log("[signInWithGoogle] Redirect URL being sent to Supabase:", redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error("OAuth error:", error);
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
