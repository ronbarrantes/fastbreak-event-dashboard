import Link from "next/link";

export default function Home() {
  return (
    <div className="container w-full border border-red-500">
      <header className="flex justify-between border border-green-500">
        <div>
          <div>Event Dashboard</div>
          <div>a fastbreak.ai project</div>
        </div>

        <nav>
          <ul>
            <li>About</li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>Login</li>
          </ul>
        </nav>
      </header>
      <main>
        <section>Hero</section>
        <section>Current events</section>
        <section>Call to action</section>
      </main>
      <footer>Created with love by RonB</footer>
    </div>
  );
}
