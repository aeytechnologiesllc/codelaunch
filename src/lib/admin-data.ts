import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { appConfig } from "@/lib/config";
import type { ProfileRecord } from "@/lib/portal-data";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { requireCurrentUserContext } from "@/lib/portal-data";

export interface AdminTrafficPoint {
  date: string;
  label: string;
  pageViews: number;
  uniqueVisitors: number;
}

export interface AdminBreakdownItem {
  label: string;
  value: number;
  tone: "accent" | "cyan" | "mint" | "amber" | "rose";
}

export interface AdminTopPage {
  path: string;
  views: number;
}

export interface AdminMetricSummary {
  pageViews: number;
  uniqueVisitors: number;
  quotesCount: number;
  intakeCount: number;
  activeProjects: number;
  completedProjects: number;
  clientCount: number;
  totalQuotedRevenue: number;
  liveContractValue: number;
  collectedRevenue: number;
  outstandingBalance: number;
  portalMessages: number;
}

export interface AdminClientRecord {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  preferred_contact_method: string | null;
  quoteCount: number;
  intakeCount: number;
  projectCount: number;
  activeProjectCount: number;
  totalQuotedRevenue: number;
  totalProjectRevenue: number;
  outstandingBalance: number;
  latestQuoteNumber: string | null;
  latestIntakeNumber: string | null;
  latestProjectId: string | null;
  latestProjectName: string | null;
  latestProjectStatus: string | null;
  lastActivityAt: string | null;
}

export interface AdminProjectRecord {
  id: string;
  project_number: string;
  name: string;
  client_profile_id: string | null;
  client_name: string | null;
  client_email: string | null;
  company_name: string | null;
  quote_id: string | null;
  intake_id: string | null;
  project_type: string | null;
  status: string;
  phase: string | null;
  progress_percentage: number;
  start_date: string | null;
  estimated_completion: string | null;
  total_cost: number;
  paid_amount: number;
  remaining_amount: number;
  summary: string | null;
  created_at: string;
  updated_at: string;
  messageCount: number;
  fileCount: number;
  invoiceCount: number;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  lastActivityAt: string | null;
}

export interface AdminIntakeRecord {
  id: string;
  intake_number: string;
  client_profile_id: string | null;
  quote_id: string | null;
  client_name: string;
  client_email: string;
  company_name: string | null;
  project_type: string;
  description: string;
  status: string;
  preferred_contact_method: string;
  created_at: string;
  updated_at: string;
  linkedProjectId: string | null;
}

export interface AdminQuoteRecord {
  id: string;
  quote_number: string;
  client_profile_id: string | null;
  client_name: string;
  client_email: string;
  company_name: string | null;
  project_type: string;
  total_price: number;
  monthly_price: number;
  estimated_weeks: number | null;
  status: string;
  created_at: string;
  additional_notes: string | null;
}

export interface AdminMessageRecord {
  id: string;
  project_id: string;
  project_name: string;
  client_name: string | null;
  company_name: string | null;
  sender_name: string;
  body: string;
  created_at: string;
}

export interface AdminFileRecord {
  id: string;
  project_id: string;
  project_name: string;
  client_name: string | null;
  company_name: string | null;
  name: string;
  category: string | null;
  size_bytes: number | null;
  uploaded_by_label: string | null;
  created_at: string;
  download_url: string | null;
}

export interface AdminInvoiceRecord {
  id: string;
  project_id: string;
  project_name: string;
  client_name: string | null;
  company_name: string | null;
  invoice_number: string;
  description: string;
  amount_due: number;
  status: string;
  due_date: string | null;
  created_at: string;
}

export interface AdminActivityRecord {
  id: string;
  type: "quote" | "intake" | "message" | "file" | "invoice";
  title: string;
  detail: string;
  created_at: string;
  href: string;
}

export interface AdminWorkspaceData {
  profile: ProfileRecord;
  metrics: AdminMetricSummary;
  dailyTraffic: AdminTrafficPoint[];
  topPages: AdminTopPage[];
  pipeline: AdminBreakdownItem[];
  projectTypeBreakdown: AdminBreakdownItem[];
  projectStatusBreakdown: AdminBreakdownItem[];
  clients: AdminClientRecord[];
  projects: AdminProjectRecord[];
  intakes: AdminIntakeRecord[];
  quotes: AdminQuoteRecord[];
  messages: AdminMessageRecord[];
  files: AdminFileRecord[];
  invoices: AdminInvoiceRecord[];
  recentActivity: AdminActivityRecord[];
}

interface QuoteRow {
  id: string;
  quote_number: string;
  client_profile_id: string | null;
  client_name: string;
  client_email: string;
  company_name: string | null;
  project_type: string;
  total_price: number | null;
  monthly_price: number | null;
  estimated_weeks: number | null;
  status: string;
  created_at: string;
  additional_notes: string | null;
}

interface IntakeRow {
  id: string;
  intake_number: string;
  client_profile_id: string | null;
  quote_id: string | null;
  client_name: string;
  client_email: string;
  company_name: string | null;
  project_type: string;
  description: string;
  status: string;
  preferred_contact_method: string;
  created_at: string;
  updated_at: string;
}

interface ProjectRow {
  id: string;
  project_number: string;
  quote_id: string | null;
  intake_id: string | null;
  client_profile_id: string | null;
  client_email: string | null;
  client_name: string | null;
  company_name: string | null;
  name: string;
  project_type: string | null;
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

interface MessageRow {
  id: string;
  project_id: string;
  sender_name: string;
  body: string;
  created_at: string;
}

interface FileRow {
  id: string;
  project_id: string;
  name: string;
  category: string | null;
  size_bytes: number | null;
  uploaded_by_label: string | null;
  created_at: string;
  storage_path: string | null;
  file_url?: string | null;
}

interface InvoiceRow {
  id: string;
  project_id: string;
  invoice_number: string;
  description: string;
  amount_due: number | null;
  status: string;
  due_date: string | null;
  created_at: string;
}

interface PageViewRow {
  path: string;
  session_id: string | null;
  created_at: string;
}

function normalizeMoney(value?: number | null) {
  return typeof value === "number" ? value : 0;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function maxDate(values: Array<string | null | undefined>) {
  const timestamps = values
    .filter(Boolean)
    .map((value) => new Date(value as string).getTime())
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function buildTrafficSeries(pageViews: PageViewRow[]) {
  const today = startOfDay(new Date());
  const series: AdminTrafficPoint[] = [];

  for (let offset = 13; offset >= 0; offset -= 1) {
    const current = new Date(today);
    current.setDate(today.getDate() - offset);
    const key = current.toISOString().slice(0, 10);
    series.push({
      date: key,
      label: formatDayLabel(current),
      pageViews: 0,
      uniqueVisitors: 0,
    });
  }

  const sessionMaps = new Map<string, Set<string>>();
  const seriesMap = new Map(series.map((point) => [point.date, point]));

  for (const view of pageViews) {
    const key = new Date(view.created_at).toISOString().slice(0, 10);
    const point = seriesMap.get(key);

    if (!point) continue;

    point.pageViews += 1;

    if (view.session_id) {
      const sessions = sessionMaps.get(key) ?? new Set<string>();
      sessions.add(view.session_id);
      sessionMaps.set(key, sessions);
    }
  }

  for (const point of series) {
    point.uniqueVisitors = sessionMaps.get(point.date)?.size ?? 0;
  }

  return series;
}

function breakdownTone(index: number): AdminBreakdownItem["tone"] {
  return (["accent", "cyan", "mint", "amber", "rose"] as const)[index % 5];
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

export async function requireAdminWorkspace() {
  const context = await requireCurrentUserContext();

  if (!context.isAdmin) {
    redirect("/dashboard");
  }

  return context;
}

export const getAdminWorkspaceData = cache(async (profileId: string): Promise<AdminWorkspaceData> => {
  const service = createSupabaseServiceClient();
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [profileResponse, clientsResponse, quotesResponse, intakesResponse, projectsResponse, messagesResponse, filesResponse, invoicesResponse, pageViewsResponse] =
    await Promise.all([
      service
        .from("profiles")
        .select(
          "id, email, full_name, company_name, phone, role, preferred_contact_method, email_notifications, message_notifications"
        )
        .eq("id", profileId)
        .single(),
      service
        .from("profiles")
        .select(
          "id, email, full_name, company_name, phone, role, preferred_contact_method, email_notifications, message_notifications, created_at, updated_at"
        )
        .eq("role", "client")
        .order("updated_at", { ascending: false }),
      service
        .from("quotes")
        .select(
          "id, quote_number, client_profile_id, client_name, client_email, company_name, project_type, total_price, monthly_price, estimated_weeks, status, created_at, additional_notes"
        )
        .order("created_at", { ascending: false }),
      service
        .from("intake_requests")
        .select(
          "id, intake_number, client_profile_id, quote_id, client_name, client_email, company_name, project_type, description, status, preferred_contact_method, created_at, updated_at"
        )
        .order("created_at", { ascending: false }),
      service
        .from("projects")
        .select(
          "id, project_number, quote_id, intake_id, client_profile_id, client_email, client_name, company_name, name, project_type, status, phase, progress_percentage, start_date, estimated_completion, total_cost, paid_amount, remaining_amount, summary, created_at, updated_at"
        )
        .order("updated_at", { ascending: false }),
      service
        .from("project_messages")
        .select("id, project_id, sender_name, body, created_at")
        .order("created_at", { ascending: false }),
      service
        .from("project_files")
        .select("id, project_id, name, category, size_bytes, uploaded_by_label, created_at, storage_path, file_url")
        .order("created_at", { ascending: false }),
      service
        .from("project_invoices")
        .select("id, project_id, invoice_number, description, amount_due, status, due_date, created_at")
        .order("created_at", { ascending: false }),
      service
        .from("page_views")
        .select("path, session_id, created_at")
        .gte("created_at", fourteenDaysAgo)
        .order("created_at", { ascending: false }),
    ]);

  if (profileResponse.error) throw profileResponse.error;
  if (clientsResponse.error) throw clientsResponse.error;
  if (quotesResponse.error) throw quotesResponse.error;
  if (intakesResponse.error) throw intakesResponse.error;
  if (projectsResponse.error) throw projectsResponse.error;
  if (messagesResponse.error) throw messagesResponse.error;
  if (filesResponse.error) throw filesResponse.error;
  if (invoicesResponse.error) throw invoicesResponse.error;
  if (pageViewsResponse.error) throw pageViewsResponse.error;

  const profile = profileResponse.data as ProfileRecord;
  const quotes = (quotesResponse.data ?? []) as QuoteRow[];
  const intakes = (intakesResponse.data ?? []) as IntakeRow[];
  const projects = (projectsResponse.data ?? []) as ProjectRow[];
  const messages = (messagesResponse.data ?? []) as MessageRow[];
  const files = (filesResponse.data ?? []) as FileRow[];
  const invoices = (invoicesResponse.data ?? []) as InvoiceRow[];
  const pageViews = (pageViewsResponse.data ?? []) as PageViewRow[];
  const clientProfiles = (clientsResponse.data ?? []) as Array<
    ProfileRecord & { created_at: string; updated_at: string }
  >;

  const projectById = new Map(projects.map((project) => [project.id, project]));
  const linkedProjectByIntake = new Map(projects.filter((project) => project.intake_id).map((project) => [project.intake_id as string, project.id]));

  const messageGroups = new Map<string, MessageRow[]>();
  for (const message of messages) {
    const list = messageGroups.get(message.project_id) ?? [];
    list.push(message);
    messageGroups.set(message.project_id, list);
  }

  const fileGroups = new Map<string, FileRow[]>();
  for (const file of files) {
    const list = fileGroups.get(file.project_id) ?? [];
    list.push(file);
    fileGroups.set(file.project_id, list);
  }

  const invoiceGroups = new Map<string, InvoiceRow[]>();
  for (const invoice of invoices) {
    const list = invoiceGroups.get(invoice.project_id) ?? [];
    list.push(invoice);
    invoiceGroups.set(invoice.project_id, list);
  }

  const projectRecords: AdminProjectRecord[] = projects.map((project) => {
    const projectMessages = messageGroups.get(project.id) ?? [];
    const projectFiles = fileGroups.get(project.id) ?? [];
    const projectInvoices = invoiceGroups.get(project.id) ?? [];
    const latestMessage = projectMessages[0];

    return {
      id: project.id,
      project_number: project.project_number,
      name: project.name,
      client_profile_id: project.client_profile_id,
      client_name: project.client_name,
      client_email: project.client_email,
      company_name: project.company_name,
      quote_id: project.quote_id,
      intake_id: project.intake_id,
      project_type: project.project_type,
      status: project.status,
      phase: project.phase,
      progress_percentage: project.progress_percentage ?? 0,
      start_date: project.start_date,
      estimated_completion: project.estimated_completion,
      total_cost: normalizeMoney(project.total_cost),
      paid_amount: normalizeMoney(project.paid_amount),
      remaining_amount: normalizeMoney(project.remaining_amount),
      summary: project.summary,
      created_at: project.created_at,
      updated_at: project.updated_at,
      messageCount: projectMessages.length,
      fileCount: projectFiles.length,
      invoiceCount: projectInvoices.length,
      lastMessageAt: latestMessage?.created_at ?? null,
      lastMessagePreview: latestMessage?.body ?? null,
      lastActivityAt: maxDate([
        project.updated_at,
        latestMessage?.created_at,
        projectFiles[0]?.created_at,
        projectInvoices[0]?.created_at,
      ]),
    };
  });

  const intakeRecords: AdminIntakeRecord[] = intakes.map((intake) => ({
    ...intake,
    linkedProjectId: linkedProjectByIntake.get(intake.id) ?? null,
  }));

  const quoteRecords: AdminQuoteRecord[] = quotes.map((quote) => ({
    ...quote,
    total_price: normalizeMoney(quote.total_price),
    monthly_price: normalizeMoney(quote.monthly_price),
  }));

  const messageRecords: AdminMessageRecord[] = messages.map((message) => {
    const project = projectById.get(message.project_id);
    return {
      id: message.id,
      project_id: message.project_id,
      project_name: project?.name ?? "Unknown project",
      client_name: project?.client_name ?? null,
      company_name: project?.company_name ?? null,
      sender_name: message.sender_name,
      body: message.body,
      created_at: message.created_at,
    };
  });

  const fileRecords: AdminFileRecord[] = files.map((file) => {
    const project = projectById.get(file.project_id);
    return {
      id: file.id,
      project_id: file.project_id,
      project_name: project?.name ?? "Unknown project",
      client_name: project?.client_name ?? null,
      company_name: project?.company_name ?? null,
      name: file.name,
      category: file.category,
      size_bytes: file.size_bytes,
      uploaded_by_label: file.uploaded_by_label,
      created_at: file.created_at,
      download_url: resolveFileUrl(service, file),
    };
  });

  const invoiceRecords: AdminInvoiceRecord[] = invoices.map((invoice) => {
    const project = projectById.get(invoice.project_id);
    return {
      id: invoice.id,
      project_id: invoice.project_id,
      project_name: project?.name ?? "Unknown project",
      client_name: project?.client_name ?? null,
      company_name: project?.company_name ?? null,
      invoice_number: invoice.invoice_number,
      description: invoice.description,
      amount_due: normalizeMoney(invoice.amount_due),
      status: invoice.status,
      due_date: invoice.due_date,
      created_at: invoice.created_at,
    };
  });

  const clientRecords: AdminClientRecord[] = clientProfiles
    .map((client) => {
      const clientQuotes = quoteRecords.filter(
        (quote) => quote.client_profile_id === client.id || quote.client_email === client.email
      );
      const clientIntakes = intakeRecords.filter(
        (intake) => intake.client_profile_id === client.id || intake.client_email === client.email
      );
      const clientProjects = projectRecords.filter(
        (project) => project.client_profile_id === client.id || project.client_email === client.email
      );

      const latestProject = clientProjects[0] ?? null;
      const lastActivityAt = maxDate([
        client.updated_at,
        clientQuotes[0]?.created_at,
        clientIntakes[0]?.created_at,
        latestProject?.lastActivityAt,
      ]);

      return {
        id: client.id,
        email: client.email,
        full_name: client.full_name,
        company_name: client.company_name,
        phone: client.phone,
        preferred_contact_method: client.preferred_contact_method,
        quoteCount: clientQuotes.length,
        intakeCount: clientIntakes.length,
        projectCount: clientProjects.length,
        activeProjectCount: clientProjects.filter(
          (project) => !["completed", "cancelled", "launched"].includes(project.status)
        ).length,
        totalQuotedRevenue: clientQuotes.reduce((total, quote) => total + quote.total_price, 0),
        totalProjectRevenue: clientProjects.reduce((total, project) => total + project.total_cost, 0),
        outstandingBalance: clientProjects.reduce(
          (total, project) => total + project.remaining_amount,
          0
        ),
        latestQuoteNumber: clientQuotes[0]?.quote_number ?? null,
        latestIntakeNumber: clientIntakes[0]?.intake_number ?? null,
        latestProjectId: latestProject?.id ?? null,
        latestProjectName: latestProject?.name ?? null,
        latestProjectStatus: latestProject?.status ?? null,
        lastActivityAt,
      };
    })
    .sort((left, right) => {
      return new Date(right.lastActivityAt ?? 0).getTime() - new Date(left.lastActivityAt ?? 0).getTime();
    });

  const topPagesMap = new Map<string, number>();
  for (const row of pageViews) {
    topPagesMap.set(row.path, (topPagesMap.get(row.path) ?? 0) + 1);
  }

  const topPages = Array.from(topPagesMap.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((left, right) => right.views - left.views)
    .slice(0, 6);

  const dailyTraffic = buildTrafficSeries(pageViews);
  const uniqueVisitors = new Set(pageViews.map((row) => row.session_id).filter(Boolean)).size;
  const activeProjects = projectRecords.filter(
    (project) => !["completed", "cancelled", "launched"].includes(project.status)
  );
  const completedProjects = projectRecords.filter((project) =>
    ["completed", "launched"].includes(project.status)
  );

  const totalQuotedRevenue = quoteRecords.reduce((total, quote) => total + quote.total_price, 0);
  const liveContractValue = activeProjects.reduce((total, project) => total + project.total_cost, 0);
  const collectedRevenue = projectRecords.reduce((total, project) => total + project.paid_amount, 0);
  const outstandingBalance = projectRecords.reduce(
    (total, project) => total + project.remaining_amount,
    0
  );

  const pipeline: AdminBreakdownItem[] = [
    {
      label: "Quotes waiting",
      value: quoteRecords.filter((quote) => quote.status === "saved").length,
      tone: "accent",
    },
    {
      label: "Intakes in review",
      value: intakeRecords.filter((intake) => !intake.linkedProjectId).length,
      tone: "amber",
    },
    {
      label: "Planning",
      value: projectRecords.filter((project) => project.status === "planning").length,
      tone: "cyan",
    },
    {
      label: "In build",
      value: projectRecords.filter((project) =>
        ["active", "design", "development", "testing", "in_review", "discovery"].includes(project.status)
      ).length,
      tone: "mint",
    },
    {
      label: "Completed",
      value: completedProjects.length,
      tone: "rose",
    },
  ];

  const typeCounts = new Map<string, number>();
  for (const project of projectRecords) {
    const label = project.project_type || "Custom";
    typeCounts.set(label, (typeCounts.get(label) ?? 0) + 1);
  }
  for (const quote of quoteRecords) {
    if (typeCounts.size >= 5) break;
    if (!typeCounts.has(quote.project_type)) {
      typeCounts.set(quote.project_type, 0);
    }
  }
  const projectTypeBreakdown = Array.from(typeCounts.entries())
    .map(([label, value], index) => ({
      label,
      value,
      tone: breakdownTone(index),
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);

  const statusCounts = new Map<string, number>();
  for (const project of projectRecords) {
    const label = project.status.replace(/[_-]+/g, " ");
    statusCounts.set(label, (statusCounts.get(label) ?? 0) + 1);
  }
  const projectStatusBreakdown = Array.from(statusCounts.entries())
    .map(([label, value], index) => ({
      label,
      value,
      tone: breakdownTone(index),
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);

  const recentActivity: AdminActivityRecord[] = [
    ...messageRecords.slice(0, 8).map((message) => ({
      id: message.id,
      type: "message" as const,
      title: message.sender_name,
      detail: `${message.project_name}: ${message.body}`,
      created_at: message.created_at,
      href: `/dashboard/messages?project=${message.project_id}`,
    })),
    ...fileRecords.slice(0, 8).map((file) => ({
      id: file.id,
      type: "file" as const,
      title: file.name,
      detail: `${file.project_name} · ${file.category || "General file"}`,
      created_at: file.created_at,
      href: `/dashboard/files?project=${file.project_id}`,
    })),
    ...invoiceRecords.slice(0, 8).map((invoice) => ({
      id: invoice.id,
      type: "invoice" as const,
      title: invoice.invoice_number,
      detail: `${invoice.project_name} · ${invoice.description}`,
      created_at: invoice.created_at,
      href: `/dashboard/invoices?project=${invoice.project_id}`,
    })),
    ...intakeRecords.slice(0, 8).map((intake) => ({
      id: intake.id,
      type: "intake" as const,
      title: intake.intake_number,
      detail: `${intake.client_name} · ${intake.project_type}`,
      created_at: intake.created_at,
      href: `/dashboard/intake?intake=${intake.id}`,
    })),
    ...quoteRecords.slice(0, 8).map((quote) => ({
      id: quote.id,
      type: "quote" as const,
      title: quote.quote_number,
      detail: `${quote.client_name} · ${quote.project_type}`,
      created_at: quote.created_at,
      href: `/dashboard/intake?quote=${quote.id}`,
    })),
  ]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .slice(0, 14);

  return {
    profile,
    metrics: {
      pageViews: pageViews.length,
      uniqueVisitors,
      quotesCount: quoteRecords.length,
      intakeCount: intakeRecords.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      clientCount: clientRecords.length,
      totalQuotedRevenue,
      liveContractValue,
      collectedRevenue,
      outstandingBalance,
      portalMessages: messageRecords.length,
    },
    dailyTraffic,
    topPages,
    pipeline,
    projectTypeBreakdown,
    projectStatusBreakdown,
    clients: clientRecords,
    projects: projectRecords,
    intakes: intakeRecords,
    quotes: quoteRecords,
    messages: messageRecords,
    files: fileRecords,
    invoices: invoiceRecords,
    recentActivity,
  };
});
