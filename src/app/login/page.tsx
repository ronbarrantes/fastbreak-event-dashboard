"use client";
import { useEffect } from "react";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";

import { createClient as createBrowserSupabaseClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    // If already signed in, skip login
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") router.replace("/dashboard");
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google"]}
    />
  );
}

// export default function LoginPage() {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         marginTop: "100px",
//       }}
//     >
//       <h1>Sign in</h1>
//       <GoogleSignInButton />
//     </div>
//   );
// }
