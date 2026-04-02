import {
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  ClipboardList,
  FolderKanban,
  MessageSquareText,
  Receipt,
  Users2,
} from "lucide-react";
import Link from "next/link";
import {
  AdminBreakdownList,
  AdminEmptyState,
  AdminInsightLink,
  AdminLineChart,
  AdminMetricCard,
  AdminPageIntro,
  AdminPanel,
  AdminStatusBadge,
  AdminToneBadge,
} from "@/components/dashboard/admin/AdminPrimitives";
import { getAdminWorkspaceData } from "@/lib/admin-data";
import {
  getClientPortalData,
  requireCurrentUserContext,
} from "@/lib/portal-data";
import {
  formatCompactNumber,
  formatCurrency,
  formatLongDate,
  formatRelativeTime,
  formatShortDate,
  formatStatusLabel,
} from "@/lib/format";

function isLiveProject(status?: string | null) {
  return !["completed", "cancelled", "launched"].includes((status || "").toLowerCase());
}

export default async function DashboardPage() {
  const context = await requireCurrentUserContext();

  if (context.isAdmin) {
    const workspace = await getAdminWorkspaceData(context.profile.id);
    const activeProjects = workspace.projects.filter((project) => isLiveProject(project.status)).slice(0, 5);
    const newIntakes = workspace.intakes.filter((intake) => !intake.linkedProjectId).slice(0, 5);
    const priorityClients = workspace.clients.slice(0, 5);

    return (
      <div className="space-y-8">
        <AdminPageIntro
          eyebrow="Operator Suite"
          title="Run intake, delivery, and client communication from one command room."
          description="This workspace tracks how traffic turns into scoped work, which projects need action, and where client conversations or billing need your attention next."
          actions={
            <>
              <Link
                href="/dashboard/intake"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-[#d2d8e0] transition hover:border-white/18 hover:bg-white/[0.06] hover:text-white"
              >
                Review intake
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#f2c078] px-4 py-2.5 text-sm font-semibold text-[#111318] transition hover:bg-[#ffd8a2]"
              >
                Open projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          }
        />

        <div className="grid gap-4 xl:grid-cols-6">
          <AdminMetricCard
            label="Traffic Pulse"
            value={formatCompactNumber(workspace.metrics.pageViews)}
            meta="14 days"
            icon={BarChart3}
            tone="accent"
          />
          <AdminMetricCard
            label="Unique Visitors"
            value={formatCompactNumber(workspace.metrics.uniqueVisitors)}
            meta="14 days"
            icon={Users2}
            tone="cyan"
          />
          <AdminMetricCard
            label="Saved Quotes"
            value={formatCompactNumber(workspace.metrics.quotesCount)}
            meta={formatCurrency(workspace.metrics.totalQuotedRevenue)}
            icon={Receipt}
            tone="amber"
          />
          <AdminMetricCard
            label="Active Projects"
            value={formatCompactNumber(workspace.metrics.activeProjects)}
            meta={`${workspace.metrics.completedProjects} delivered`}
            icon={FolderKanban}
            tone="mint"
          />
          <AdminMetricCard
            label="Revenue In Flight"
            value={formatCurrency(workspace.metrics.liveContractValue)}
            meta={`${workspace.metrics.clientCount} clients`}
            icon={CircleDollarSign}
            tone="accent"
          />
          <AdminMetricCard
            label="Portal Messages"
            value={formatCompactNumber(workspace.metrics.portalMessages)}
            meta={formatCurrency(workspace.metrics.collectedRevenue)}
            icon={MessageSquareText}
            tone="rose"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <AdminPanel
            title="Traffic pulse"
            description="Live visibility into which pages are actually drawing attention and whether the top of funnel is waking up."
          >
            {workspace.dailyTraffic.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#6f7784]">Page views</div>
                    <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {workspace.metrics.pageViews.toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm text-[#8f97a4]">Visits captured over the last 14 days.</div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#6f7784]">Unique visitors</div>
                    <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {workspace.metrics.uniqueVisitors.toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm text-[#8f97a4]">Session-level reach from the same period.</div>
                  </div>
                </div>
                <AdminLineChart data={workspace.dailyTraffic} dataKey="pageViews" strokeTone="accent" />
              </div>
            ) : (
              <AdminEmptyState
                title="Traffic will appear once visits are recorded"
                description="The analytics layer is already wired in. As soon as people browse the site, this graph will turn into your top-funnel monitor."
              />
            )}
          </AdminPanel>

          <div className="space-y-6">
            <AdminPanel
              title="Pipeline state"
              description="Where new requests are sitting right now."
            >
              <AdminBreakdownList items={workspace.pipeline} />
            </AdminPanel>

            <AdminPanel
              title="Project mix"
              description="What kinds of builds are actually on the board."
            >
              {workspace.projectTypeBreakdown.length > 0 ? (
                <AdminBreakdownList items={workspace.projectTypeBreakdown} compact />
              ) : (
                <AdminEmptyState
                  title="No project mix yet"
                  description="Saved quotes and projects will populate this breakdown automatically."
                />
              )}
            </AdminPanel>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <AdminPanel
            title="Intake queue"
            description="Fresh requests that still need a workspace decision."
            action={
              <Link href="/dashboard/intake" className="text-sm text-[#f2c078] hover:text-[#ffd8a2]">
                Open queue
              </Link>
            }
          >
            {newIntakes.length > 0 ? (
              <div className="space-y-3">
                {newIntakes.map((intake) => (
                  <Link
                    key={intake.id}
                    href={`/dashboard/intake?intake=${intake.id}`}
                    className="block rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4 transition hover:border-white/16 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{intake.client_name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7f8896]">
                          {intake.intake_number}
                        </div>
                      </div>
                      <AdminStatusBadge value={intake.status} />
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#aab2bf]">{intake.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#78808d]">
                      <span>{intake.project_type}</span>
                      <span>{formatRelativeTime(intake.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <AdminEmptyState
                title="No intake waiting"
                description="New client requests will surface here the moment they hit the portal."
              />
            )}
          </AdminPanel>

          <AdminPanel
            title="Projects in motion"
            description="The workspaces most likely to need operator attention next."
            action={
              <Link href="/dashboard/projects" className="text-sm text-[#83d6ff] hover:text-white">
                View all
              </Link>
            }
          >
            {activeProjects.length > 0 ? (
              <div className="space-y-3">
                {activeProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects?project=${project.id}`}
                    className="block rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4 transition hover:border-white/16 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{project.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7f8896]">
                          {project.project_number}
                        </div>
                      </div>
                      <AdminStatusBadge value={project.status} />
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#83d6ff,#8ae3b4)]"
                        style={{ width: `${Math.max(project.progress_percentage, 6)}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#78808d]">
                      <span>{project.phase ? formatStatusLabel(project.phase) : "Phase not set"}</span>
                      <span>{project.progress_percentage}% complete</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <AdminEmptyState
                title="No active workspaces yet"
                description="Create the first project from intake and it will show up here with progress and linked operations."
              />
            )}
          </AdminPanel>

          <AdminPanel
            title="Recent activity"
            description="The latest client-facing movement across messaging, files, billing, and intake."
          >
            {workspace.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {workspace.recentActivity.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.href}
                    className="block rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4 transition hover:border-white/16 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <AdminToneBadge
                        tone={
                          item.type === "message"
                            ? "cyan"
                            : item.type === "file"
                              ? "mint"
                              : item.type === "invoice"
                                ? "amber"
                                : item.type === "intake"
                                  ? "accent"
                                  : "rose"
                        }
                      >
                        {item.type}
                      </AdminToneBadge>
                      <span className="text-xs text-[#78808d]">{formatRelativeTime(item.created_at)}</span>
                    </div>
                    <div className="mt-3 text-sm font-medium text-white">{item.title}</div>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#9aa3b0]">{item.detail}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <AdminEmptyState
                title="No activity yet"
                description="Messages, files, invoices, quotes, and intake requests will all roll into this stream."
              />
            )}
          </AdminPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <AdminPanel
            title="Client relationships"
            description="The client accounts with the most recent activity across intake, quoting, and delivery."
            action={
              <Link href="/dashboard/clients" className="text-sm text-[#8ae3b4] hover:text-white">
                Open clients
              </Link>
            }
          >
            {priorityClients.length > 0 ? (
              <div className="space-y-3">
                {priorityClients.map((client) => (
                  <Link
                    key={client.id}
                    href={`/dashboard/clients?client=${client.id}`}
                    className="grid gap-4 rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4 transition hover:border-white/16 hover:bg-white/[0.05] md:grid-cols-[1.1fr_0.9fr]"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{client.full_name || client.email || "Client"}</div>
                      <div className="mt-1 text-sm text-[#9aa3b0]">{client.company_name || "No company set"}</div>
                      <div className="mt-2 text-xs text-[#78808d]">
                        {client.email || "No email"}{client.phone ? ` · ${client.phone}` : ""}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#78808d]">Quotes</div>
                        <div className="mt-2 text-white">{client.quoteCount}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#78808d]">Projects</div>
                        <div className="mt-2 text-white">{client.projectCount}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#78808d]">Open</div>
                        <div className="mt-2 text-white">{client.activeProjectCount}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <AdminEmptyState
                title="No client records yet"
                description="Once people save quotes or start intake, they will be grouped here by actual client profile."
              />
            )}
          </AdminPanel>

          <AdminPanel
            title="Top pages and next moves"
            description="A quick read on what people are viewing and the fastest actions worth taking next."
          >
            <div className="space-y-5">
              <div className="space-y-3">
                {workspace.topPages.length > 0 ? (
                  workspace.topPages.map((page) => (
                    <div key={page.path} className="flex items-center justify-between gap-4 rounded-[20px] border border-white/8 bg-white/[0.02] px-4 py-3">
                      <div className="min-w-0 text-sm text-white">{page.path}</div>
                      <div className="shrink-0 text-sm text-[#9aa3b0]">{page.views.toLocaleString()} views</div>
                    </div>
                  ))
                ) : (
                  <AdminEmptyState
                    title="No page traffic yet"
                    description="As visits come in, the strongest landing pages will surface here."
                  />
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <AdminInsightLink
                  href="/dashboard/messages"
                  title="Clear the message queue"
                  description="Jump straight into project threads and keep every client conversation inside the portal."
                />
                <AdminInsightLink
                  href="/dashboard/invoices"
                  title="Issue billing updates"
                  description="Create or update milestone invoices without leaving the admin workspace."
                />
              </div>
            </div>
          </AdminPanel>
        </div>
      </div>
    );
  }

  const portal = await getClientPortalData(context.profile.id);
  const project = portal.latestProject;
  const quote = portal.latestQuote;
  const intake = portal.latestIntake;

  if (!project && !quote && !intake) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Portal Overview</h1>
          <p className="mt-1 text-sm text-text-muted">
            Once you save a quote or start an intake request, everything will show up here.
          </p>
        </div>

        <div className="glass-card space-y-4 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <ClipboardList className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">No active requests yet</h2>
            <p className="mt-2 text-sm text-text-muted">
              Start with pricing if you want a scoped quote, or send us your project details and we&apos;ll continue in the portal.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-cta-text transition-colors hover:bg-cta-hover"
            >
              Open Pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm text-text-secondary transition-colors hover:bg-white/[0.03] hover:text-text-primary"
            >
              Start Project Intake
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {project ? formatStatusLabel(project.status) : "In review"}
          </p>
          <h1 className="mt-1 text-2xl font-bold">
            {project?.name || "Project Intake in Progress"}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {project
              ? project.summary || "Your project is now being managed through the portal."
              : "We have your quote and intake details. The next project update will appear here."}
          </p>
        </div>
        <div className="rounded-full border border-border px-4 py-2 text-xs text-text-secondary">
          Communication stays in the portal
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card p-5">
          <div className="text-xs text-text-muted">Latest Quote</div>
          <div className="mt-2 text-lg font-bold">{quote?.quote_number || "Not saved yet"}</div>
          <div className="mt-1 text-xs text-text-muted">
            {quote ? formatCurrency(quote.total_price) : "Save a quote to lock your configuration"}
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="text-xs text-text-muted">Intake Status</div>
          <div className="mt-2 text-lg font-bold">{formatStatusLabel(intake?.status || "pending")}</div>
          <div className="mt-1 text-xs text-text-muted">
            {intake ? formatRelativeTime(intake.created_at) : "Send project details to begin"}
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="text-xs text-text-muted">Project Timeline</div>
          <div className="mt-2 text-lg font-bold">
            {project?.estimated_completion ? formatLongDate(project.estimated_completion) : "Not scheduled"}
          </div>
          <div className="mt-1 text-xs text-text-muted">
            {project?.start_date ? `Started ${formatShortDate(project.start_date)}` : "Waiting for kickoff"}
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="text-xs text-text-muted">Budget Snapshot</div>
          <div className="mt-2 text-lg font-bold">
            {project ? formatCurrency(project.total_cost) : formatCurrency(quote?.total_price || 0)}
          </div>
          <div className="mt-1 text-xs text-text-muted">
            {project?.remaining_amount
              ? `${formatCurrency(project.remaining_amount)} remaining`
              : "Portal-first planning"}
          </div>
        </div>
      </div>

      {project ? (
        <section className="glass-card space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Current Project Status</h2>
              <p className="mt-1 text-sm text-text-muted">
                {project.phase
                  ? `Current phase: ${formatStatusLabel(project.phase)}`
                  : "Project plan is being updated here as work progresses."}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{project.progress_percentage ?? 0}%</div>
              <div className="text-xs text-text-muted">overall progress</div>
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-bg-primary">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(52,211,153,0.6),rgba(52,211,153,1))]"
              style={{ width: `${project.progress_percentage ?? 0}%` }}
            />
          </div>
        </section>
      ) : (
        <section className="glass-card p-6">
          <h2 className="text-base font-semibold">What Happens Next</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              "We review your quote and intake together.",
              "We create your project workspace in the portal.",
              "All questions and updates continue here instead of over calls.",
            ].map((step, index) => (
              <div key={step} className="rounded-2xl border border-border p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Step {index + 1}
                </div>
                <p className="mt-2 text-sm text-text-secondary">{step}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="glass-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Recent portal activity</h2>
            <p className="mt-1 text-sm text-text-muted">
              Messages, shared files, and invoice updates all stay in one place.
            </p>
          </div>
          {project ? <AdminStatusBadge value={project.status} /> : null}
        </div>
        {portal.activity.length > 0 ? (
          <div className="mt-4 space-y-3">
            {portal.activity.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-text-muted">{formatRelativeTime(item.created_at)}</div>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{item.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-text-muted">
            Activity will appear here as soon as the team posts updates or adds delivery items.
          </p>
        )}
      </section>
    </div>
  );
}
