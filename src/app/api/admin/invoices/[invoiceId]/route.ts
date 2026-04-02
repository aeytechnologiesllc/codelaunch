import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/portal-data";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const context = await getCurrentUserContext();

    if (!context || !context.isAdmin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { invoiceId } = await params;
    const body = await req.json();
    const service = createSupabaseServiceClient();

    const payload: Record<string, unknown> = {
      description: typeof body.description === "string" ? body.description.trim() : undefined,
      amount_due: body.amountDue === undefined ? undefined : toNumber(body.amountDue),
      status: typeof body.status === "string" ? body.status.trim() : undefined,
      due_date: typeof body.dueDate === "string" ? body.dueDate : undefined,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const { data, error } = await service
      .from("project_invoices")
      .update(payload)
      .eq("id", invoiceId)
      .select("id, invoice_number, status, amount_due, due_date")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, invoice: data });
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return NextResponse.json({ error: "Failed to update invoice." }, { status: 500 });
  }
}
