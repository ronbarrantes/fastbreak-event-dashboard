"use server";

import { Suspense } from "react";

import Link from "next/link";

import { Container } from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";
import { AuthToggleButton } from "./auth-toggle-button";

export const Header = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-slate-800/60 backdrop-blur-md">
      <Container>
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-white transition-colors hover:text-cyan-400"
            >
              Fastbreak <span className="text-cyan-400">Events</span>
            </Link>
          </div>
          {user && (
            <nav className="flex items-center">
              <ul className="flex items-center gap-8 text-sm">
                <li>
                  <Link
                    href="/search"
                    className="text-slate-300 transition-colors hover:text-cyan-400"
                  >
                    Search Event
                  </Link>
                </li>
                <li>
                  <Link
                    href="/attending"
                    className="text-slate-300 transition-colors hover:text-cyan-400"
                  >
                    Attending
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-slate-300 transition-colors hover:text-cyan-400"
                  >
                    Manage events
                  </Link>
                </li>
              </ul>
            </nav>
          )}
          <div className="flex items-center justify-end gap-4">
            {user?.user_metadata?.name && (
              <span className="hidden text-sm text-slate-400 sm:inline">
                Hi <span className="text-white">{user.user_metadata.name}</span>
              </span>
            )}
            <Suspense fallback={<Skeleton className="h-10 w-20" />}>
              <AuthToggleButton user={user} />
            </Suspense>
          </div>
        </div>
      </Container>
    </header>
  );
};
