import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/portal-data";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { projectId, body } = await req.json();

    if (!projectId || !body || typeof body !== "string") {
      return NextResponse.json({ error: "Project and message body are required." }, { status: 400 });
    }

    const service = createSupabaseServiceClient();
    const { data: project, error: projectError } = await service
      .from("projects")
      .select("id, client_profile_id")
      .eq("id", projectId)
      .maybeSingle();

    if (projectError) {
      throw projectError;
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (!context.isAdmin && project.client_profile_id !== context.profile.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { data, error } = await service
      .from("project_messages")
      .insert({
        project_id: projectId,
        sender_profile_id: context.profile.id,
        sender_name: context.profile.full_name || context.profile.email || "Portal User",
        body: body.trim(),
      })
      .select("id, project_id, sender_name, body, created_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    console.error("Failed to send portal message:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
