import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/actions/auth";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form action={signInWithGoogle}>
        <Button type="submit">Continue with Google</Button>
      </form>
    </div>
  );
}
