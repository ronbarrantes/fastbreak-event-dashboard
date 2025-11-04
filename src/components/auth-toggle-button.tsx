"use server";

import { Suspense } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { createClient } from "@/utils/supabase/server";

export const AuthToggleButton = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = Boolean(user);

  if (isLoggedIn) {
    return (
      <form action={signOutAction}>
        <Button type="submit" variant="ghost">
          Logout
        </Button>
      </form>
    );
  }

  return (
    <Suspense
      fallback={
        <Button variant="ghost" disabled>
          ...
        </Button>
      }
    >
      <Button asChild variant="ghost">
        <Link href="/login">Login</Link>
      </Button>
    </Suspense>
  );
};
