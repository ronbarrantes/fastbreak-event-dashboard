"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const getURL = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = process.env.NODE_ENV === "development";

  const envVars = {
    NEXT_PUBLIC_SITE_URL: process?.env?.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_VERCEL_URL: process?.env?.NEXT_PUBLIC_VERCEL_URL,
    VERCEL_URL: process?.env?.VERCEL_URL,
    NODE_ENV: process?.env?.NODE_ENV,
  };

  // In production, we should never use localhost
  let url: string | undefined;

  // Priority order:
  // 1. NEXT_PUBLIC_SITE_URL (explicitly set)
  // 2. NEXT_PUBLIC_VERCEL_URL (manually set in Vercel)
  // 3. VERCEL_URL (automatically set by Vercel)
  // 4. localhost only in development
  url = process?.env?.NEXT_PUBLIC_SITE_URL;

  if (!url) {
    url = process?.env?.NEXT_PUBLIC_VERCEL_URL;
  }

  if (!url) {
    url = process?.env?.VERCEL_URL;
  }

  // Only use localhost in development
  if (!url && isDevelopment) {
    url = "http://localhost:3000";
  }

  // In production, if we still don't have a URL, throw an error
  if (!url && isProduction) {
    console.error("[getURL] ERROR: No URL found in production environment!");
    console.error("[getURL] Environment variables:", envVars);
    throw new Error(
      "Missing NEXT_PUBLIC_SITE_URL or VERCEL_URL environment variable in production"
    );
  }

  // If we still don't have a URL (neither production nor development), default to localhost
  if (!url) {
    url = "http://localhost:3000";
  }

  // Trim any whitespace
  url = url.trim();

  // Make sure to include `https://` when not localhost.
  if (!url.startsWith("http")) {
    // VERCEL_URL doesn't include protocol, so add https://
    url = `https://${url}`;
  }

  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;

  // Remove trailing slash if it's localhost (keep it consistent)
  if (url.includes("localhost")) {
    url = url.replace(/\/+$/, "");
    if (!url.endsWith("/")) {
      url = `${url}/`;
    }
  }

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

  console.log(
    "[signInWithGoogle] Redirect URL being sent to Supabase:",
    redirectTo
  );

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
