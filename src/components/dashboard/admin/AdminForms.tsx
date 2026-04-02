"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Upload } from "lucide-react";
import type { AdminIntakeRecord, AdminInvoiceRecord, AdminProjectRecord } from "@/lib/admin-data";

function isoDate(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function fieldClassName() {
  return "w-full rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-3 text-sm text-white outline-none transition focus:border-[#f2c078]/45 focus:bg-[#10151d]";
}

function labelClassName() {
  return "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d8795]";
}

export function AdminProjectComposer({
  intake,
  quoteId,
  clientProfileId,
  clientEmail,
  clientName,
  companyName,
}: {
  intake?: AdminIntakeRecord | null;
  quoteId?: string | null;
  clientProfileId?: string | null;
  clientEmail?: string | null;
  clientName?: string | null;
  companyName?: string | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState(
    intake ? `${intake.client_name.split(" ")[0] || "Client"} Workspace` : "New Client Project"
  );
  const [projectType, setProjectType] = useState(intake?.project_type || "AI & Automation");
  const [status, setStatus] = useState("planning");
  const [phase, setPhase] = useState("scope_review");
  const [progressPercentage, setProgressPercentage] = useState("0");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [summary, setSummary] = useState(intake?.description || "");
  const [totalCost, setTotalCost] = useState("");
  const [paidAmount, setPaidAmount] = useState("0");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intakeId: intake?.id,
          quoteId,
          clientProfileId,
          clientEmail,
          clientName,
          companyName,
          name,
          projectType,
          status,
          phase,
          progressPercentage,
          estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion).toISOString() : null,
          summary,
          totalCost,
          paidAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project.");
      }

      setSuccess(`Created ${data.projectNumber}.`);
      startTransition(() => {
        router.push(`/dashboard/projects?project=${data.projectId}`);
        router.refresh();
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClassName()}>Project Name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Project Type</label>
          <input value={projectType} onChange={(event) => setProjectType(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Status</label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClassName()}>
            {["planning", "in_review", "active", "completed", "on_hold"].map((option) => (
              <option key={option} value={option}>
                {option.replace(/[_-]+/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClassName()}>Current Phase</label>
          <input value={phase} onChange={(event) => setPhase(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Progress</label>
          <input
            type="number"
            min="0"
            max="100"
            value={progressPercentage}
            onChange={(event) => setProgressPercentage(event.target.value)}
            className={fieldClassName()}
          />
        </div>
        <div>
          <label className={labelClassName()}>Estimated Completion</label>
          <input
            type="date"
            value={estimatedCompletion}
            onChange={(event) => setEstimatedCompletion(event.target.value)}
            className={fieldClassName()}
          />
        </div>
        <div>
          <label className={labelClassName()}>Contract Value</label>
          <input value={totalCost} onChange={(event) => setTotalCost(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Paid So Far</label>
          <input value={paidAmount} onChange={(event) => setPaidAmount(event.target.value)} className={fieldClassName()} />
        </div>
      </div>

      <div>
        <label className={labelClassName()}>Workspace Summary</label>
        <textarea
          rows={5}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className={`${fieldClassName()} resize-none`}
        />
      </div>

      {error ? <p className="text-sm text-[#ff9e9e]">{error}</p> : null}
      {success ? <p className="text-sm text-[#8ae3b4]">{success}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#f2c078] px-5 py-3 text-sm font-semibold text-[#111318] transition hover:bg-[#ffd8a2] disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {saving ? "Creating..." : "Create Project Workspace"}
      </button>
    </form>
  );
}

export function AdminProjectEditor({ project }: { project: AdminProjectRecord }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState(project.name);
  const [projectType, setProjectType] = useState(project.project_type || "Custom");
  const [status, setStatus] = useState(project.status);
  const [phase, setPhase] = useState(project.phase || "");
  const [progressPercentage, setProgressPercentage] = useState(String(project.progress_percentage || 0));
  const [startDate, setStartDate] = useState(isoDate(project.start_date));
  const [estimatedCompletion, setEstimatedCompletion] = useState(isoDate(project.estimated_completion));
  const [summary, setSummary] = useState(project.summary || "");
  const [totalCost, setTotalCost] = useState(String(project.total_cost || 0));
  const [paidAmount, setPaidAmount] = useState(String(project.paid_amount || 0));

  const remaining = useMemo(() => {
    const total = Number(totalCost) || 0;
    const paid = Number(paidAmount) || 0;
    return Math.max(total - paid, 0);
  }, [paidAmount, totalCost]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          projectType,
          status,
          phase,
          progressPercentage,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion).toISOString() : null,
          summary,
          totalCost,
          paidAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update project.");
      }

      setSuccess("Project updated.");
      startTransition(() => {
        router.refresh();
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClassName()}>Project Name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Project Type</label>
          <input value={projectType} onChange={(event) => setProjectType(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Status</label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClassName()}>
            {["planning", "in_review", "active", "completed", "on_hold", "cancelled"].map((option) => (
              <option key={option} value={option}>
                {option.replace(/[_-]+/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClassName()}>Current Phase</label>
          <input value={phase} onChange={(event) => setPhase(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Progress</label>
          <input
            type="number"
            min="0"
            max="100"
            value={progressPercentage}
            onChange={(event) => setProgressPercentage(event.target.value)}
            className={fieldClassName()}
          />
        </div>
        <div>
          <label className={labelClassName()}>Start Date</label>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Estimated Completion</label>
          <input type="date" value={estimatedCompletion} onChange={(event) => setEstimatedCompletion(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Contract Value</label>
          <input value={totalCost} onChange={(event) => setTotalCost(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Paid To Date</label>
          <input value={paidAmount} onChange={(event) => setPaidAmount(event.target.value)} className={fieldClassName()} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-[#dbe2ea]">
        Remaining balance: <span className="font-semibold text-white">${remaining.toLocaleString()}</span>
      </div>

      <div>
        <label className={labelClassName()}>Summary</label>
        <textarea
          rows={5}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className={`${fieldClassName()} resize-none`}
        />
      </div>

      {error ? <p className="text-sm text-[#ff9e9e]">{error}</p> : null}
      {success ? <p className="text-sm text-[#8ae3b4]">{success}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#f2c078] px-5 py-3 text-sm font-semibold text-[#111318] transition hover:bg-[#ffd8a2] disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Saving..." : "Save Project"}
      </button>
    </form>
  );
}

export function AdminInvoiceComposer({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("Milestone invoice");
  const [amountDue, setAmountDue] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          description,
          amountDue,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invoice.");
      }

      setDescription("Milestone invoice");
      setAmountDue("");
      setDueDate("");
      startTransition(() => {
        router.refresh();
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={labelClassName()}>Description</label>
        <input value={description} onChange={(event) => setDescription(event.target.value)} className={fieldClassName()} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClassName()}>Amount</label>
          <input value={amountDue} onChange={(event) => setAmountDue(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Status</label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClassName()}>
            {["pending", "sent", "paid"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClassName()}>Due Date</label>
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={fieldClassName()} />
      </div>
      {error ? <p className="text-sm text-[#ff9e9e]">{error}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#f2c078] px-4 py-2.5 text-sm font-semibold text-[#111318] transition hover:bg-[#ffd8a2] disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {saving ? "Creating..." : "Create Invoice"}
      </button>
    </form>
  );
}

export function AdminInvoiceEditor({ invoice }: { invoice: AdminInvoiceRecord }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [description, setDescription] = useState(invoice.description);
  const [amountDue, setAmountDue] = useState(String(invoice.amount_due));
  const [status, setStatus] = useState(invoice.status);
  const [dueDate, setDueDate] = useState(isoDate(invoice.due_date));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          amountDue,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update invoice.");
      }

      setSuccess("Invoice updated.");
      startTransition(() => {
        router.refresh();
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={labelClassName()}>Description</label>
        <input value={description} onChange={(event) => setDescription(event.target.value)} className={fieldClassName()} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className={labelClassName()}>Amount</label>
          <input value={amountDue} onChange={(event) => setAmountDue(event.target.value)} className={fieldClassName()} />
        </div>
        <div>
          <label className={labelClassName()}>Status</label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClassName()}>
            {["pending", "sent", "paid", "overdue"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClassName()}>Due Date</label>
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={fieldClassName()} />
        </div>
      </div>
      {error ? <p className="text-sm text-[#ff9e9e]">{error}</p> : null}
      {success ? <p className="text-sm text-[#8ae3b4]">{success}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#f2c078] px-4 py-2.5 text-sm font-semibold text-[#111318] transition hover:bg-[#ffd8a2] disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Saving..." : "Update Invoice"}
      </button>
    </form>
  );
}

export function AdminFileUploader({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Planning");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Choose a file first.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("category", category);
      formData.append("file", selectedFile);

      const response = await fetch("/api/admin/files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file.");
      }

      setSelectedFile(null);
      startTransition(() => {
        router.refresh();
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={labelClassName()}>Category</label>
        <input value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClassName()} />
      </div>
      <div>
        <label className={labelClassName()}>File</label>
        <input
          type="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className={`${fieldClassName()} file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-white`}
        />
      </div>
      {error ? <p className="text-sm text-[#ff9e9e]">{error}</p> : null}
      <button
        type="submit"
        disabled={uploading}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#f2c078] px-4 py-2.5 text-sm font-semibold text-[#111318] transition hover:bg-[#ffd8a2] disabled:opacity-60"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </form>
  );
}
