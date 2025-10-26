"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient as createBrowserSupabaseClient } from "@/utils/supabase/client";

export default function AuthToggleButton() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createBrowserSupabaseClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function load() {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!isActive) return;
      setIsLoggedIn(Boolean(data.session));
      setIsLoading(false);
    }

    load();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isActive) return;
        setIsLoggedIn(Boolean(session));
      }
    );

    return () => {
      isActive = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleClick() {
    if (isLoggedIn) {
      await supabase.auth.signOut();
      // Always land on home after logout
      if (pathname !== "/") router.replace("/");
    } else {
      router.push("/login");
    }
  }

  return (
    <Button variant="ghost" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "…" : isLoggedIn ? "Logout" : "Login"}
    </Button>
  );
}
