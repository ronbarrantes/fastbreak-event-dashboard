"use server";

import Link from "next/link";

import { Container } from "@/components/container";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";

export const Header = async () => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-slate-800/60 backdrop-blur-md">
      <Container>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-white transition-colors hover:text-cyan-400"
            >
              Fastbreak <span className="text-cyan-400">Events</span>
            </Link>
          </div>

          <nav className="flex items-center">
            <ul className="flex items-center gap-8 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-300 transition-colors hover:text-cyan-400"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-4">
            {user?.user_metadata?.name ? (
              <span className="hidden text-sm text-slate-400 sm:inline">
                Hi <span className="text-white">{user.user_metadata.name}</span>
              </span>
            ) : null}
          </div>
        </div>
      </Container>
    </header>
  );
};
