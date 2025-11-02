"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "./actions";

export default async function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Continue with your Google account to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signInWithGoogle} className="space-y-4">
            <Button
              type="submit"
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
            >
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
