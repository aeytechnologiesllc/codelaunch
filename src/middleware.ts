import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Dashboard routes are protected client-side in the dashboard layout
  // Middleware just passes through
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
