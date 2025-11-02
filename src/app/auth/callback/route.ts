import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const nextParam = requestUrl.searchParams.get("next");
  const redirectPath = nextParam?.startsWith("/") ? nextParam : "/dashboard";

  if (errorDescription) {
    const url = new URL("/error", requestUrl.origin);
    url.searchParams.set("message", errorDescription);
    return NextResponse.redirect(url);
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/error", requestUrl.origin));
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}
