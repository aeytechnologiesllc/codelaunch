import { NextRequest, NextResponse } from "next/server";
import { createReferenceNumber } from "@/lib/reference";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      clientName,
      clientEmail,
      clientPhone,
      companyName,
      projectType,
      selectedFeatures,
      selectedAutomations,
      additionalNotes,
      customFeatureDescription,
      customFeaturePrice,
      designLevel,
      selectedTemplate,
      revisionRounds,
      rushDelivery,
      maintenancePlan,
      paymentPlan,
      totalPrice,
      monthlyPrice,
      estimatedWeeks,
    } = body;

    if (!clientName || !clientEmail || !projectType || !totalPrice) {
      return NextResponse.json(
        { error: "Name, email, project type, and total price are required" },
        { status: 400 }
      );
    }

    const service = createSupabaseServiceClient();
    const quoteNumber = createReferenceNumber("CL");

    const { data, error } = await service
      .from("quotes")
      .insert({
        quote_number: quoteNumber,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone || null,
        company_name: companyName || null,
        project_type: projectType,
        selected_features: selectedFeatures || [],
        selected_automations: selectedAutomations || [],
        additional_notes: additionalNotes || null,
        custom_feature_description: customFeatureDescription || null,
        custom_feature_price: customFeaturePrice || 0,
        design_level: designLevel || "standard",
        selected_template: selectedTemplate || null,
        revision_rounds: revisionRounds || "2",
        rush_delivery: rushDelivery || false,
        maintenance_plan: maintenancePlan || "none",
        payment_plan: paymentPlan || "full",
        total_price: totalPrice,
        monthly_price: monthlyPrice || 0,
        estimated_weeks: estimatedWeeks,
        status: "saved",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      quoteNumber,
      quoteId: data.id,
    });
  } catch (error) {
    console.error("Error saving quote:", error);
    return NextResponse.json(
      { error: "Failed to save quote" },
      { status: 500 }
    );
  }
}
