"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle2, Circle, Clock, Loader2, Plus, Rocket } from "lucide-react";
import Link from "next/link";

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name: string;
  project_type: string;
  selected_features: string[];
  total_price: number;
  monthly_price: number;
  estimated_weeks: number;
  design_level: string;
  maintenance_plan: string;
  payment_plan: string;
  rush_delivery: boolean;
  status: string;
  created_at: string;
  user_id: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  description: string;
  user_id: string;
  estimated_completion: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  sort_order: number;
  completed_at: string | null;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: quoteId } = use(params);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingMilestone, setUpdatingMilestone] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Get the quote
      const { data: q } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", quoteId)
        .single();

      setQuote(q);

      // Check if project exists for this quote
      if (q) {
        const { data: p } = await supabase
          .from("projects")
          .select("*")
          .eq("quote_id", quoteId)
          .single();

        if (p) {
          setProject(p);
          const { data: m } = await supabase
            .from("milestones")
            .select("*")
            .eq("project_id", p.id)
            .order("sort_order", { ascending: true });
          setMilestones(m || []);
        }
      }

      setLoading(false);
    };
    fetchData();
  }, [quoteId]);

  const createProject = async () => {
    if (!quote) return;
    setCreating(true);

    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteId: quote.id,
        name: `${quote.company_name || quote.client_name}'s ${quote.project_type || "Project"}`,
        description: `Quote ${quote.quote_number}`,
        userId: quote.user_id,
      }),
    });

    const data = await res.json();
    if (data.project) {
      setProject(data.project);
      // Fetch milestones
      const { data: m } = await supabase
        .from("milestones")
        .select("*")
        .eq("project_id", data.project.id)
        .order("sort_order", { ascending: true });
      setMilestones(m || []);
    }
    setCreating(false);
  };

  const updateMilestone = async (milestoneId: string, newStatus: string) => {
    setUpdatingMilestone(milestoneId);

    const res = await fetch(`/api/admin/milestones/${milestoneId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();
    if (data.milestone) {
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, ...data.milestone } : m))
      );
      // Update project progress
      const total = milestones.length;
      const completed = milestones.filter((m) =>
        m.id === milestoneId ? newStatus === "completed" : m.status === "completed"
      ).length;
      const progress = Math.round((completed / total) * 100);
      setProject((prev) => prev ? { ...prev, progress } : prev);
    }
    setUpdatingMilestone(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-muted text-sm">Loading...</div>;
  }

  if (!quote) {
    return <div className="text-center py-20 text-text-muted">Quote not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link href="/admin" className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Overview
      </Link>

      {/* Quote header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold">{quote.client_name}</h1>
              <span className="text-text-muted text-xs font-mono">{quote.quote_number}</span>
            </div>
            <p className="text-text-muted text-sm">{quote.company_name} &middot; {quote.client_email}</p>
            {quote.client_phone && <p className="text-text-muted text-xs mt-0.5">{quote.client_phone}</p>}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">${(quote.total_price || 0).toLocaleString()}</div>
            <div className="text-text-muted text-xs">~{quote.estimated_weeks} weeks</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
          <div>
            <div className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">Project Type</div>
            <div className="text-sm font-medium">{quote.project_type || "—"}</div>
          </div>
          <div>
            <div className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">Design</div>
            <div className="text-sm font-medium capitalize">{quote.design_level || "standard"}</div>
          </div>
          <div>
            <div className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">Payment</div>
            <div className="text-sm font-medium capitalize">{quote.payment_plan || "—"}</div>
          </div>
          <div>
            <div className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">Submitted</div>
            <div className="text-sm font-medium">{new Date(quote.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Features */}
        {quote.selected_features && quote.selected_features.length > 0 && (
          <div className="pt-4 mt-4 border-t border-border">
            <div className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Selected Features</div>
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(quote.selected_features) ? quote.selected_features : []).map((f: string) => (
                <span key={f} className="px-2 py-0.5 bg-accent/10 rounded text-[10px] text-accent font-medium">{f}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Project + Milestones */}
      {!project ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 text-center">
          <Rocket className="w-10 h-10 text-accent mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">Start This Project</h2>
          <p className="text-text-muted text-sm mb-6">Create a project from this quote to begin tracking milestones.</p>
          <button
            onClick={createProject}
            disabled={creating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-cta-text font-semibold rounded-xl btn-glow hover:bg-cta-hover transition-all text-sm disabled:opacity-50"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {creating ? "Creating..." : "Create Project"}
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-text-muted text-xs capitalize">{project.status}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-bg-elevated rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
              </div>
              <span className="text-sm font-bold text-accent">{project.progress}%</span>
            </div>
          </div>

          {/* Milestone list */}
          <div className="space-y-2">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  milestone.status === "completed"
                    ? "border-accent/20 bg-accent/[0.03]"
                    : milestone.status === "in_progress"
                    ? "border-amber-400/20 bg-amber-400/[0.03]"
                    : "border-border bg-transparent"
                }`}
              >
                {/* Status icon */}
                <button
                  onClick={() => {
                    const nextStatus = milestone.status === "pending" ? "in_progress" : milestone.status === "in_progress" ? "completed" : "pending";
                    updateMilestone(milestone.id, nextStatus);
                  }}
                  disabled={updatingMilestone === milestone.id}
                  className="flex-shrink-0"
                >
                  {updatingMilestone === milestone.id ? (
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                  ) : milestone.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  ) : milestone.status === "in_progress" ? (
                    <Clock className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-text-muted" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold ${milestone.status === "completed" ? "text-accent" : milestone.status === "in_progress" ? "text-amber-400" : "text-text-secondary"}`}>
                    {milestone.title}
                  </h3>
                  {milestone.completed_at && (
                    <p className="text-text-muted text-[10px] mt-0.5">
                      Completed {new Date(milestone.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Status badge */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  milestone.status === "completed" ? "bg-accent/10 text-accent"
                    : milestone.status === "in_progress" ? "bg-amber-400/10 text-amber-400"
                    : "bg-bg-elevated text-text-muted"
                }`}>
                  {milestone.status === "completed" ? "Done" : milestone.status === "in_progress" ? "Active" : "Pending"}
                </span>
              </div>
            ))}
          </div>

          <p className="text-text-muted text-xs mt-4">Click the circle icon to cycle: Pending → Active → Done → Pending</p>
        </motion.div>
      )}
    </div>
  );
}
