"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  ArrowUpRight, Package, DollarSign, Clock, Users, Archive, Trash2,
  MoreHorizontal, ArchiveRestore, Loader2, X,
} from "lucide-react";

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  company_name: string;
  project_type: string;
  total_price: number;
  estimated_weeks: number;
  status: string;
  created_at: string;
  archived_at: string | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  progress_percentage: number | null;
  quote_id: string;
  milestones: { id: string; title: string; status: string }[];
}

type FilterKey = "active" | "archived" | "all";

export default function AdminOverview() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("active");
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [busyQuoteId, setBusyQuoteId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: q }, { data: p }] = await Promise.all([
        supabase.from("quotes").select("*").order("created_at", { ascending: false }),
        supabase.from("projects").select("*, milestones(*)"),
      ]);
      setQuotes(q || []);
      setProjects(p || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpenFor) return;
    const handler = () => setMenuOpenFor(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [menuOpenFor]);

  const getProjectForQuote = (quoteId: string) => projects.find((p) => p.quote_id === quoteId);

  const visibleQuotes = useMemo(() => {
    if (filter === "active") return quotes.filter((q) => !q.archived_at);
    if (filter === "archived") return quotes.filter((q) => q.archived_at);
    return quotes;
  }, [quotes, filter]);

  // Stats are computed over visible quotes (what user sees)
  const stats = {
    totalQuotes: visibleQuotes.length,
    activeProjects: projects.filter((p) => p.status !== "launched" && p.status !== "completed" && p.status !== "cancelled").length,
    totalRevenue: visibleQuotes.reduce((sum, q) => sum + (Number(q.total_price) || 0), 0),
    completedProjects: projects.filter((p) => p.status === "launched" || p.status === "completed").length,
  };

  const archiveQuote = async (quote: Quote) => {
    setBusyQuoteId(quote.id);
    const { error } = await supabase
      .from("quotes")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", quote.id);
    if (error) {
      alert(`Archive failed: ${error.message}`);
    } else {
      setQuotes((prev) => prev.map((q) => (q.id === quote.id ? { ...q, archived_at: new Date().toISOString() } : q)));
    }
    setBusyQuoteId(null);
    setMenuOpenFor(null);
  };

  const unarchiveQuote = async (quote: Quote) => {
    setBusyQuoteId(quote.id);
    const { error } = await supabase
      .from("quotes")
      .update({ archived_at: null })
      .eq("id", quote.id);
    if (error) {
      alert(`Restore failed: ${error.message}`);
    } else {
      setQuotes((prev) => prev.map((q) => (q.id === quote.id ? { ...q, archived_at: null } : q)));
    }
    setBusyQuoteId(null);
    setMenuOpenFor(null);
  };

  const deleteQuote = async (quote: Quote) => {
    setBusyQuoteId(quote.id);
    // Delete cascade order: messages → milestones → projects → files → invoices → quote
    const proj = getProjectForQuote(quote.id);
    if (proj) {
      await supabase.from("project_messages").delete().eq("project_id", proj.id);
      await supabase.from("milestones").delete().eq("project_id", proj.id);
      await supabase.from("project_files").delete().eq("project_id", proj.id);
      await supabase.from("project_invoices").delete().eq("project_id", proj.id);
      await supabase.from("projects").delete().eq("id", proj.id);
    }
    const { error } = await supabase.from("quotes").delete().eq("id", quote.id);
    if (error) {
      alert(`Delete failed: ${error.message}`);
      setBusyQuoteId(null);
      return;
    }
    setQuotes((prev) => prev.filter((q) => q.id !== quote.id));
    setProjects((prev) => prev.filter((p) => p.quote_id !== quote.id));
    setBusyQuoteId(null);
    setDeleteConfirm(null);
    setMenuOpenFor(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="skeleton h-6 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
        <div className="skeleton h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-text-muted text-sm">Manage quotes, projects, and client milestones.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Quotes", value: stats.totalQuotes, icon: Package, color: "text-accent" },
          { label: "Active Projects", value: stats.activeProjects, icon: Clock, color: "text-amber-400" },
          { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
          { label: "Completed", value: stats.completedProjects, icon: Users, color: "text-blue-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-xs uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Quotes list */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Quotes</h2>
          <div className="flex items-center gap-3">
            {/* Filter tabs */}
            <div className="inline-flex glass-card p-1 gap-1">
              {[
                { key: "active" as const, label: "Active", count: quotes.filter((q) => !q.archived_at).length },
                { key: "archived" as const, label: "Archived", count: quotes.filter((q) => q.archived_at).length },
                { key: "all" as const, label: "All", count: quotes.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    filter === tab.key ? "bg-accent/15 text-accent" : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-[10px] opacity-70">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {visibleQuotes.length === 0 ? (
          <div className="p-10 text-center text-text-muted text-sm">
            {filter === "archived"
              ? "No archived quotes. Archiving old ones here keeps your active list clean."
              : filter === "active"
              ? "No active quotes yet. They'll land here as clients use the pricing calculator."
              : "Nothing to show yet."}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            <AnimatePresence initial={false}>
              {visibleQuotes.map((quote) => {
                const project = getProjectForQuote(quote.id);
                const isBusy = busyQuoteId === quote.id;
                const isMenuOpen = menuOpenFor === quote.id;
                const progress = project ? (project.progress_percentage ?? project.progress ?? 0) : 0;

                return (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <div className={`flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors ${quote.archived_at ? "opacity-60" : ""}`}>
                      <Link
                        href={`/admin/projects/${quote.id}`}
                        className="flex-1 min-w-0 flex items-center gap-4 group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-semibold group-hover:text-accent transition-colors truncate">
                              {quote.client_name || "Unknown"}
                            </span>
                            <span className="text-text-muted text-[10px] font-mono">{quote.quote_number}</span>
                            {quote.archived_at && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-text-muted/10 text-text-muted rounded font-semibold uppercase tracking-wider">
                                Archived
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                            <span>{quote.project_type || "—"}</span>
                            <span>{quote.company_name || "—"}</span>
                            <span>{new Date(quote.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          {project ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                                <div className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
                              </div>
                              <span className="text-xs text-accent font-medium">{progress}%</span>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 rounded text-[10px] font-semibold">New Quote</span>
                          )}
                          <span className="text-sm font-semibold text-accent">${(quote.total_price || 0).toLocaleString()}</span>
                          <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                        </div>
                      </Link>

                      {/* Action menu */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setMenuOpenFor(isMenuOpen ? null : quote.id);
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-white/[0.05] text-text-muted hover:text-text-primary transition-colors flex items-center justify-center"
                          disabled={isBusy}
                          aria-label="More actions"
                        >
                          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
                        </button>

                        <AnimatePresence>
                          {isMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.97 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 top-full mt-1 z-20 glass-card p-1 min-w-[160px] shadow-xl border-white/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {quote.archived_at ? (
                                <button
                                  onClick={() => unarchiveQuote(quote)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-white/[0.05] text-text-secondary"
                                >
                                  <ArchiveRestore className="w-3.5 h-3.5 text-accent" />
                                  Restore
                                </button>
                              ) : (
                                <button
                                  onClick={() => archiveQuote(quote)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-white/[0.05] text-text-secondary"
                                >
                                  <Archive className="w-3.5 h-3.5 text-amber-400" />
                                  Archive
                                </button>
                              )}
                              <div className="h-px bg-border my-1" />
                              <button
                                onClick={() => { setDeleteConfirm(quote); setMenuOpenFor(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-red-500/10 text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-md"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card p-6 max-w-md w-full border-red-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1">Delete quote permanently?</h3>
                  <p className="text-text-muted text-xs leading-relaxed">
                    This removes quote <span className="font-mono text-text-secondary">#{deleteConfirm.quote_number}</span>
                    {" "}from <span className="text-text-secondary font-semibold">{deleteConfirm.client_name || "Unknown"}</span>
                    {getProjectForQuote(deleteConfirm.id) && (
                      <> and its linked project, milestones, and messages</>
                    )}
                    . This can&apos;t be undone — consider archiving instead.
                  </p>
                </div>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="w-7 h-7 rounded-md hover:bg-white/[0.05] flex items-center justify-center flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-xs font-medium rounded-lg hover:bg-white/[0.05] text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteQuote(deleteConfirm)}
                  disabled={busyQuoteId === deleteConfirm.id}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-red-500 hover:bg-red-500/90 text-white disabled:opacity-50"
                >
                  {busyQuoteId === deleteConfirm.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
