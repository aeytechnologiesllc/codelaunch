import "server-only";

import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { appConfig, isAdminEmail } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export type ProfileRole = "admin" | "client";

export interface ProfileRecord {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  role: ProfileRole;
  preferred_contact_method: string | null;
  email_notifications: boolean | null;
  message_notifications: boolean | null;
}

export interface QuoteRecord {
  id: string;
  quote_number: string;
  project_type: string;
  total_price: number;
  monthly_price: number;
  estimated_weeks: number | null;
  selected_features: string[] | null;
  selected_automations: string[] | null;
  custom_feature_description: string | null;
  additional_notes: string | null;
  status: string;
  created_at: string;
}

export interface IntakeRecord {
  id: string;
  intake_number: string;
  project_type: string;
  description: string;
  status: string;
  preferred_contact_method: string;
  created_at: string;
  quote_id: string | null;
}

export interface ProjectRecord {
  id: string;
  project_number: string;
  name: string;
  project_type: string;
  status: string;
  phase: string | null;
  progress_percentage: number | null;
  start_date: string | null;
  estimated_completion: string | null;
  total_cost: number | null;
  paid_amount: number | null;
  remaining_amount: number | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageRecord {
  id: string;
  project_id: string;
  sender_name: string;
  body: string;
  created_at: string;
}

export interface FileRecord {
  id: string;
  project_id: string;
  name: string;
  category: string | null;
  size_bytes: number | null;
  created_at: string;
  uploaded_by_label: string | null;
  download_url: string | null;
}

export interface InvoiceRecord {
  id: string;
  project_id: string;
  invoice_number: string;
  description: string;
  amount_due: number;
  status: string;
  due_date: string | null;
  created_at: string;
}

export interface ActivityRecord {
  id: string;
  type: "message" | "file" | "invoice";
  title: string;
  detail: string;
  created_at: string;
}

export interface ClientPortalData {
  profile: ProfileRecord;
  latestQuote: QuoteRecord | null;
  latestIntake: IntakeRecord | null;
  latestProject: ProjectRecord | null;
  messages: MessageRecord[];
  files: FileRecord[];
  invoices: InvoiceRecord[];
  activity: ActivityRecord[];
}

export interface AdminAnalyticsData {
  profile: ProfileRecord;
  pageViewCount: number;
  uniqueVisitorCount: number;
  quotesCount: number;
  intakeCount: number;
  projectCount: number;
  activeProjectCount: number;
  messageCount: number;
  topPages: Array<{ path: string; views: number }>;
  recentIntakes: Array<{
    id: string;
    intake_number: string;
    client_name: string;
    company_name: string | null;
    project_type: string;
    status: string;
    created_at: string;
  }>;
  recentQuotes: Array<{
    id: string;
    quote_number: string;
    client_name: string;
    company_name: string | null;
    project_type: string;
    total_price: number;
    status: string;
    created_at: string;
  }>;
}

function fallbackNameFromEmail(email?: string | null) {
  if (!email) return "Portal User";
  const [left] = email.split("@");
  return left
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function ensureProfileForUser(user: User) {
  const service = createSupabaseServiceClient();
  const metadata = user.user_metadata ?? {};
  const role: ProfileRole = isAdminEmail(user.email) ? "admin" : "client";

  const profilePayload = {
    id: user.id,
    email: user.email ?? null,
    full_name:
      typeof metadata.full_name === "string" && metadata.full_name.trim().length > 0
        ? metadata.full_name.trim()
        : fallbackNameFromEmail(user.email),
    company_name:
      typeof metadata.company === "string" && metadata.company.trim().length > 0
        ? metadata.company.trim()
        : null,
    role,
    preferred_contact_method: "portal",
    email_notifications: true,
    message_notifications: true,
  };

  const { data: profile, error } = await service
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" })
    .select(
      "id, email, full_name, company_name, phone, role, preferred_contact_method, email_notifications, message_notifications"
    )
    .single();

  if (error) {
    throw error;
  }

  if (user.email) {
    await Promise.allSettled([
      service
        .from("quotes")
        .update({ client_profile_id: user.id })
        .eq("client_email", user.email)
        .is("client_profile_id", null),
      service
        .from("intake_requests")
        .update({ client_profile_id: user.id })
        .eq("client_email", user.email)
        .is("client_profile_id", null),
      service
        .from("projects")
        .update({ client_profile_id: user.id })
        .eq("client_email", user.email)
        .is("client_profile_id", null),
    ]);
  }

  return profile as ProfileRecord;
}

export const getCurrentUserContext = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const profile = await ensureProfileForUser(user);

  return {
    user,
    profile,
    isAdmin: profile.role === "admin",
  };
});

export async function requireCurrentUserContext() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect("/portal/login");
  }

  return context;
}

function buildActivity(
  messages: MessageRecord[],
  files: FileRecord[],
  invoices: InvoiceRecord[]
): ActivityRecord[] {
  const activity = [
    ...messages.slice(0, 3).map((message) => ({
      id: message.id,
      type: "message" as const,
      title: "New portal message",
      detail: `${message.sender_name}: ${message.body}`,
      created_at: message.created_at,
    })),
    ...files.slice(0, 3).map((file) => ({
      id: file.id,
      type: "file" as const,
      title: "New file added",
      detail: file.name,
      created_at: file.created_at,
    })),
    ...invoices.slice(0, 3).map((invoice) => ({
      id: invoice.id,
      type: "invoice" as const,
      title: `Invoice ${invoice.invoice_number}`,
      detail: invoice.description,
      created_at: invoice.created_at,
    })),
  ];

  return activity
    .sort((left, right) => {
      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    })
    .slice(0, 6);
}

function resolveFileUrl(
  service: ReturnType<typeof createSupabaseServiceClient>,
  file: { storage_path?: string | null; file_url?: string | null }
) {
  if (typeof file.file_url === "string" && file.file_url.trim()) {
    return file.file_url;
  }

  if (typeof file.storage_path === "string" && file.storage_path.trim()) {
    return service.storage.from(appConfig.projectFilesBucket).getPublicUrl(file.storage_path).data.publicUrl;
  }

  return null;
}

export async function getClientPortalData(profileId: string): Promise<ClientPortalData> {
  const service = createSupabaseServiceClient();

  const [quoteResponse, intakeResponse, projectResponse] = await Promise.all([
    service
      .from("quotes")
      .select(
        "id, quote_number, project_type, total_price, monthly_price, estimated_weeks, selected_features, selected_automations, custom_feature_description, additional_notes, status, created_at"
      )
      .eq("client_profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    service
      .from("intake_requests")
      .select(
        "id, intake_number, project_type, description, status, preferred_contact_method, created_at, quote_id"
      )
      .eq("client_profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    service
      .from("projects")
      .select(
        "id, project_number, name, project_type, status, phase, progress_percentage, start_date, estimated_completion, total_cost, paid_amount, remaining_amount, summary, created_at, updated_at"
      )
      .eq("client_profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (quoteResponse.error) throw quoteResponse.error;
  if (intakeResponse.error) throw intakeResponse.error;
  if (projectResponse.error) throw projectResponse.error;

  const latestProject = (projectResponse.data ?? null) as ProjectRecord | null;
  const latestQuote = (quoteResponse.data ?? null) as QuoteRecord | null;
  const latestIntake = (intakeResponse.data ?? null) as IntakeRecord | null;

  let messages: MessageRecord[] = [];
  let files: FileRecord[] = [];
  let invoices: InvoiceRecord[] = [];

  if (latestProject) {
    const [messageResponse, fileResponse, invoiceResponse] = await Promise.all([
      service
        .from("project_messages")
        .select("id, project_id, sender_name, body, created_at")
        .eq("project_id", latestProject.id)
        .order("created_at", { ascending: false }),
      service
        .from("project_files")
        .select("id, project_id, name, category, size_bytes, created_at, uploaded_by_label, storage_path, file_url")
        .eq("project_id", latestProject.id)
        .order("created_at", { ascending: false }),
      service
        .from("project_invoices")
        .select("id, project_id, invoice_number, description, amount_due, status, due_date, created_at")
        .eq("project_id", latestProject.id)
        .order("created_at", { ascending: false }),
    ]);

    if (messageResponse.error) throw messageResponse.error;
    if (fileResponse.error) throw fileResponse.error;
    if (invoiceResponse.error) throw invoiceResponse.error;

    messages = (messageResponse.data ?? []) as MessageRecord[];
    files = ((fileResponse.data ?? []) as Array<
      FileRecord & { storage_path?: string | null; file_url?: string | null }
    >).map((file) => ({
      id: file.id,
      project_id: file.project_id,
      name: file.name,
      category: file.category,
      size_bytes: file.size_bytes,
      created_at: file.created_at,
      uploaded_by_label: file.uploaded_by_label,
      download_url: resolveFileUrl(service, file),
    }));
    invoices = (invoiceResponse.data ?? []) as InvoiceRecord[];
  }

  const { profile } = await requireCurrentUserContext();

  return {
    profile,
    latestQuote,
    latestIntake,
    latestProject,
    messages,
    files,
    invoices,
    activity: buildActivity(messages, files, invoices),
  };
}

export async function getAdminAnalytics(profileId: string): Promise<AdminAnalyticsData> {
  const service = createSupabaseServiceClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [profileResponse, pageViewResponse, quotesResponse, intakesResponse, projectsResponse, messagesResponse, recentIntakesResponse, recentQuotesResponse] =
    await Promise.all([
      service
        .from("profiles")
        .select(
          "id, email, full_name, company_name, phone, role, preferred_contact_method, email_notifications, message_notifications"
        )
        .eq("id", profileId)
        .single(),
      service
        .from("page_views")
        .select("path, session_id, created_at")
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false }),
      service
        .from("quotes")
        .select("id", { count: "exact", head: true }),
      service
        .from("intake_requests")
        .select("id", { count: "exact", head: true }),
      service
        .from("projects")
        .select("id, status"),
      service
        .from("project_messages")
        .select("id", { count: "exact", head: true }),
      service
        .from("intake_requests")
        .select("id, intake_number, client_name, company_name, project_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
      service
        .from("quotes")
        .select("id, quote_number, client_name, company_name, project_type, total_price, status, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  if (profileResponse.error) throw profileResponse.error;
  if (pageViewResponse.error) throw pageViewResponse.error;
  if (projectsResponse.error) throw projectsResponse.error;
  if (recentIntakesResponse.error) throw recentIntakesResponse.error;
  if (recentQuotesResponse.error) throw recentQuotesResponse.error;

  const profile = profileResponse.data as ProfileRecord;
  const pageViews = pageViewResponse.data ?? [];
  const uniqueVisitors = new Set(pageViews.map((row) => row.session_id)).size;
  const topPagesMap = new Map<string, number>();

  for (const row of pageViews) {
    const current = topPagesMap.get(row.path) ?? 0;
    topPagesMap.set(row.path, current + 1);
  }

  const topPages = Array.from(topPagesMap.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((left, right) => right.views - left.views)
    .slice(0, 6);

  const projects = projectsResponse.data ?? [];
  const activeProjectCount = projects.filter((project) => {
    return !["completed", "cancelled"].includes((project.status ?? "").toLowerCase());
  }).length;

  return {
    profile,
    pageViewCount: pageViews.length,
    uniqueVisitorCount: uniqueVisitors,
    quotesCount: quotesResponse.count ?? 0,
    intakeCount: intakesResponse.count ?? 0,
    projectCount: projects.length,
    activeProjectCount,
    messageCount: messagesResponse.count ?? 0,
    topPages,
    recentIntakes: recentIntakesResponse.data ?? [],
    recentQuotes: recentQuotesResponse.data ?? [],
  };
}
