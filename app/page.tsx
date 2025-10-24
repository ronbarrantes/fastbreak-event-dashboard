import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header>
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
        <div>Hero</div>
        <div>Current events</div>
        <div>Call to action</div>
      </main>
      <footer>Created with love by RonB</footer>
    </div>
  );
}
