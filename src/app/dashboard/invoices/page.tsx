"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Clock, Download, Receipt } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Invoice {
  id: string;
  invoice_number: string;
  description: string;
  amount_due: number;
  status: string;
  due_date: string | null;
  created_at: string;
}

interface ProjectSummary {
  id: string;
  name: string;
  total_cost: number | null;
  paid_amount: number | null;
  remaining_amount: number | null;
}

function formatMoney(cents: number | null | undefined) {
  if (cents == null) return "—";
  // Values stored as whole dollars (int4), not cents
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents);
}

function formatDueDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: projects } = await supabase
        .from("projects")
        .select("id, name, total_cost, paid_amount, remaining_amount")
        .eq("client_profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (!projects || projects.length === 0) { setLoading(false); return; }

      const p = projects[0] as ProjectSummary;
      setProject(p);

      const { data: inv } = await supabase
        .from("project_invoices")
        .select("*")
        .eq("project_id", p.id)
        .order("created_at", { ascending: true });
      if (inv) setInvoices(inv as Invoice[]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Invoices</h1>
        <p className="text-text-muted text-sm">View and download your project invoices.</p>
      </motion.div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass-card p-5 flex items-center gap-4">
              <div className="skeleton w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-52" />
                <div className="skeleton h-2 w-32" />
              </div>
              <div className="skeleton w-20 h-5 rounded" />
            </div>
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card py-14 px-6 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/[0.08] border border-accent/10 flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-6 h-6 text-accent/80" />
          </div>
          <h3 className="text-sm font-semibold mb-1.5">No invoices yet</h3>
          <p className="text-text-muted text-xs max-w-sm mx-auto leading-relaxed">
            Invoices appear here as your project moves through its payment milestones. You&apos;ll also get an email when a new one is issued.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {invoices.map((inv, i) => {
            const paid = inv.status === "paid";
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    paid ? "bg-accent/10" : "bg-white/[0.03]"
                  }`}>
                    <FileText className={`w-5 h-5 ${paid ? "text-accent" : "text-text-muted"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{inv.description}</div>
                    <div className="text-xs text-text-muted">
                      {inv.invoice_number} · {paid ? "Issued" : "Due"} {formatDueDate(paid ? inv.created_at : (inv.due_date || inv.created_at))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-base font-bold">{formatMoney(inv.amount_due)}</div>
                    <div className={`flex items-center gap-1 text-xs justify-end ${
                      paid ? "text-accent" : "text-text-muted"
                    }`}>
                      {paid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {paid ? "Paid" : "Pending"}
                    </div>
                  </div>
                  <button
                    className="p-2 rounded-lg hover:bg-white/[0.05] text-text-muted hover:text-accent transition-colors disabled:opacity-40"
                    disabled
                    title="Download coming soon"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {project && (project.total_cost != null) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-5 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-medium">Project Total</div>
                <div className="text-text-muted text-xs">
                  {formatMoney(project.paid_amount || 0)} paid
                  {project.remaining_amount != null && ` · ${formatMoney(project.remaining_amount)} remaining`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold gradient-text">{formatMoney(project.total_cost)}</div>
                <div className="text-text-muted text-xs">Total project cost</div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
