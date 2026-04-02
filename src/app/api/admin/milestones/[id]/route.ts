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

// PATCH update milestone status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const supabase = getSupabase(req);

  const updateData: Record<string, unknown> = { status: body.status };
  if (body.status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }
  if (body.description !== undefined) {
    updateData.description = body.description;
  }

  const { data, error } = await supabase
    .from("milestones")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update project progress based on completed milestones
  if (data.project_id) {
    const { data: allMilestones } = await supabase
      .from("milestones")
      .select("status")
      .eq("project_id", data.project_id);

    if (allMilestones) {
      const total = allMilestones.length;
      const completed = allMilestones.filter((m) => m.status === "completed").length;
      const progress = Math.round((completed / total) * 100);

      // Determine project status from milestones
      let projectStatus = "discovery";
      if (completed >= total) projectStatus = "launched";
      else if (completed > 5) projectStatus = "testing";
      else if (completed > 2) projectStatus = "development";
      else if (completed > 1) projectStatus = "design";

      await supabase
        .from("projects")
        .update({ progress, status: projectStatus, updated_at: new Date().toISOString() })
        .eq("id", data.project_id);
    }
  }

  return NextResponse.json({ milestone: data });
}
