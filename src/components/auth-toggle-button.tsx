"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient as createBrowserSupabaseClient } from "@/utils/supabase/client";

export const AuthToggleButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createBrowserSupabaseClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!isActive) return;
      setIsLoggedIn(Boolean(data.session));
      setIsLoading(false);
    };

    load();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (!isActive) return;
        setIsLoggedIn(Boolean(session));
      }
    );

    return () => {
      isActive = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleClick = async () => {
    if (isLoggedIn) {
      await supabase.auth.signOut();
      router.refresh();
      if (pathname !== "/") router.replace("/");
    } else {
      router.push("/login");
    }
  };

  return (
    <Button variant="ghost" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "..." : isLoggedIn ? "Logout" : "Login"}
    </Button>
  );
};
