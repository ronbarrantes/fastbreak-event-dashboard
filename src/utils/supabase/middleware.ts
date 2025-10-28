import { type NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicPrefixes = ["/", "/about", "/login", "/auth", "/error"] as const;
  const isPublicRoute = publicPrefixes.some((prefix) =>
    prefix === "/"
      ? request.nextUrl.pathname === "/"
      : request.nextUrl.pathname.startsWith(prefix)
  );

  if (user && request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    revalidatePath("/dashboard");
    return NextResponse.redirect(url);
  }

  const isProtectedRoute = !isPublicRoute;
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
