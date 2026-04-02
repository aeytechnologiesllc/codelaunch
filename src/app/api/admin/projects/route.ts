import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getSupabase(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll() {},
      },
    }
  );
}

async function checkAdmin(req: NextRequest) {
  const supabase = getSupabase(req);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admin_users").select("id").eq("user_id", user.id).single();
  return data ? user : null;
}

// GET all quotes (admin sees everything)
export async function GET(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const supabase = getSupabase(req);
  const { data: quotes, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Also get projects linked to quotes
  const { data: projects } = await supabase
    .from("projects")
    .select("*, milestones(*)");

  return NextResponse.json({ quotes: quotes || [], projects: projects || [] });
}

// POST create project from a quote
export async function POST(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();
  const { quoteId, name, description, userId } = body;

  if (!quoteId || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getSupabase(req);

  // Create project
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      quote_id: quoteId,
      user_id: userId,
      name,
      description: description || null,
      status: "discovery",
      progress: 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Create default milestones
  const milestones = [
    "Project Received",
    "Requirements Review",
    "Design",
    "Frontend Development",
    "Backend Development",
    "Integration & Testing",
    "Client Review",
    "Launch",
  ].map((title, i) => ({
    project_id: project.id,
    title,
    status: i === 0 ? "completed" : "pending",
    sort_order: i,
  }));

  await supabase.from("milestones").insert(milestones);

  return NextResponse.json({ project });
}
