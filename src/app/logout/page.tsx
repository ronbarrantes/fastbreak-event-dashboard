"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createClient as createBrowserSupabaseClient } from "@/utils/supabase/client";

export default function LogoutPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    let isMounted = true;
    supabase.auth
      .signOut()
      .catch(() => {})
      .finally(() => {
        if (isMounted) router.replace("/login");
      });

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  return <div className="p-4">Signing out...</div>;
}
