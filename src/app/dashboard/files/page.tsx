import { Download, FolderOpen, MessageSquareText, Receipt } from "lucide-react";
import Link from "next/link";
import { AdminFileUploader } from "@/components/dashboard/admin/AdminForms";
import {
  AdminEmptyState,
  AdminPageIntro,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/dashboard/admin/AdminPrimitives";
import { getAdminWorkspaceData, requireAdminWorkspace } from "@/lib/admin-data";
import { getClientPortalData, requireCurrentUserContext } from "@/lib/portal-data";
import { formatFileSize, formatRelativeTime, formatShortDate } from "@/lib/format";

interface FilesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function FilesPage({ searchParams }: FilesPageProps) {
  const context = await requireCurrentUserContext();

  if (context.isAdmin) {
    const adminContext = await requireAdminWorkspace();
    const workspace = await getAdminWorkspaceData(adminContext.profile.id);
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const projectId = firstValue(resolvedSearchParams.project);
    const selectedProject =
      workspace.projects.find((project) => project.id === projectId) ?? workspace.projects[0] ?? null;

    const projectFiles = workspace.files.filter((file) => file.project_id === selectedProject?.id);

    return (
      <div className="space-y-8">
        <AdminPageIntro
          eyebrow="Files"
          title="Keep project assets, exports, and deliverables attached to the real workspace."
          description="Upload directly into the project, then give the client one clean place to review what was shared."
        />

        <div className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
          <AdminPanel
            title="Project library"
            description="Choose the workspace whose files you want to manage."
          >
            {workspace.projects.length > 0 ? (
              <div className="space-y-3">
                {workspace.projects.map((project) => {
                  const isSelected = project.id === selectedProject?.id;

                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/files?project=${project.id}`}
                      className={`block rounded-[24px] border px-4 py-4 transition ${
                        isSelected
                          ? "border-[#8ae3b4]/25 bg-[linear-gradient(135deg,rgba(138,227,180,0.16),rgba(131,214,255,0.05))]"
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
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#7f8794]">
                        <span>{project.fileCount} files</span>
                        <span>{formatRelativeTime(project.lastActivityAt || project.updated_at)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <AdminEmptyState
                title="No projects yet"
                description="Create a project workspace first, then file management will open automatically."
              />
            )}
          </AdminPanel>

          <div className="space-y-6">
            <AdminPanel
              title={selectedProject ? selectedProject.name : "File workspace"}
              description={
                selectedProject
                  ? "Upload files into this project and make them immediately visible in the client portal."
                  : "Choose a project to manage its files."
              }
              action={
                selectedProject ? (
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/messages?project=${selectedProject.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#d5dbe3] transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <MessageSquareText className="h-3.5 w-3.5" />
                      Messages
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
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Files</div>
                      <div className="mt-2 text-sm font-medium text-white">{projectFiles.length}</div>
                    </div>
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Last upload</div>
                      <div className="mt-2 text-sm font-medium text-white">
                        {formatRelativeTime(projectFiles[0]?.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,28,0.96),rgba(10,12,16,0.98))] px-5 py-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                    <div className="mb-5">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[#7d8795]">Upload</div>
                      <h2 className="mt-2 text-xl font-semibold text-white">
                        Add files directly to the client workspace.
                      </h2>
                    </div>
                    <AdminFileUploader projectId={selectedProject.id} />
                  </div>

                  {projectFiles.length > 0 ? (
                    <div className="space-y-3">
                      {projectFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex flex-col gap-4 rounded-[24px] border border-white/8 bg-white/[0.02] px-5 py-5 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <div className="text-sm font-medium text-white">{file.name}</div>
                            <div className="mt-2 text-sm text-[#9fa8b5]">
                              {file.category || "General"} · {formatFileSize(file.size_bytes)} ·{" "}
                              {file.uploaded_by_label || "CodeLaunch Team"}
                            </div>
                            <div className="mt-2 text-xs text-[#7f8794]">{formatShortDate(file.created_at)}</div>
                          </div>
                          {file.download_url ? (
                            <Link
                              href={file.download_url}
                              target="_blank"
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-[#d4dae3] transition hover:bg-white/[0.06] hover:text-white"
                            >
                              <Download className="h-4 w-4" />
                              Open file
                            </Link>
                          ) : (
                            <div className="text-sm text-[#7f8794]">Link not available</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AdminEmptyState
                      title="No files on this project yet"
                      description="Upload the first asset, export, or deliverable and it will appear here and in the client portal."
                    />
                  )}
                </div>
              ) : (
                <AdminEmptyState
                  title="No project selected"
                  description="Choose a project from the left rail to upload and review files."
                />
              )}
            </AdminPanel>
          </div>
        </div>
      </div>
    );
  }

  const portal = await getClientPortalData(context.profile.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Files & Uploads</h1>
        <p className="mt-1 text-sm text-text-muted">
          Shared assets, exports, and delivery files appear here once your workspace is active.
        </p>
      </div>

      {portal.latestProject ? (
        portal.files.length > 0 ? (
          <div className="space-y-3">
            {portal.files.map((file) => (
              <div
                key={file.id}
                className="flex flex-col gap-4 rounded-2xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="mt-2 text-sm text-text-secondary">
                    {file.category || "General"} · {formatFileSize(file.size_bytes)} ·{" "}
                    {file.uploaded_by_label || "Project team"}
                  </div>
                  <div className="mt-2 text-xs text-text-muted">{formatShortDate(file.created_at)}</div>
                </div>
                {file.download_url ? (
                  <Link
                    href={file.download_url}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-text-secondary transition hover:bg-white/[0.03] hover:text-text-primary"
                  >
                    <Download className="h-4 w-4" />
                    Open file
                  </Link>
                ) : (
                  <div className="text-sm text-text-muted">Link not available</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <FolderOpen className="h-5 w-5 text-accent" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">No files yet</h2>
            <p className="mt-2 text-sm text-text-muted">
              Files will appear here as soon as your team shares assets or deliverables in the portal.
            </p>
          </div>
        )
      ) : (
        <div className="glass-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <FolderOpen className="h-5 w-5 text-accent" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Workspace not active yet</h2>
          <p className="mt-2 text-sm text-text-muted">
            We open file sharing when the project workspace is created, so the portal stays clean and focused.
          </p>
        </div>
      )}
    </div>
  );
}
