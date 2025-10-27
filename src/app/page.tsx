"use server";
import React from "react";

import Link from "next/link";

import classNames from "classnames";

import AuthToggleButton from "@/components/auth-toggle-button";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={classNames("container m-auto", className)}>{children}</div>
  );
};

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("NAME-->>>", user?.user_metadata?.name);
  console.log("ID-->>>", user?.id);

  return (
    <>
      <header className="flex w-full border border-dotted border-amber-400">
        <Container className="flex justify-between border border-green-500">
          <div>
            <div className="text-2xl font-semibold">Event Dashboard</div>
            <div>
              a fastbreak.ai project{" "}
              {user?.user_metadata?.name && `hello` + user?.user_metadata?.name}
            </div>
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
            <AuthToggleButton />
          </nav>
        </Container>
      </header>

      <main className="border border-red-500">
        <section>
          <Container>Hero</Container>
        </section>
        <section>
          <Container>Current events</Container>
        </section>
        <section>
          <Container>Call to action</Container>
        </section>
      </main>

      <footer className="flex justify-between border border-green-500">
        <Container>Created with love by RonB</Container>
      </footer>
    </>
  );
}
