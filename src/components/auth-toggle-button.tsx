"use server";

import Link from "next/link";

import { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";

export const AuthToggleButton = async ({ user }: { user: User | null }) => {
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
    <Button asChild variant="ghost">
      <Link href="/login">Login</Link>
    </Button>
  );
};
