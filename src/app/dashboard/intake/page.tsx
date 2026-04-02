import { ArrowRight, ClipboardList, Receipt } from "lucide-react";
import Link from "next/link";
import { AdminProjectComposer } from "@/components/dashboard/admin/AdminForms";
import {
  AdminEmptyState,
  AdminPageIntro,
  AdminPanel,
  AdminStatusBadge,
  AdminToneBadge,
} from "@/components/dashboard/admin/AdminPrimitives";
import { getAdminWorkspaceData, requireAdminWorkspace } from "@/lib/admin-data";
import { formatCurrency, formatRelativeTime, formatStatusLabel } from "@/lib/format";

interface IntakePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function IntakePage({ searchParams }: IntakePageProps) {
  const context = await requireAdminWorkspace();
  const workspace = await getAdminWorkspaceData(context.profile.id);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const intakeId = firstValue(resolvedSearchParams.intake);
  const quoteId = firstValue(resolvedSearchParams.quote);

  const unlinkedIntakes = workspace.intakes.filter((intake) => !intake.linkedProjectId);
  const savedQuotes = workspace.quotes.filter((quote) => quote.status === "saved");

  const selectedIntake =
    workspace.intakes.find((intake) => intake.id === intakeId) ??
    unlinkedIntakes[0] ??
    workspace.intakes[0] ??
    null;

  const selectedQuote =
    workspace.quotes.find((quote) => quote.id === quoteId) ??
    (selectedIntake?.quote_id
      ? workspace.quotes.find((quote) => quote.id === selectedIntake.quote_id) ?? null
      : null) ??
    (selectedIntake ? null : savedQuotes[0] ?? workspace.quotes[0] ?? null);

  const selectedQuoteIsContextual =
    !!quoteId || (!!selectedIntake?.quote_id && selectedQuote?.id === selectedIntake.quote_id);

  const linkedProjectFromQuote =
    selectedQuote && selectedQuoteIsContextual
      ? workspace.projects.find((project) => project.quote_id === selectedQuote.id) ?? null
      : null;

  const linkedProject =
    (selectedIntake?.linkedProjectId
      ? workspace.projects.find((project) => project.id === selectedIntake.linkedProjectId) ?? null
      : null) ??
    linkedProjectFromQuote ??
    null;

  const selectedClientName = selectedIntake?.client_name || selectedQuote?.client_name || "New client";
  const selectedClientEmail = selectedIntake?.client_email || selectedQuote?.client_email || null;
  const selectedCompany = selectedIntake?.company_name || selectedQuote?.company_name || null;

  return (
    <div className="space-y-8">
      <AdminPageIntro
        eyebrow="Intake"
        title="Convert requests and quotes into real project workspaces."
        description="Review the client brief, confirm the quote context, and create the operational workspace that unlocks messaging, files, billing, and delivery tracking."
      />

      <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <div className="space-y-6">
          <AdminPanel
            title="Requests waiting on action"
            description="Fresh intake submissions that do not have a linked project yet."
          >
            {unlinkedIntakes.length > 0 ? (
              <div className="space-y-3">
                {unlinkedIntakes.map((intake) => {
                  const isSelected = intake.id === selectedIntake?.id;
                  return (
                    <Link
                      key={intake.id}
                      href={`/dashboard/intake?intake=${intake.id}`}
                      className={`block rounded-[24px] border px-4 py-4 transition ${
                        isSelected
                          ? "border-[#f2c078]/25 bg-[linear-gradient(135deg,rgba(242,192,120,0.16),rgba(131,214,255,0.06))]"
                          : "border-white/8 bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-white">{intake.client_name}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7d8795]">
                            {intake.intake_number}
                          </div>
                        </div>
                        <AdminStatusBadge value={intake.status} />
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#aab2bf]">{intake.description}</p>
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#7f8794]">
                        <span>{intake.project_type}</span>
                        <span>{formatRelativeTime(intake.created_at)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <AdminEmptyState
                title="No request backlog"
                description="Every intake request already has a workspace or there are no new submissions waiting right now."
              />
            )}
          </AdminPanel>

          <AdminPanel
            title="Saved quotes"
            description="Quote records that can be turned into delivery work even if the client skipped the intake form."
          >
            {workspace.quotes.length > 0 ? (
              <div className="space-y-3">
                {workspace.quotes.slice(0, 8).map((quote) => {
                  const projectFromQuote = workspace.projects.find((project) => project.quote_id === quote.id);
                  const isSelected = quote.id === selectedQuote?.id;

                  return (
                    <Link
                      key={quote.id}
                      href={`/dashboard/intake?quote=${quote.id}`}
                      className={`block rounded-[24px] border px-4 py-4 transition ${
                        isSelected
                          ? "border-[#83d6ff]/25 bg-[linear-gradient(135deg,rgba(131,214,255,0.16),rgba(242,192,120,0.06))]"
                          : "border-white/8 bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-white">{quote.client_name}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7d8795]">
                            {quote.quote_number}
                          </div>
                        </div>
                        <AdminStatusBadge value={projectFromQuote ? "converted" : quote.status} />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#b7bec9]">
                        <span>{quote.project_type}</span>
                        <span>{formatCurrency(quote.total_price)}</span>
                      </div>
                      {quote.additional_notes ? (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#88919f]">{quote.additional_notes}</p>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <AdminEmptyState
                title="No saved quotes yet"
                description="Quotes from the pricing flow will show up here automatically."
              />
            )}
          </AdminPanel>
        </div>

        <div className="space-y-6">
          <AdminPanel
            title={linkedProject ? "Linked workspace" : "Selected request"}
            description={
              linkedProject
                ? "This intake or quote is already attached to a live project workspace."
                : "Review the client signal before you create the working project."
            }
            action={
              linkedProject ? (
                <Link href={`/dashboard/projects?project=${linkedProject.id}`} className="text-sm text-[#f2c078] hover:text-[#ffd8a2]">
                  Open project
                </Link>
              ) : null
            }
          >
            {selectedIntake || selectedQuote ? (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Client</div>
                    <div className="mt-2 text-lg font-semibold text-white">{selectedClientName}</div>
                    <div className="mt-2 text-sm text-[#9fa8b5]">
                      {selectedClientEmail || "No email supplied"}
                      {selectedCompany ? ` · ${selectedCompany}` : ""}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d8795]">Scope</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedIntake?.project_type ? (
                        <AdminToneBadge tone="accent">{selectedIntake.project_type}</AdminToneBadge>
                      ) : null}
                      {selectedQuote?.project_type && selectedQuote.project_type !== selectedIntake?.project_type ? (
                        <AdminToneBadge tone="cyan">{selectedQuote.project_type}</AdminToneBadge>
                      ) : null}
                    </div>
                    <div className="mt-3 text-sm text-[#9fa8b5]">
                      {selectedIntake
                        ? `Preferred contact: ${formatStatusLabel(selectedIntake.preferred_contact_method)}`
                        : "Quote-only intake path"}
                    </div>
                  </div>
                </div>

                {selectedIntake ? (
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.02] px-5 py-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-white">Client brief</div>
                      <AdminStatusBadge value={selectedIntake.status} />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#c6ccd5]">{selectedIntake.description}</p>
                  </div>
                ) : null}

                {selectedQuote ? (
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.02] px-5 py-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">Quote context</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[#7d8795]">
                          {selectedQuote.quote_number}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">{formatCurrency(selectedQuote.total_price)}</div>
                        <div className="text-xs text-[#7f8794]">
                          {selectedQuote.estimated_weeks ? `${selectedQuote.estimated_weeks} week estimate` : "Estimate pending"}
                        </div>
                      </div>
                    </div>
                    {selectedQuote.additional_notes ? (
                      <p className="mt-4 text-sm leading-7 text-[#c6ccd5]">{selectedQuote.additional_notes}</p>
                    ) : (
                      <p className="mt-4 text-sm leading-7 text-[#8f97a4]">
                        No extra quote notes were saved on this record.
                      </p>
                    )}
                  </div>
                ) : null}

                {linkedProject ? (
                  <div className="rounded-[24px] border border-[#8ae3b4]/20 bg-[#8ae3b4]/8 px-5 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{linkedProject.name}</div>
                        <div className="mt-1 text-sm text-[#c6ccd5]">
                          {linkedProject.project_number} · {formatStatusLabel(linkedProject.status)}
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/projects?project=${linkedProject.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-[#111318]"
                      >
                        Open workspace
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,28,0.96),rgba(10,12,16,0.98))] px-5 py-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                    <div className="mb-5">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[#7d8795]">Create project</div>
                      <h2 className="mt-2 text-xl font-semibold text-white">
                        Turn this request into an active workspace.
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[#9fa8b5]">
                        Creating the project here unlocks portal messaging, billing, file delivery, and progress tracking for this client.
                      </p>
                    </div>
                    <AdminProjectComposer
                      intake={selectedIntake}
                      quoteId={selectedQuote?.id || selectedIntake?.quote_id || null}
                      clientProfileId={selectedIntake?.client_profile_id || selectedQuote?.client_profile_id || null}
                      clientEmail={selectedClientEmail}
                      clientName={selectedClientName}
                      companyName={selectedCompany}
                    />
                  </div>
                )}
              </div>
            ) : (
              <AdminEmptyState
                title="No intake or quote selected"
                description="Choose a request or quote from the left rail to start building a project workspace."
              />
            )}
          </AdminPanel>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
              <div className="flex items-center gap-3 text-white">
                <ClipboardList className="h-4 w-4 text-[#f2c078]" />
                <span className="text-sm font-medium">Pending intake</span>
              </div>
              <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                {unlinkedIntakes.length}
              </div>
              <div className="mt-2 text-sm text-[#8f97a4]">
                Requests still waiting on a project workspace.
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5">
              <div className="flex items-center gap-3 text-white">
                <Receipt className="h-4 w-4 text-[#83d6ff]" />
                <span className="text-sm font-medium">Saved quotes</span>
              </div>
              <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                {savedQuotes.length}
              </div>
              <div className="mt-2 text-sm text-[#8f97a4]">
                Pricing records available to convert into delivery work.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
