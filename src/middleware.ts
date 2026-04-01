import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  // Only protect dashboard routes
  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Check for Supabase auth token in cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If no Supabase configured, redirect to login
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  // Check for the auth token cookie
  const authToken =
    request.cookies.get("sb-" + new URL(supabaseUrl).hostname.split(".")[0] + "-auth-token")?.value;

  if (!authToken) {
    // No auth cookie — redirect to login
    const loginUrl = new URL("/portal/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
