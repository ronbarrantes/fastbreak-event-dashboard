import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const errorDescription = searchParams.get("error_description");
  if (errorDescription) {
    redirect(`/login?error=${encodeURIComponent(errorDescription)}`);
  }

  const code = searchParams.get("code");
  if (!code) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirect("/error");
  }

  redirect("/dashboard");
}
