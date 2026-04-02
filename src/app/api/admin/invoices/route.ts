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

    if (!body.projectId || !body.description) {
      return NextResponse.json({ error: "Project and description are required." }, { status: 400 });
    }

    const service = createSupabaseServiceClient();
    const amountDue = toNumber(body.amountDue);

    const { data, error } = await service
      .from("project_invoices")
      .insert({
        project_id: body.projectId,
        invoice_number:
          typeof body.invoiceNumber === "string" && body.invoiceNumber.trim()
            ? body.invoiceNumber.trim()
            : createReferenceNumber("INV"),
        description: body.description.trim(),
        amount_due: amountDue,
        status: typeof body.status === "string" && body.status.trim() ? body.status.trim() : "pending",
        due_date: typeof body.dueDate === "string" && body.dueDate ? body.dueDate : null,
      })
      .select("id, invoice_number")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, invoiceId: data.id, invoiceNumber: data.invoice_number });
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return NextResponse.json({ error: "Failed to create invoice." }, { status: 500 });
  }
}
