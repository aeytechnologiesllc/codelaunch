import { NextResponse } from "next/server";

export async function proxy() {
  // Dashboard routes are protected client-side in the dashboard layout.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
