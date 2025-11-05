// import { redirect } from "next/navigation";

// import { createClient } from "@/utils/supabase/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);

//   const errorDescription = searchParams.get("error_description");
//   if (errorDescription) {
//     redirect(`/login?error=${encodeURIComponent(errorDescription)}`);
//   }

//   const code = searchParams.get("code");
//   if (!code) {
//     redirect("/login");
//   }

//   const supabase = await createClient();
//   const { error } = await supabase.auth.exchangeCodeForSession(code);

//   if (error) {
//     redirect("/error");
//   }

//   redirect("/dashboard");
// }

import { NextResponse } from "next/server";

// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // Debug information
  const debugInfo = {
    requestUrl: request.url,
    origin,
    code: code ? "✓ Present" : "✗ Missing",
    nodeEnv: process.env.NODE_ENV,
    envVars: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "(not set)",
      NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL || "(not set)",
      VERCEL_URL: process.env.VERCEL_URL || "(not set)",
    },
    headers: {
      "x-forwarded-host": request.headers.get("x-forwarded-host") || "(not set)",
      "x-forwarded-proto": request.headers.get("x-forwarded-proto") || "(not set)",
      host: request.headers.get("host") || "(not set)",
    },
  };

  console.log("[auth/callback] Debug Info:", JSON.stringify(debugInfo, null, 2));

  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      let redirectUrl: string;
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        redirectUrl = `${origin}${next}`;
      } else if (forwardedHost) {
        redirectUrl = `${forwardedProto}://${forwardedHost}${next}`;
      } else {
        redirectUrl = `${origin}${next}`;
      }

      console.log("[auth/callback] Redirecting to:", redirectUrl);
      console.log("[auth/callback] Using origin:", origin);
      console.log("[auth/callback] Forwarded host:", forwardedHost);
      
      return NextResponse.redirect(redirectUrl);
    } else {
      console.error("[auth/callback] Supabase error:", error);
    }
  }

  // return the user to an error page with instructions
  console.log("[auth/callback] No code or error, redirecting to error page");
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
