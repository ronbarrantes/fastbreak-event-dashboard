"use server";

import { Container } from "@/components/container";

export default async function Home() {
  return (
    <>
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
