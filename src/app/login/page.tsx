"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login, signup, signInWithGoogle } from "./actions";

export default async function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to access your event dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="block text-left text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              />
            </div>
            <div className="space-y-2">
              <label
                className="block text-left text-sm font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                formAction={login}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Log in
              </button>
              <button
                formAction={signup}
                className="flex-1 rounded-md border border-input px-4 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
              >
                Sign up
              </button>
            </div>
          </form>

          <form>
            <button
              type="submit"
              formAction={signInWithGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
            >
              Continue with Google
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
