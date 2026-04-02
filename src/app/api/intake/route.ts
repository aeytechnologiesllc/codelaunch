import { NextRequest, NextResponse } from "next/server";
import { createReferenceNumber } from "@/lib/reference";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientName,
      clientEmail,
      companyName,
      projectType,
      description,
      quoteNumber,
    } = body;

    if (!clientName || !clientEmail || !projectType || !description) {
      return NextResponse.json(
        { error: "Name, email, project type, and project details are required." },
        { status: 400 }
      );
    }

    const service = createSupabaseServiceClient();
    let quoteId: string | null = null;

    if (quoteNumber) {
      const { data: quote } = await service
        .from("quotes")
        .select("id")
        .eq("quote_number", quoteNumber)
        .maybeSingle();

      quoteId = quote?.id ?? null;
    }

    const intakeNumber = createReferenceNumber("IN");

    const { data, error } = await service
      .from("intake_requests")
      .insert({
        intake_number: intakeNumber,
        client_name: clientName,
        client_email: clientEmail,
        company_name: companyName || null,
        project_type: projectType,
        description,
        quote_id: quoteId,
        preferred_contact_method: "portal",
        status: "received",
      })
      .select("id, intake_number")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      intakeId: data.id,
      intakeNumber: data.intake_number,
    });
  } catch (error) {
    console.error("Error creating intake request:", error);
    return NextResponse.json(
      { error: "Failed to create intake request." },
      { status: 500 }
    );
  }
}
