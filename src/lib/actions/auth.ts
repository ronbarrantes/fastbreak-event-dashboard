"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL?.trim() ??
    process?.env?.VERCEL_URL?.trim() ??
    "http://localhost:3000/";

  url = url.trim();

  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }

  url = url.endsWith("/") ? url : `${url}/`;

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
