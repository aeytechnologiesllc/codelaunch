"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Users, Search, Mail, Building, ArrowUpRight, DollarSign, FileText,
  MessageSquare, Folder, Inbox,
} from "lucide-react";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

interface Project {
  id: string;
  client_profile_id: string | null;
  name: string;
  status: string;
  progress_percentage: number | null;
  progress: number | null;
  total_cost: number | null;
  paid_amount: number | null;
  created_at: string;
}

interface Quote {
  id: string;
  client_profile_id: string | null;
  client_email: string | null;
  quote_number: string;
  total_price: number | string | null;
  created_at: string;
}

interface MessageCount {
  project_id: string;
  count: number;
}

interface ClientRow {
  profile: Profile;
  projectCount: number;
  activeProjectName: string | null;
  activeProjectStatus: string | null;
  activeProjectProgress: number;
  totalSpent: number;
  quoteCount: number;
  messageCount: number;
  lastActivity: string | null;
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function initials(s: string | null) {
  if (!s) return "?";
  return s.split(/\s+/).map((p) => p[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
}

function relativeDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 1) return "today";
  if (diffDays < 2) return "yesterday";
  if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminClientsPage() {
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const [{ data: profiles }, { data: projects }, { data: quotes }] = await Promise.all([
        supabase.from("profiles").select("*").eq("role", "client").order("created_at", { ascending: false }),
        supabase.from("projects").select("id, client_profile_id, name, status, progress, progress_percentage, total_cost, paid_amount, created_at"),
        supabase.from("quotes").select("id, client_profile_id, client_email, quote_number, total_price, created_at"),
      ]);

      if (!profiles) { setLoading(false); return; }

      // Also pull message counts per project in one go
      const projectIds = (projects || []).map((p) => p.id);
      let messageMap = new Map<string, number>();
      if (projectIds.length) {
        const { data: msgRows } = await supabase
          .from("project_messages")
          .select("project_id")
          .in("project_id", projectIds);
        if (msgRows) {
          for (const m of msgRows as { project_id: string }[]) {
            messageMap.set(m.project_id, (messageMap.get(m.project_id) || 0) + 1);
          }
        }
      }

      const clientRows: ClientRow[] = (profiles as Profile[]).map((prof) => {
        const theirProjects = (projects as Project[] || []).filter((p) => p.client_profile_id === prof.id);
        const theirQuotes = (quotes as Quote[] || []).filter(
          (q) => q.client_profile_id === prof.id || (prof.email && q.client_email === prof.email)
        );
        const active = theirProjects.find((p) => p.status !== "launched" && p.status !== "completed" && p.status !== "cancelled");
        const primary = active || theirProjects[0] || null;
        const totalSpent = theirProjects.reduce((s, p) => s + (p.paid_amount || 0), 0);
        const messageCount = theirProjects.reduce((s, p) => s + (messageMap.get(p.id) || 0), 0);

        const latestProjectCreated = theirProjects.length
          ? theirProjects.reduce((latest, p) => (new Date(p.created_at) > new Date(latest) ? p.created_at : latest), theirProjects[0].created_at)
          : null;
        const lastActivity = latestProjectCreated || prof.created_at;

        return {
          profile: prof,
          projectCount: theirProjects.length,
          activeProjectName: primary?.name ?? null,
          activeProjectStatus: primary?.status ?? null,
          activeProjectProgress: primary ? (primary.progress_percentage ?? primary.progress ?? 0) : 0,
          totalSpent,
          quoteCount: theirQuotes.length,
          messageCount,
          lastActivity,
        };
      });

      // Sort: most recently active first
      clientRows.sort((a, b) => {
        const at = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
        const bt = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
        return bt - at;
      });

      setRows(clientRows);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const hay = [
        r.profile.full_name,
        r.profile.email,
        r.profile.company_name,
        r.profile.phone,
        r.activeProjectName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, search]);

  const aggregate = useMemo(() => {
    return {
      total: rows.length,
      activeProjects: rows.filter((r) => r.projectCount > 0).length,
      totalRevenue: rows.reduce((s, r) => s + r.totalSpent, 0),
      openConversations: rows.filter((r) => r.messageCount > 0).length,
    };
  }, [rows]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">Clients</h1>
          <p className="text-text-muted text-sm">Everyone who&apos;s signed up. Click a row to message, update progress, and manage their project.</p>
        </div>
      </motion.div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total clients", value: aggregate.total.toString(), icon: Users, color: "text-accent" },
          { label: "With projects", value: aggregate.activeProjects.toString(), icon: Folder, color: "text-amber-400" },
          { label: "Revenue collected", value: formatMoney(aggregate.totalRevenue), icon: DollarSign, color: "text-green-400" },
          { label: "Active conversations", value: aggregate.openConversations.toString(), icon: MessageSquare, color: "text-pink-400" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-[10px] sm:text-xs uppercase tracking-wider">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="glass-card p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, email, or project…"
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-text-muted"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-text-muted hover:text-text-primary">Clear</button>
        )}
      </div>

      {/* Client list */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card py-14 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/[0.08] border border-accent/10 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-6 h-6 text-accent/80" />
          </div>
          <h3 className="text-sm font-semibold mb-1.5">
            {rows.length === 0 ? "No clients yet" : `No matches for “${search}”`}
          </h3>
          <p className="text-text-muted text-xs max-w-sm mx-auto leading-relaxed">
            {rows.length === 0
              ? "When someone creates an account via signup or completes the pricing flow, they'll appear here."
              : "Try a different search term or clear the filter."}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card overflow-hidden divide-y divide-border/40"
        >
          {filtered.map((row, i) => (
            <Link
              key={row.profile.id}
              href={`/admin/clients/${row.profile.id}`}
              className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                {initials(row.profile.full_name || row.profile.email)}
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-semibold truncate group-hover:text-accent transition-colors">
                    {row.profile.full_name || row.profile.email?.split("@")[0] || "Unknown"}
                  </span>
                  {row.profile.company_name && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                      <Building className="w-2.5 h-2.5" />
                      {row.profile.company_name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {row.profile.email}
                  </span>
                  {row.activeProjectName && (
                    <span className="truncate">
                      · {row.activeProjectName} <span className="capitalize">({row.activeProjectStatus?.replace("_", " ")})</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Stats strip (desktop) */}
              <div className="hidden md:flex items-center gap-5 text-xs flex-shrink-0">
                <div className="text-right">
                  <div className="text-[9px] text-text-muted uppercase tracking-wider">Projects</div>
                  <div className="font-semibold">{row.projectCount}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-text-muted uppercase tracking-wider">Messages</div>
                  <div className="font-semibold">{row.messageCount}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-text-muted uppercase tracking-wider">Spent</div>
                  <div className="font-semibold text-green-400">{formatMoney(row.totalSpent)}</div>
                </div>
              </div>

              {/* Progress (if active project) */}
              {row.projectCount > 0 ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${row.activeProjectProgress}%` }} />
                  </div>
                  <span className="text-xs text-accent font-medium w-8">{row.activeProjectProgress}%</span>
                </div>
              ) : (
                <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 rounded text-[10px] font-semibold flex-shrink-0">
                  No project
                </span>
              )}

              <div className="text-[10px] text-text-muted flex-shrink-0 hidden sm:block">
                {relativeDate(row.lastActivity)}
              </div>

              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors flex-shrink-0" />
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}
