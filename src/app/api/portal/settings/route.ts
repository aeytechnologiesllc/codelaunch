import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/portal-data";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function PATCH(req: NextRequest) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const service = createSupabaseServiceClient();

    const { data, error } = await service
      .from("profiles")
      .update({
        full_name: typeof body.fullName === "string" ? body.fullName.trim() : context.profile.full_name,
        company_name: typeof body.companyName === "string" ? body.companyName.trim() : context.profile.company_name,
        phone: typeof body.phone === "string" ? body.phone.trim() : context.profile.phone,
        preferred_contact_method: "portal",
        email_notifications: Boolean(body.emailNotifications),
        message_notifications: Boolean(body.messageNotifications),
      })
      .eq("id", context.profile.id)
      .select(
        "id, email, full_name, company_name, phone, role, preferred_contact_method, email_notifications, message_notifications"
      )
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    console.error("Failed to update portal settings:", error);
    return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
  }
}
