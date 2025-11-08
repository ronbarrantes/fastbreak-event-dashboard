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

  let url: string | undefined;

  url = process?.env?.NEXT_PUBLIC_SITE_URL;

  if (!url) {
    url = process?.env?.NEXT_PUBLIC_VERCEL_URL;
  }

  if (!url) {
    url = process?.env?.VERCEL_URL;
  }

  if (!url && isDevelopment) {
    url = "http://localhost:3000";
  }

  if (!url && isProduction) {
    console.error("[getURL] ERROR: No URL found in production environment!");
    console.error("[getURL] Environment variables:", envVars);
    throw new Error(
      "Missing NEXT_PUBLIC_SITE_URL or VERCEL_URL environment variable in production"
    );
  }

  if (!url) {
    url = "http://localhost:3000";
  }

  url = url.trim();

  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }

  url = url.endsWith("/") ? url : `${url}/`;

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

export const signInWithGoogle = async () => {
  const supabase = createClient();

  const { data, error } = await (
    await supabase
  ).auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getURL(),
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
