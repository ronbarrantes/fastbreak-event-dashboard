"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google"]} // show Google login button
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
