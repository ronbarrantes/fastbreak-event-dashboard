"use client";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { createClient as createBrowserSupabaseClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        try {
          await fetch("/api/revalidate-auth", { method: "POST" });
        } catch {}
        router.replace("/dashboard");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google"]}
      onlyThirdPartyProviders
    />
  );
}
