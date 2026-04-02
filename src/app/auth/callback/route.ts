import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/dashboard";

  if (!code) {
    // No code — redirect to login with error
    const loginUrl = new URL("/portal/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const redirectUrl = new URL(redirect, req.url);
  const response = NextResponse.redirect(redirectUrl);

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Auth callback error:", error.message);
      return NextResponse.redirect(new URL("/portal/login", req.url));
    }
  } catch (err) {
    console.error("Auth callback exception:", err);
    return NextResponse.redirect(new URL("/portal/login", req.url));
  }

  return response;
}
