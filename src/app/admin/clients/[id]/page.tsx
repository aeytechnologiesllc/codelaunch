"use client";

import { useEffect, useRef, useState, useCallback, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft, Mail, Phone, Building, Calendar, DollarSign, FileText,
  MessageSquare, Send, Loader2, Folder, Receipt, Edit3, ChevronRight,
  CheckCircle2, Clock, Circle, ExternalLink,
} from "lucide-react";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  email_notifications: boolean | null;
  message_notifications: boolean | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number | null;
  progress_percentage: number | null;
  total_cost: number | null;
  paid_amount: number | null;
  remaining_amount: number | null;
  created_at: string;
  quote_id: string | null;
  project_type: string | null;
  milestones: {
    id: string;
    title: string;
    status: string;
    completed_at: string | null;
    sort_order: number;
  }[];
}

interface Quote {
  id: string;
  quote_number: string;
  project_type: string | null;
  total_price: number | string | null;
  estimated_weeks: number | string | null;
  design_level: string | null;
  payment_plan: string | null;
  created_at: string;
  archived_at: string | null;
}

interface Message {
  id: string;
  project_id: string;
  sender_profile_id: string | null;
  sender_name: string;
  body: string;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  description: string;
  amount_due: number;
  status: string;
  due_date: string | null;
  created_at: string;
  project_id: string;
}

interface FileRow {
  id: string;
  name: string;
  file_url: string | null;
  size_bytes: number | null;
  file_size: number | null;
  uploaded_by_label: string | null;
  category: string | null;
  created_at: string;
  project_id: string;
}

type TabKey = "overview" | "messages" | "quotes" | "files" | "invoices";

const statusLabels: Record<string, { label: string; dot: string }> = {
  discovery: { label: "Discovery", dot: "bg-amber-400" },
  planning: { label: "Planning", dot: "bg-amber-400" },
  in_review: { label: "In Review", dot: "bg-accent" },
  design: { label: "Design", dot: "bg-accent" },
  development: { label: "Development", dot: "bg-accent" },
  testing: { label: "Testing", dot: "bg-accent" },
  active: { label: "Active", dot: "bg-accent" },
  on_hold: { label: "On Hold", dot: "bg-text-muted" },
  launched: { label: "Launched", dot: "bg-green-400" },
  completed: { label: "Completed", dot: "bg-green-400" },
  cancelled: { label: "Cancelled", dot: "bg-text-muted" },
};

function money(n: number | string | null | undefined) {
  if (n == null) return "—";
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (!isFinite(num)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
}

function bytes(n: number | null) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function initials(s: string | null) {
  if (!s) return "?";
  return s.split(/\s+/).map((p) => p[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
}

function relativeTime(iso: string) {
  const d = new Date(iso);
  const diffS = (Date.now() - d.getTime()) / 1000;
  if (diffS < 60) return "just now";
  if (diffS < 3600) return `${Math.floor(diffS / 60)}m ago`;
  if (diffS < 86400) return `${Math.floor(diffS / 3600)}h ago`;
  if (diffS < 86400 * 7) return `${Math.floor(diffS / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: clientId } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Message compose
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("CodeLaunch");
  const msgEndRef = useRef<HTMLDivElement>(null);

  // Load everything
  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setAdminId(user.id);
      const { data: selfProf } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      if (selfProf?.full_name) setAdminName(selfProf.full_name);
    }

    const [{ data: prof }, { data: projs }, { data: qs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", clientId).maybeSingle(),
      supabase.from("projects").select("*, milestones(id, title, status, completed_at, sort_order)").eq("client_profile_id", clientId).order("created_at", { ascending: false }),
      supabase.from("quotes").select("*").eq("client_profile_id", clientId).order("created_at", { ascending: false }),
    ]);

    setProfile((prof as Profile) || null);
    setProjects((projs as Project[]) || []);
    setQuotes((qs as Quote[]) || []);

    const projectIds = (projs || []).map((p: { id: string }) => p.id);
    if (projectIds.length > 0) {
      setActiveProjectId((prev) => prev || projectIds[0]);
      const [{ data: msgs }, { data: invs }, { data: fs }] = await Promise.all([
        supabase.from("project_messages").select("*").in("project_id", projectIds).order("created_at", { ascending: true }),
        supabase.from("project_invoices").select("*").in("project_id", projectIds).order("created_at", { ascending: false }),
        supabase.from("project_files").select("*").in("project_id", projectIds).order("created_at", { ascending: false }),
      ]);
      setMessages((msgs as Message[]) || []);
      setInvoices((invs as Invoice[]) || []);
      setFiles((fs as FileRow[]) || []);
    }

    setLoading(false);
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  // Realtime subscription for messages on the active project
  useEffect(() => {
    if (!activeProjectId) return;
    const channel = supabase
      .channel(`admin-client-msg-${activeProjectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${activeProjectId}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === (payload.new as Message).id)) return prev;
            return [...prev, payload.new as Message];
          });
          requestAnimationFrame(() => msgEndRef.current?.scrollIntoView({ behavior: "smooth" }));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeProjectId]);

  useEffect(() => {
    if (activeTab === "messages") {
      requestAnimationFrame(() => msgEndRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  }, [activeTab, messages.length]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !activeProjectId || !adminId || sending) return;
    setSending(true);
    const { error } = await supabase.from("project_messages").insert({
      project_id: activeProjectId,
      sender_profile_id: adminId,
      sender_name: `${adminName} (CodeLaunch)`,
      body: text,
    });
    if (!error) {
      setDraft("");
    } else {
      alert(`Send failed: ${error.message}`);
    }
    setSending(false);
  };

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    // Optimistic
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p)));
    const { error } = await supabase.from("projects").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", projectId);
    if (error) {
      alert(`Update failed: ${error.message}`);
      load(); // reload from truth
    }
  };

  const updateMilestone = async (milestoneId: string, projectId: string, newStatus: string) => {
    // Find current state
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;
    const updated = proj.milestones.map((m) => (m.id === milestoneId ? { ...m, status: newStatus, completed_at: newStatus === "completed" ? new Date().toISOString() : null } : m));
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, milestones: updated } : p)));

    const { error } = await supabase
      .from("milestones")
      .update({
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", milestoneId);

    if (error) {
      alert(`Milestone update failed: ${error.message}`);
      load();
      return;
    }

    // Recompute project progress based on completed milestones
    const completed = updated.filter((m) => m.status === "completed").length;
    const total = updated.length;
    const newProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
    await supabase
      .from("projects")
      .update({ progress_percentage: newProgress, progress: newProgress, updated_at: new Date().toISOString() })
      .eq("id", projectId);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, progress_percentage: newProgress, progress: newProgress } : p)));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="skeleton h-6 w-32" />
        <div className="skeleton h-32 rounded-2xl" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-text-muted text-sm mb-4">Client not found.</p>
        <Link href="/admin/clients" className="text-accent text-sm hover:underline">Back to clients</Link>
      </div>
    );
  }

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;
  const messagesForActive = messages.filter((m) => m.project_id === activeProjectId);

  const totalSpent = projects.reduce((s, p) => s + (p.paid_amount || 0), 0);
  const totalCommitted = projects.reduce((s, p) => s + (p.total_cost || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-text-muted text-xs hover:text-text-primary transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to all clients
      </Link>

      {/* Identity card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-16 w-56 h-56 bg-accent/[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row gap-5">
          <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center text-accent text-xl font-bold flex-shrink-0">
            {initials(profile.full_name || profile.email)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold">{profile.full_name || profile.email?.split("@")[0] || "Unknown Client"}</h1>
                {profile.company_name && (
                  <div className="flex items-center gap-1.5 text-text-muted text-sm mt-0.5">
                    <Building className="w-3.5 h-3.5" /> {profile.company_name}
                  </div>
                )}
              </div>
              <span className="ml-auto text-[10px] text-text-muted uppercase tracking-wider px-2 py-1 bg-white/[0.03] rounded">
                Client since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                  <Mail className="w-3.5 h-3.5 text-text-muted" />
                  {profile.email}
                </a>
              )}
              {profile.phone && (
                <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors">
                  <Phone className="w-3.5 h-3.5 text-text-muted" />
                  {profile.phone}
                </a>
              )}
              <div className="flex items-center gap-2 text-text-secondary">
                <Folder className="w-3.5 h-3.5 text-text-muted" />
                {projects.length} {projects.length === 1 ? "project" : "projects"}
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <DollarSign className="w-3.5 h-3.5 text-text-muted" />
                {money(totalSpent)} paid <span className="text-text-muted">/ {money(totalCommitted)} committed</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 glass-card p-1 w-fit">
        {[
          { key: "overview" as const, label: "Overview", icon: Folder },
          { key: "messages" as const, label: "Messages", icon: MessageSquare, badge: messages.length },
          { key: "quotes" as const, label: "Quotes", icon: FileText, badge: quotes.length },
          { key: "files" as const, label: "Files", icon: Folder, badge: files.length },
          { key: "invoices" as const, label: "Invoices", icon: Receipt, badge: invoices.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === t.key ? "bg-accent/15 text-accent" : "text-text-muted hover:text-text-primary"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className="ml-0.5 text-[10px] opacity-70">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Tab content ─── */}
      <AnimatePresence mode="wait">
        {/* Overview: projects list with inline status + milestones */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {projects.length === 0 ? (
              <div className="glass-card py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/[0.08] border border-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Folder className="w-6 h-6 text-accent/80" />
                </div>
                <p className="text-sm font-semibold mb-1">No projects yet</p>
                <p className="text-text-muted text-xs">
                  This client hasn&apos;t submitted a quote yet — or the quote hasn&apos;t been claimed.
                </p>
              </div>
            ) : (
              projects.map((p) => {
                const stat = statusLabels[p.status] || { label: p.status, dot: "bg-text-muted" };
                const progress = p.progress_percentage ?? p.progress ?? 0;
                const sortedMilestones = [...p.milestones].sort((a, b) => a.sort_order - b.sort_order);
                return (
                  <div key={p.id} className="glass-card overflow-hidden">
                    <div className="p-5 flex flex-wrap items-start justify-between gap-3 border-b border-border">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${stat.dot}`} />
                          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">{stat.label}</span>
                        </div>
                        <h3 className="text-base font-semibold truncate">{p.name}</h3>
                        <p className="text-text-muted text-xs mt-0.5">
                          Started {new Date(p.created_at).toLocaleDateString()} · {money(p.total_cost)} · {p.project_type || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={p.status}
                          onChange={(e) => updateProjectStatus(p.id, e.target.value)}
                          className="bg-bg-elevated border border-border rounded-md px-2 py-1 text-xs capitalize focus:outline-none focus:border-accent/30"
                        >
                          {Object.entries(statusLabels).map(([value, { label }]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs text-accent font-semibold w-9">{progress}%</span>
                        </div>
                        <Link
                          href={`/admin/projects/${p.quote_id || p.id}`}
                          className="text-text-muted hover:text-accent transition-colors"
                          title="Open full project page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Inline milestones — click to cycle status */}
                    {sortedMilestones.length > 0 && (
                      <div className="p-4 space-y-2">
                        {sortedMilestones.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              const next = m.status === "pending" ? "in_progress" : m.status === "in_progress" ? "completed" : "pending";
                              updateMilestone(m.id, p.id, next);
                            }}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                              m.status === "completed" ? "border-accent/20 bg-accent/[0.03]"
                              : m.status === "in_progress" ? "border-amber-400/20 bg-amber-400/[0.03]"
                              : "border-border hover:bg-white/[0.02]"
                            }`}
                          >
                            {m.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                              : m.status === "in_progress" ? <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              : <Circle className="w-4 h-4 text-text-muted flex-shrink-0" />}
                            <span className={`flex-1 text-xs font-medium ${
                              m.status === "completed" ? "text-accent"
                              : m.status === "in_progress" ? "text-amber-400"
                              : "text-text-secondary"
                            }`}>
                              {m.title}
                            </span>
                            <span className="text-[9px] text-text-muted capitalize">{m.status.replace("_", " ")}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Messages */}
        {activeTab === "messages" && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {projects.length === 0 ? (
              <div className="glass-card py-14 text-center text-text-muted text-sm">
                No project to message on yet.
              </div>
            ) : (
              <>
                {/* Project selector */}
                {projects.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setActiveProjectId(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          activeProjectId === p.id ? "bg-accent/15 text-accent border border-accent/30" : "glass-card text-text-muted hover:text-text-primary"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Conversation */}
                <div className="glass-card flex flex-col h-[calc(100vh-22rem)] min-h-[400px]">
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messagesForActive.length === 0 ? (
                      <div className="text-center py-8 text-text-muted text-sm">
                        No messages on this project yet. Send the first one below.
                      </div>
                    ) : (
                      messagesForActive.map((m) => {
                        const isAdmin = m.sender_profile_id === adminId;
                        return (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isAdmin ? "bg-red-500/10 text-red-400" : "bg-accent/10 text-accent"
                            }`}>
                              {initials(m.sender_name)}
                            </div>
                            <div className={`max-w-[85%] ${isAdmin ? "text-right" : ""}`}>
                              <div className={`glass-card p-3.5 ${isAdmin ? "bg-red-500/5 border-red-500/10" : ""}`}>
                                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap break-words text-left">{m.body}</p>
                              </div>
                              <div className="text-[10px] text-text-muted mt-1 px-1">
                                {isAdmin ? "You" : m.sender_name} · {relativeTime(m.created_at)}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={msgEndRef} />
                  </div>
                  <form onSubmit={handleSend} className="p-3 border-t border-border flex items-center gap-3">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={`Reply to ${profile.full_name || "client"}…`}
                      disabled={sending || !activeProjectId}
                      className="flex-1 bg-transparent text-sm focus:outline-none px-2 placeholder:text-text-muted"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || sending}
                      className="w-9 h-9 rounded-lg bg-cta flex items-center justify-center hover:bg-cta-hover transition-colors disabled:opacity-40"
                    >
                      {sending ? <Loader2 className="w-4 h-4 text-cta-text animate-spin" /> : <Send className="w-4 h-4 text-cta-text" />}
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Quotes */}
        {activeTab === "quotes" && (
          <motion.div
            key="quotes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {quotes.length === 0 ? (
              <div className="glass-card py-14 text-center text-text-muted text-sm">No quotes linked to this client.</div>
            ) : (
              quotes.map((q) => (
                <Link
                  key={q.id}
                  href={`/admin/projects/${q.id}`}
                  className="glass-card p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">Quote #{q.quote_number}</span>
                        {q.archived_at && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-text-muted/10 text-text-muted rounded font-semibold uppercase tracking-wider">Archived</span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted">
                        {q.project_type || "—"} · {q.design_level || "standard"} · {new Date(q.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-accent">{money(q.total_price)}</div>
                      {q.estimated_weeks && (
                        <div className="text-[10px] text-text-muted">~{q.estimated_weeks} weeks</div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                </Link>
              ))
            )}
          </motion.div>
        )}

        {/* Files */}
        {activeTab === "files" && (
          <motion.div
            key="files"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {files.length === 0 ? (
              <div className="glass-card py-14 text-center text-text-muted text-sm">No files uploaded yet.</div>
            ) : (
              <div className="glass-card overflow-hidden divide-y divide-border/40">
                {files.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 p-3 hover:bg-white/[0.02]">
                    <FileText className="w-4 h-4 text-text-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <p className="text-[10px] text-text-muted">
                        {f.category || "—"} · {bytes(f.size_bytes || f.file_size)} · {f.uploaded_by_label || "—"} · {new Date(f.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {f.file_url && (
                      <a href={f.file_url} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent" title="Open file">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Invoices */}
        {activeTab === "invoices" && (
          <motion.div
            key="invoices"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {invoices.length === 0 ? (
              <div className="glass-card py-14 text-center text-text-muted text-sm">No invoices yet for this client.</div>
            ) : (
              <div className="space-y-3">
                {invoices.map((inv) => {
                  const paid = inv.status === "paid";
                  return (
                    <div key={inv.id} className="glass-card p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${paid ? "bg-accent/10" : "bg-white/[0.03]"}`}>
                          <Receipt className={`w-5 h-5 ${paid ? "text-accent" : "text-text-muted"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{inv.description}</p>
                          <p className="text-xs text-text-muted">
                            {inv.invoice_number} · Issued {new Date(inv.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold">{money(inv.amount_due)}</div>
                        <div className={`text-[10px] font-semibold ${paid ? "text-accent" : "text-text-muted"} capitalize`}>
                          {inv.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
