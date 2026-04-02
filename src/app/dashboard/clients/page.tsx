import { ArrowRight, FolderKanban, Receipt, Wallet } from "lucide-react";
import Link from "next/link";
import {
  AdminEmptyState,
  AdminPageIntro,
  AdminPanel,
  AdminStatusBadge,
  AdminToneBadge,
} from "@/components/dashboard/admin/AdminPrimitives";
import { getAdminWorkspaceData, requireAdminWorkspace } from "@/lib/admin-data";
import { formatCurrency, formatRelativeTime } from "@/lib/format";

interface ClientsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const context = await requireAdminWorkspace();
  const workspace = await getAdminWorkspaceData(context.profile.id);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const clientId = firstValue(resolvedSearchParams.client);
  const selectedClient =
    workspace.clients.find((client) => client.id === clientId) ?? workspace.clients[0] ?? null;

  const clientQuotes = workspace.quotes.filter(
    (quote) =>
      quote.client_profile_id === selectedClient?.id || quote.client_email === selectedClient?.email
  );
  const clientIntakes = workspace.intakes.filter(
    (intake) =>
      intake.client_profile_id === selectedClient?.id || intake.client_email === selectedClient?.email
  );
  const clientProjects = workspace.projects.filter(
    (project) =>
      project.client_profile_id === selectedClient?.id || project.client_email === selectedClient?.email
  );

  return (
    <div className="space-y-8">
      <AdminPageIntro
        eyebrow="Clients"
        title="See each relationship as an actual account, not scattered form entries."
        description="Quotes, intake, projects, conversations, and billing roll up under the same client so you can operate from the relationship instead of chasing fragments."
      />

      <div className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
        <AdminPanel
          title="Client roster"
          description="Accounts ranked by recent activity."
        >
          {workspace.clients.length > 0 ? (
            <div className="space-y-3">
              {workspace.clients.map((client) => {
                const isSelected = client.id === selectedClient?.id;

                return (
                  <Link
                    key={client.id}
                    href={`/dashboard/clients?client=${client.id}`}
                    className={`block rounded-[24px] border px-4 py-4 transition ${
                      isSelected
                        ? "border-[#f2c078]/25 bg-[linear-gradient(135deg,rgba(242,192,120,0.16),rgba(131,214,255,0.06))]"
                        : "border-white/8 bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {client.full_name || client.email || "Client"}
                        </div>
                        <div className="mt-1 text-sm text-[#9fa8b5]">
                          {client.company_name || "No company listed"}
                        </div>
                      </div>
                      <AdminToneBadge tone={client.activeProjectCount > 0 ? "mint" : "accent"}>
                        {client.activeProjectCount > 0 ? "active" : "warming up"}
                      </AdminToneBadge>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#7f8794]">
                      <span>{client.email || "No email"}</span>
                      <span>{formatRelativeTime(client.lastActivityAt)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <AdminEmptyState
              title="No client accounts yet"
              description="Client records are created automatically from signup, quote saves, and intake activity."
            />
          )}
        </AdminPanel>

        <div className="space-y-6">
          <AdminPanel
            title={selectedClient ? selectedClient.full_name || selectedClient.email || "Client detail" : "Client detail"}
            description={
              selectedClient
                ? "Relationship summary across quoting, delivery, billing, and latest activity."
                : "Choose a client to inspect the account."
            }
          >
            {selectedClient ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Quoted value</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {formatCurrency(selectedClient.totalQuotedRevenue)}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">{selectedClient.quoteCount} saved quotes</div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Project value</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {formatCurrency(selectedClient.totalProjectRevenue)}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">{selectedClient.projectCount} workspaces</div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Outstanding</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {formatCurrency(selectedClient.outstandingBalance)}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">Open balance across projects</div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Last activity</div>
                    <div className="mt-2 text-sm font-medium text-white">
                      {formatRelativeTime(selectedClient.lastActivityAt)}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">
                      Preferred contact: {selectedClient.preferred_contact_method || "portal"}
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-white/[0.02] px-5 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">Account details</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedClient.company_name ? (
                          <AdminToneBadge tone="accent">{selectedClient.company_name}</AdminToneBadge>
                        ) : null}
                        {selectedClient.latestProjectStatus ? (
                          <AdminStatusBadge value={selectedClient.latestProjectStatus} />
                        ) : null}
                      </div>
                    </div>
                    {selectedClient.latestProjectId ? (
                      <Link
                        href={`/dashboard/projects?project=${selectedClient.latestProjectId}`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-[#d2d8e0] transition hover:border-white/18 hover:bg-white/[0.06] hover:text-white"
                      >
                        Open latest project
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-[#b9c0ca] md:grid-cols-2">
                    <div>Email: {selectedClient.email || "Not set"}</div>
                    <div>Phone: {selectedClient.phone || "Not set"}</div>
                    <div>Latest quote: {selectedClient.latestQuoteNumber || "None yet"}</div>
                    <div>Latest intake: {selectedClient.latestIntakeNumber || "None yet"}</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
                    <div className="flex items-center gap-3 text-white">
                      <Receipt className="h-4 w-4 text-[#f2c078]" />
                      <span className="text-sm font-medium">Quotes</span>
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{clientQuotes.length}</div>
                    <div className="mt-2 text-sm text-[#8f97a4]">Pricing records tied to this account</div>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
                    <div className="flex items-center gap-3 text-white">
                      <FolderKanban className="h-4 w-4 text-[#83d6ff]" />
                      <span className="text-sm font-medium">Projects</span>
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{clientProjects.length}</div>
                    <div className="mt-2 text-sm text-[#8f97a4]">Delivery workspaces attached</div>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
                    <div className="flex items-center gap-3 text-white">
                      <Wallet className="h-4 w-4 text-[#8ae3b4]" />
                      <span className="text-sm font-medium">Open balance</span>
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                      {formatCurrency(selectedClient.outstandingBalance)}
                    </div>
                    <div className="mt-2 text-sm text-[#8f97a4]">Across active work</div>
                  </div>
                </div>
              </div>
            ) : (
              <AdminEmptyState
                title="No client selected"
                description="Choose a client from the roster to review the full relationship context."
              />
            )}
          </AdminPanel>

          {selectedClient ? (
            <div className="grid gap-6 xl:grid-cols-3">
              <AdminPanel title="Quotes" description="Saved pricing history for this client.">
                {clientQuotes.length > 0 ? (
                  <div className="space-y-3">
                    {clientQuotes.slice(0, 5).map((quote) => (
                      <div key={quote.id} className="rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-white">{quote.quote_number}</div>
                          <AdminStatusBadge value={quote.status} />
                        </div>
                        <div className="mt-3 text-sm text-[#b9c0ca]">{quote.project_type}</div>
                        <div className="mt-2 text-sm text-[#8f97a4]">{formatCurrency(quote.total_price)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <AdminEmptyState title="No quotes" description="This client has not saved a quote yet." />
                )}
              </AdminPanel>

              <AdminPanel title="Intake" description="Submitted project briefs and requests.">
                {clientIntakes.length > 0 ? (
                  <div className="space-y-3">
                    {clientIntakes.slice(0, 5).map((intake) => (
                      <Link
                        key={intake.id}
                        href={`/dashboard/intake?intake=${intake.id}`}
                        className="block rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4 transition hover:border-white/16 hover:bg-white/[0.05]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-white">{intake.intake_number}</div>
                          <AdminStatusBadge value={intake.status} />
                        </div>
                        <div className="mt-3 text-sm text-[#b9c0ca]">{intake.project_type}</div>
                        <div className="mt-2 text-sm text-[#8f97a4]">{formatRelativeTime(intake.created_at)}</div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <AdminEmptyState title="No intake records" description="No intake submissions are tied to this client yet." />
                )}
              </AdminPanel>

              <AdminPanel title="Projects" description="Delivery work currently linked to this account.">
                {clientProjects.length > 0 ? (
                  <div className="space-y-3">
                    {clientProjects.slice(0, 5).map((project) => (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects?project=${project.id}`}
                        className="block rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4 transition hover:border-white/16 hover:bg-white/[0.05]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-white">{project.name}</div>
                          <AdminStatusBadge value={project.status} />
                        </div>
                        <div className="mt-3 text-sm text-[#b9c0ca]">{project.project_number}</div>
                        <div className="mt-2 text-sm text-[#8f97a4]">{formatCurrency(project.total_cost)}</div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <AdminEmptyState title="No projects" description="This client has not been moved into delivery yet." />
                )}
              </AdminPanel>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
