import { MessageSquareText, Receipt } from "lucide-react";
import Link from "next/link";
import { AdminInvoiceComposer, AdminInvoiceEditor } from "@/components/dashboard/admin/AdminForms";
import {
  AdminEmptyState,
  AdminPageIntro,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/dashboard/admin/AdminPrimitives";
import { getAdminWorkspaceData, requireAdminWorkspace } from "@/lib/admin-data";
import { getClientPortalData, requireCurrentUserContext } from "@/lib/portal-data";
import { formatCurrency, formatRelativeTime, formatShortDate } from "@/lib/format";

interface InvoicesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const context = await requireCurrentUserContext();

  if (context.isAdmin) {
    const adminContext = await requireAdminWorkspace();
    const workspace = await getAdminWorkspaceData(adminContext.profile.id);
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const projectId = firstValue(resolvedSearchParams.project);
    const invoiceId = firstValue(resolvedSearchParams.invoice);

    const selectedProject =
      workspace.projects.find((project) => project.id === projectId) ?? workspace.projects[0] ?? null;
    const projectInvoices = workspace.invoices.filter((invoice) => invoice.project_id === selectedProject?.id);
    const selectedInvoice =
      projectInvoices.find((invoice) => invoice.id === invoiceId) ?? projectInvoices[0] ?? null;

    const totalInvoiced = projectInvoices.reduce((total, invoice) => total + invoice.amount_due, 0);
    const paidInvoices = projectInvoices.filter((invoice) => invoice.status === "paid");

    return (
      <div className="space-y-8">
        <AdminPageIntro
          eyebrow="Invoices"
          title="Issue milestone billing inside the same workspace you deliver from."
          description="Billing belongs next to the project, not in a separate tool, so each invoice stays connected to the client thread, contract value, and current delivery status."
        />

        <div className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
          <AdminPanel
            title="Project billing"
            description="Select the project whose invoices you want to manage."
          >
            {workspace.projects.length > 0 ? (
              <div className="space-y-3">
                {workspace.projects.map((project) => {
                  const isSelected = project.id === selectedProject?.id;
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/invoices?project=${project.id}`}
                      className={`block rounded-[24px] border px-4 py-4 transition ${
                        isSelected
                          ? "border-[#f2c078]/25 bg-[linear-gradient(135deg,rgba(242,192,120,0.16),rgba(255,255,255,0.03))]"
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
                        <span>{project.invoiceCount} invoices</span>
                        <span>{formatCurrency(project.remaining_amount)} open</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <AdminEmptyState
                title="No project billing yet"
                description="Create a project workspace first, then billing records will open here."
              />
            )}
          </AdminPanel>

          <div className="space-y-6">
            <AdminPanel
              title={selectedProject ? selectedProject.name : "Billing detail"}
              description={
                selectedProject
                  ? "Create and update invoices without leaving the project context."
                  : "Choose a project to manage its invoices."
              }
              action={
                selectedProject ? (
                  <Link
                    href={`/dashboard/messages?project=${selectedProject.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#d5dbe3] transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <MessageSquareText className="h-3.5 w-3.5" />
                    Messages
                  </Link>
                ) : null
              }
            >
              {selectedProject ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Contract</div>
                      <div className="mt-2 text-sm font-medium text-white">{formatCurrency(selectedProject.total_cost)}</div>
                    </div>
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Invoiced</div>
                      <div className="mt-2 text-sm font-medium text-white">{formatCurrency(totalInvoiced)}</div>
                    </div>
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Paid</div>
                      <div className="mt-2 text-sm font-medium text-white">
                        {formatCurrency(paidInvoices.reduce((total, invoice) => total + invoice.amount_due, 0))}
                      </div>
                    </div>
                    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Remaining</div>
                      <div className="mt-2 text-sm font-medium text-white">{formatCurrency(selectedProject.remaining_amount)}</div>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,28,0.96),rgba(10,12,16,0.98))] px-5 py-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                    <div className="mb-5">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[#7d8795]">Create invoice</div>
                      <h2 className="mt-2 text-xl font-semibold text-white">
                        Add the next milestone or payment request.
                      </h2>
                    </div>
                    <AdminInvoiceComposer projectId={selectedProject.id} />
                  </div>

                  {projectInvoices.length > 0 ? (
                    <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
                      <div className="space-y-3">
                        {projectInvoices.map((invoice) => {
                          const isSelected = invoice.id === selectedInvoice?.id;
                          return (
                            <Link
                              key={invoice.id}
                              href={`/dashboard/invoices?project=${selectedProject.id}&invoice=${invoice.id}`}
                              className={`block rounded-[24px] border px-4 py-4 transition ${
                                isSelected
                                  ? "border-[#f2c078]/25 bg-[linear-gradient(135deg,rgba(242,192,120,0.16),rgba(255,255,255,0.03))]"
                                  : "border-white/8 bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.05]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-medium text-white">{invoice.invoice_number}</div>
                                  <div className="mt-1 text-sm text-[#9fa8b5]">{invoice.description}</div>
                                </div>
                                <AdminStatusBadge value={invoice.status} />
                              </div>
                              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#7f8794]">
                                <span>{formatCurrency(invoice.amount_due)}</span>
                                <span>{invoice.due_date ? formatShortDate(invoice.due_date) : "No due date"}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,28,0.96),rgba(10,12,16,0.98))] px-5 py-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                        {selectedInvoice ? (
                          <>
                            <div className="mb-5">
                              <div className="text-[11px] uppercase tracking-[0.22em] text-[#7d8795]">Update invoice</div>
                              <h2 className="mt-2 text-xl font-semibold text-white">
                                {selectedInvoice.invoice_number}
                              </h2>
                              <p className="mt-2 text-sm leading-6 text-[#9fa8b5]">
                                Last touched {formatRelativeTime(selectedInvoice.created_at)}.
                              </p>
                            </div>
                            <AdminInvoiceEditor invoice={selectedInvoice} />
                          </>
                        ) : (
                          <AdminEmptyState
                            title="No invoice selected"
                            description="Choose an invoice from the list to update its amount, due date, or status."
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <AdminEmptyState
                      title="No invoices on this project yet"
                      description="Create the first milestone invoice above and it will appear here for ongoing updates."
                    />
                  )}
                </div>
              ) : (
                <AdminEmptyState
                  title="No project selected"
                  description="Choose a project from the left rail to issue or update invoices."
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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="mt-1 text-sm text-text-muted">
          Billing records for your active project appear here.
        </p>
      </div>

      {project ? (
        portal.invoices.length > 0 ? (
          <>
            <div className="grid gap-4">
              {portal.invoices.map((invoice) => (
                <div key={invoice.id} className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Receipt className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{invoice.description}</div>
                      <div className="text-xs text-text-muted">
                        {invoice.invoice_number} ·{" "}
                        {invoice.due_date
                          ? `Due ${formatShortDate(invoice.due_date)}`
                          : formatShortDate(invoice.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold">{formatCurrency(invoice.amount_due)}</div>
                    <div className="mt-1 text-xs text-text-muted">{invoice.status}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card flex items-center justify-between gap-4 p-5">
              <div>
                <div className="text-sm font-medium">Project Budget</div>
                <div className="text-xs text-text-muted">Pulled from the live project record</div>
              </div>
              <div className="text-right">
                <div className="gradient-text text-base font-bold">{formatCurrency(project.total_cost)}</div>
                <div className="text-xs text-text-muted">
                  {project.remaining_amount
                    ? `${formatCurrency(project.remaining_amount)} remaining`
                    : "No balance recorded"}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Receipt className="h-5 w-5 text-accent" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">No invoices yet</h2>
            <p className="mt-2 text-sm text-text-muted">
              Invoices will appear here once they are issued for your project.
            </p>
          </div>
        )
      ) : (
        <div className="glass-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Receipt className="h-5 w-5 text-accent" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No billing workspace yet</h2>
          <p className="mt-2 text-sm text-text-muted">
            Billing stays hidden until a project workspace exists, so you only see real records.
          </p>
        </div>
      )}
    </div>
  );
}
