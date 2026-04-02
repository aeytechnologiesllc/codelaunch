import { FileText, Files, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { AdminProjectEditor } from "@/components/dashboard/admin/AdminForms";
import {
  AdminEmptyState,
  AdminPageIntro,
  AdminPanel,
  AdminStatusBadge,
  AdminToneBadge,
} from "@/components/dashboard/admin/AdminPrimitives";
import { getAdminWorkspaceData, requireAdminWorkspace } from "@/lib/admin-data";
import { formatCurrency, formatLongDate, formatRelativeTime, formatStatusLabel } from "@/lib/format";

interface ProjectsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const context = await requireAdminWorkspace();
  const workspace = await getAdminWorkspaceData(context.profile.id);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const projectId = firstValue(resolvedSearchParams.project);
  const selectedProject =
    workspace.projects.find((project) => project.id === projectId) ?? workspace.projects[0] ?? null;

  const relatedMessages = workspace.messages
    .filter((message) => message.project_id === selectedProject?.id)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <AdminPageIntro
        eyebrow="Projects"
        title="Manage every live build without leaving the dashboard."
        description="Each project keeps delivery status, billing context, conversation history, and shared files tied to the same workspace so nothing slips into a side channel."
      />

      <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
        <AdminPanel
          title="Project roster"
          description="Every active and completed workspace currently in the system."
        >
          {workspace.projects.length > 0 ? (
            <div className="space-y-3">
              {workspace.projects.map((project) => {
                const isSelected = project.id === selectedProject?.id;
                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects?project=${project.id}`}
                    className={`block rounded-[24px] border px-4 py-4 transition ${
                      isSelected
                        ? "border-[#f2c078]/25 bg-[linear-gradient(135deg,rgba(242,192,120,0.16),rgba(131,214,255,0.06))]"
                        : "border-white/8 bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{project.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7d8795]">
                          {project.project_number}
                        </div>
                      </div>
                      <AdminStatusBadge value={project.status} />
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#83d6ff,#8ae3b4)]"
                        style={{ width: `${Math.max(project.progress_percentage, 5)}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#7f8794]">
                      <span>{project.client_name || project.client_email || "Client pending"}</span>
                      <span>{project.progress_percentage}% complete</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <AdminEmptyState
              title="No projects yet"
              description="Create the first workspace from intake and it will appear here with progress, messaging, files, and billing attached."
            />
          )}
        </AdminPanel>

        <div className="space-y-6">
          <AdminPanel
            title={selectedProject ? selectedProject.name : "Project detail"}
            description={
              selectedProject
                ? "This workspace is the source of truth for delivery, client communication, files, and invoices."
                : "Choose a project to manage it."
            }
          >
            {selectedProject ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Client</div>
                    <div className="mt-2 text-sm font-medium text-white">
                      {selectedProject.client_name || selectedProject.client_email || "Pending client"}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">
                      {selectedProject.company_name || "No company recorded"}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Phase</div>
                    <div className="mt-2 text-sm font-medium text-white">
                      {selectedProject.phase ? formatStatusLabel(selectedProject.phase) : "Phase not set"}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">{selectedProject.progress_percentage}% complete</div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Contract</div>
                    <div className="mt-2 text-sm font-medium text-white">{formatCurrency(selectedProject.total_cost)}</div>
                    <div className="mt-2 text-sm text-[#8f97a4]">
                      {formatCurrency(selectedProject.remaining_amount)} remaining
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Delivery target</div>
                    <div className="mt-2 text-sm font-medium text-white">
                      {selectedProject.estimated_completion
                        ? formatLongDate(selectedProject.estimated_completion)
                        : "Not scheduled"}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">
                      Updated {formatRelativeTime(selectedProject.updated_at)}
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-white/[0.02] px-5 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">Workspace summary</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <AdminToneBadge tone="accent">
                          {selectedProject.project_type || "Custom project"}
                        </AdminToneBadge>
                        <AdminStatusBadge value={selectedProject.status} />
                      </div>
                    </div>
                    <div className="text-right text-sm text-[#8f97a4]">
                      {selectedProject.start_date
                        ? `Started ${formatLongDate(selectedProject.start_date)}`
                        : "Kickoff not marked"}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#c6ccd5]">
                    {selectedProject.summary || "No workspace summary saved yet."}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Link
                    href={`/dashboard/messages?project=${selectedProject.id}`}
                    className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5 transition hover:border-white/16 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3 text-white">
                      <MessageSquareText className="h-4 w-4 text-[#83d6ff]" />
                      <span className="text-sm font-medium">Messages</span>
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {selectedProject.messageCount}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">Open project thread</div>
                  </Link>

                  <Link
                    href={`/dashboard/files?project=${selectedProject.id}`}
                    className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5 transition hover:border-white/16 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3 text-white">
                      <Files className="h-4 w-4 text-[#8ae3b4]" />
                      <span className="text-sm font-medium">Files</span>
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {selectedProject.fileCount}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">Manage project assets</div>
                  </Link>

                  <Link
                    href={`/dashboard/invoices?project=${selectedProject.id}`}
                    className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5 transition hover:border-white/16 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3 text-white">
                      <FileText className="h-4 w-4 text-[#f2c078]" />
                      <span className="text-sm font-medium">Invoices</span>
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {selectedProject.invoiceCount}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">Review billing records</div>
                  </Link>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,28,0.96),rgba(10,12,16,0.98))] px-5 py-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                  <div className="mb-5">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#7d8795]">Edit workspace</div>
                    <h2 className="mt-2 text-xl font-semibold text-white">
                      Update scope, status, financials, and delivery timing.
                    </h2>
                  </div>
                  <AdminProjectEditor project={selectedProject} />
                </div>
              </div>
            ) : (
              <AdminEmptyState
                title="No project selected"
                description="Choose a project from the roster to update it, then jump into its linked messages, files, and invoices."
              />
            )}
          </AdminPanel>

          {selectedProject ? (
            <AdminPanel
              title="Latest conversation"
              description="Most recent messages on this workspace."
              action={
                <Link href={`/dashboard/messages?project=${selectedProject.id}`} className="text-sm text-[#83d6ff] hover:text-white">
                  Open thread
                </Link>
              }
            >
              {relatedMessages.length > 0 ? (
                <div className="space-y-3">
                  {relatedMessages.map((message) => (
                    <div key={message.id} className="rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-white">{message.sender_name}</div>
                        <div className="text-xs text-[#7f8794]">{formatRelativeTime(message.created_at)}</div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#b9c0ca]">{message.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <AdminEmptyState
                  title="No messages on this project yet"
                  description="Open the project thread and send the first client-facing update from the dashboard."
                />
              )}
            </AdminPanel>
          ) : null}
        </div>
      </div>
    </div>
  );
}
