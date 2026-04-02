import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { userId, email } = await req.json();
  if (!userId || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check if admin already exists
  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "Admin already set up" }, { status: 403 });
  }

  const { error } = await supabase
    .from("admin_users")
    .insert({ user_id: userId, email });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
