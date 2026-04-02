import { Files, MessageSquareText, Receipt } from "lucide-react";
import Link from "next/link";
import { MessageComposer } from "@/components/dashboard/MessageComposer";
import {
  AdminEmptyState,
  AdminPageIntro,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/dashboard/admin/AdminPrimitives";
import { getAdminWorkspaceData, requireAdminWorkspace } from "@/lib/admin-data";
import { getClientPortalData, requireCurrentUserContext } from "@/lib/portal-data";
import { formatRelativeTime, formatShortDate } from "@/lib/format";

interface MessagesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function isClientSender(senderName: string, clientName?: string | null, clientEmail?: string | null) {
  const normalizedSender = senderName.trim().toLowerCase();
  return (
    (!!clientName && normalizedSender === clientName.trim().toLowerCase()) ||
    (!!clientEmail && normalizedSender === clientEmail.trim().toLowerCase())
  );
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const context = await requireCurrentUserContext();

  if (context.isAdmin) {
    const adminContext = await requireAdminWorkspace();
    const workspace = await getAdminWorkspaceData(adminContext.profile.id);
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const projectId = firstValue(resolvedSearchParams.project);
    const selectedProject =
      workspace.projects.find((project) => project.id === projectId) ?? workspace.projects[0] ?? null;

    const projectMessages = workspace.messages
      .filter((message) => message.project_id === selectedProject?.id)
      .slice()
      .reverse();

    return (
      <div className="space-y-8">
        <AdminPageIntro
          eyebrow="Messages"
          title="Keep every client conversation inside the portal thread."
          description="Select a project, review the full conversation history, and reply from the same workspace your files, invoices, and delivery status already live in."
        />

        <div className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
          <AdminPanel
            title="Project threads"
            description="Each project keeps one clean communication history."
          >
            {workspace.projects.length > 0 ? (
              <div className="space-y-3">
                {workspace.projects.map((project) => {
                  const isSelected = project.id === selectedProject?.id;
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/messages?project=${project.id}`}
                      className={`block rounded-[24px] border px-4 py-4 transition ${
                        isSelected
                          ? "border-[#83d6ff]/25 bg-[linear-gradient(135deg,rgba(131,214,255,0.16),rgba(242,192,120,0.05))]"
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
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#aeb6c1]">
                        {project.lastMessagePreview || "No messages yet on this workspace."}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#7f8794]">
                        <span>{project.messageCount} messages</span>
                        <span>{formatRelativeTime(project.lastActivityAt || project.updated_at)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <AdminEmptyState
                title="No project threads yet"
                description="Create a workspace from intake first, then the portal thread will open here automatically."
              />
            )}
          </AdminPanel>

          <div className="space-y-6">
            <AdminPanel
              title={selectedProject ? selectedProject.name : "Conversation detail"}
              description={
                selectedProject
                  ? "Portal messages stay attached to the live project so nothing gets lost in email chains."
                  : "Choose a project to read and reply."
              }
              action={
                selectedProject ? (
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/files?project=${selectedProject.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#d5dbe3] transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <Files className="h-3.5 w-3.5" />
                      Files
                    </Link>
                    <Link
                      href={`/dashboard/invoices?project=${selectedProject.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#d5dbe3] transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      Invoices
                    </Link>
                  </div>
                ) : null
              }
            >
              {selectedProject ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Client</div>
                      <div className="mt-2 text-sm font-medium text-white">
                        {selectedProject.client_name || selectedProject.client_email || "Client pending"}
                      </div>
                    </div>
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Messages</div>
                      <div className="mt-2 text-sm font-medium text-white">{selectedProject.messageCount}</div>
                    </div>
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Last reply</div>
                      <div className="mt-2 text-sm font-medium text-white">
                        {formatRelativeTime(selectedProject.lastMessageAt || selectedProject.updated_at)}
                      </div>
                    </div>
                  </div>

                  <div className="max-h-[560px] space-y-4 overflow-y-auto pr-2">
                    {projectMessages.length > 0 ? (
                      projectMessages.map((message) => {
                        const fromClient = isClientSender(
                          message.sender_name,
                          selectedProject.client_name,
                          selectedProject.client_email
                        );

                        return (
                          <div key={message.id} className={`flex ${fromClient ? "justify-start" : "justify-end"}`}>
                            <div
                              className={`max-w-[85%] rounded-[24px] border px-5 py-4 ${
                                fromClient
                                  ? "border-white/10 bg-white/[0.03]"
                                  : "border-[#f2c078]/25 bg-[linear-gradient(135deg,rgba(242,192,120,0.18),rgba(255,255,255,0.03))]"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="text-sm font-medium text-white">{message.sender_name}</div>
                                <div className="text-xs text-[#7f8794]">{formatShortDate(message.created_at)}</div>
                              </div>
                              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#c6ccd5]">
                                {message.body}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <AdminEmptyState
                        title="No portal messages yet"
                        description="Use the composer below to send the first update or question to the client."
                      />
                    )}
                  </div>

                  <MessageComposer
                    projectId={selectedProject.id}
                    variant="admin"
                    label="Reply in portal"
                    placeholder="Write the next client-facing update, question, or milestone note."
                  />
                </div>
              ) : (
                <AdminEmptyState
                  title="No conversation selected"
                  description="Choose a project thread from the left rail to read and send messages."
                />
              )}
            </AdminPanel>
          </div>
        </div>
      </div>
    );
  }

  const portal = await getClientPortalData(context.profile.id);
  const project = portal.latestProject;
  const messages = [...portal.messages].reverse();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="mt-1 text-sm text-text-muted">
          All project communication stays in the portal so there is one clear history.
        </p>
      </div>

      {project ? (
        <>
          <div className="glass-card p-4">
            <div className="text-xs text-text-muted">Current project</div>
            <div className="mt-1 text-sm font-semibold">{project.name}</div>
          </div>

          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => {
                const fromTeam = !isClientSender(message.sender_name, portal.profile.full_name, portal.profile.email);
                return (
                  <div key={message.id} className={`flex gap-3 ${fromTeam ? "" : "justify-end"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl border border-border p-4 ${
                        fromTeam ? "glass-card" : "border-accent/20 bg-accent/10"
                      }`}
                    >
                      <div className="text-xs font-semibold text-text-secondary">{message.sender_name}</div>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{message.body}</p>
                      <div className="mt-3 text-[11px] text-text-muted">{formatShortDate(message.created_at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <MessageSquareText className="h-5 w-5 text-accent" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">No messages yet</h2>
              <p className="mt-2 text-sm text-text-muted">
                When the team posts an update or asks a clarifying question, it will show up here.
              </p>
            </div>
          )}

          <MessageComposer projectId={project.id} />
        </>
      ) : (
        <div className="glass-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <MessageSquareText className="h-5 w-5 text-accent" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Your workspace is being prepared</h2>
          <p className="mt-2 text-sm text-text-muted">
            Portal messaging opens automatically once your intake is approved and the project workspace is created.
          </p>
        </div>
      )}
    </div>
  );
}
