"use server";

import Link from "next/link";

import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import { AuthToggleButton } from "./auth-toggle-button";
import { Container } from "./container";

export const Header = async () => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("USER-->>>", user);

  const loginButtonTitle = user ? "Logout" : "Login";

  return (
    <header className="flex w-full border border-dotted border-amber-400">
      <Container className="flex justify-between border border-green-500">
        <div>
          <div className="text-2xl font-semibold">Event Dashboard</div>
          <div>a fastbreak.ai project {user?.user_metadata?.name ?? ""}</div>
        </div>

        <nav className="flex items-center">
          <ul className="flex h-fit w-fit gap-3">
            <li>
              <Link href="/about">about</Link>
            </li>
            <li>
              <Link href="/dashboard">dashboard</Link>
            </li>
          </ul>
          <form>
            <Button>{loginButtonTitle}</Button>
          </form>
          <AuthToggleButton />
        </nav>
      </Container>
    </header>
  );
};
