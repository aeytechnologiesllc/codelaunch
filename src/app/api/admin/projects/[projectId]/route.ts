import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/portal-data";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const context = await getCurrentUserContext();

    if (!context || !context.isAdmin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await req.json();
    const service = createSupabaseServiceClient();

    const totalCost = toNumber(body.totalCost, undefined as never);
    const paidAmount = toNumber(body.paidAmount, undefined as never);

    const payload: Record<string, unknown> = {
      name: typeof body.name === "string" ? body.name.trim() : undefined,
      project_type: typeof body.projectType === "string" ? body.projectType.trim() : undefined,
      status: typeof body.status === "string" ? body.status.trim() : undefined,
      phase: typeof body.phase === "string" ? body.phase.trim() : undefined,
      progress_percentage:
        body.progressPercentage === undefined ? undefined : toNumber(body.progressPercentage),
      start_date: typeof body.startDate === "string" ? body.startDate : undefined,
      estimated_completion:
        typeof body.estimatedCompletion === "string" ? body.estimatedCompletion : undefined,
      summary: typeof body.summary === "string" ? body.summary.trim() : undefined,
    };

    if (body.totalCost !== undefined) {
      payload.total_cost = totalCost;
    }

    if (body.paidAmount !== undefined) {
      payload.paid_amount = paidAmount;
    }

    if (body.totalCost !== undefined || body.paidAmount !== undefined) {
      const resolvedTotal = typeof totalCost === "number" ? totalCost : 0;
      const resolvedPaid = typeof paidAmount === "number" ? paidAmount : 0;
      payload.remaining_amount = Math.max(resolvedTotal - resolvedPaid, 0);
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const { data, error } = await service
      .from("projects")
      .update(payload)
      .eq("id", projectId)
      .select(
        "id, project_number, name, project_type, status, phase, progress_percentage, total_cost, paid_amount, remaining_amount, updated_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error) {
    console.error("Failed to update admin project:", error);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}
