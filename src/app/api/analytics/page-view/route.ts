import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = typeof body.path === "string" ? body.path : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer : null;
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;

    if (!path.startsWith("/")) {
      return NextResponse.json({ error: "Invalid path." }, { status: 400 });
    }

    const service = createSupabaseServiceClient();
    const userAgent = req.headers.get("user-agent");

    const { error } = await service.from("page_views").insert({
      path,
      referrer,
      session_id: sessionId,
      user_agent: userAgent,
    });

    if (error) {
      console.warn("Failed to record page view:", error);
      return NextResponse.json({ success: false }, { status: 202 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn("Failed to record page view:", error);
    return NextResponse.json({ success: false }, { status: 202 });
  }
}
