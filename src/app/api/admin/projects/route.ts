import { NextRequest, NextResponse } from "next/server";
import { createReferenceNumber } from "@/lib/reference";
import { getCurrentUserContext } from "@/lib/portal-data";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(req: NextRequest) {
  try {
    const context = await getCurrentUserContext();

    if (!context || !context.isAdmin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const service = createSupabaseServiceClient();

    const totalCost = toNumber(body.totalCost);
    const paidAmount = toNumber(body.paidAmount);
    const remainingAmount = Math.max(totalCost - paidAmount, 0);

    const projectNumber = createReferenceNumber("PRJ");
    const status = typeof body.status === "string" && body.status.trim() ? body.status.trim() : "planning";
    const phase = typeof body.phase === "string" && body.phase.trim() ? body.phase.trim() : "scope_review";

    const insertPayload = {
      project_number: projectNumber,
      quote_id: typeof body.quoteId === "string" && body.quoteId ? body.quoteId : null,
      intake_id: typeof body.intakeId === "string" && body.intakeId ? body.intakeId : null,
      client_profile_id:
        typeof body.clientProfileId === "string" && body.clientProfileId ? body.clientProfileId : null,
      client_email: typeof body.clientEmail === "string" ? body.clientEmail.trim() : null,
      client_name: typeof body.clientName === "string" ? body.clientName.trim() : null,
      company_name: typeof body.companyName === "string" ? body.companyName.trim() : null,
      name: typeof body.name === "string" ? body.name.trim() : "New Client Project",
      project_type: typeof body.projectType === "string" ? body.projectType.trim() : "Custom",
      status,
      phase,
      progress_percentage: toNumber(body.progressPercentage),
      start_date: typeof body.startDate === "string" && body.startDate ? body.startDate : new Date().toISOString(),
      estimated_completion:
        typeof body.estimatedCompletion === "string" && body.estimatedCompletion
          ? body.estimatedCompletion
          : null,
      total_cost: totalCost,
      paid_amount: paidAmount,
      remaining_amount: remainingAmount,
      summary: typeof body.summary === "string" ? body.summary.trim() : null,
    };

    const { data, error } = await service
      .from("projects")
      .insert(insertPayload)
      .select("id, project_number")
      .single();

    if (error) {
      throw error;
    }

    if (insertPayload.intake_id) {
      await service
        .from("intake_requests")
        .update({ status: "workspace_created" })
        .eq("id", insertPayload.intake_id);
    }

    if (insertPayload.quote_id) {
      await service
        .from("quotes")
        .update({ status: "converted" })
        .eq("id", insertPayload.quote_id);
    }

    return NextResponse.json({
      success: true,
      projectId: data.id,
      projectNumber: data.project_number,
    });
  } catch (error) {
    console.error("Failed to create admin project:", error);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}
