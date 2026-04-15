"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, Clock, Sparkles, Rocket, Mail, Star,
  Globe, Smartphone, Brain, Plug, DollarSign, Calendar, Layers,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Status labels + dot colors — drive every UI element from a single source of truth
const statusLabels: Record<string, { label: string; color: string; dotClass: string }> = {
  discovery: { label: "Discovery", color: "text-amber-400", dotClass: "bg-amber-400 status-dot-live" },
  planning: { label: "Planning", color: "text-amber-400", dotClass: "bg-amber-400 status-dot-live" },
  in_review: { label: "In Review", color: "text-accent", dotClass: "bg-accent status-dot-live" },
  active: { label: "Active", color: "text-accent", dotClass: "bg-accent status-dot-live" },
  design: { label: "Design Phase", color: "text-accent", dotClass: "bg-accent status-dot-live" },
  development: { label: "In Development", color: "text-accent", dotClass: "bg-accent status-dot-live" },
  testing: { label: "Testing & Review", color: "text-accent", dotClass: "bg-accent status-dot-live" },
  launched: { label: "Launched", color: "text-green-400", dotClass: "bg-green-400" },
  completed: { label: "Completed", color: "text-green-400", dotClass: "bg-green-400" },
  on_hold: { label: "On Hold", color: "text-text-muted", dotClass: "bg-text-muted" },
  cancelled: { label: "Cancelled", color: "text-text-muted", dotClass: "bg-text-muted" },
};

function prettyStatus(raw: string | null | undefined) {
  if (!raw) return statusLabels.discovery;
  return statusLabels[raw.toLowerCase()] || { label: raw, color: "text-text-muted", dotClass: "bg-text-muted" };
}

const projectTypeLabels: Record<string, { label: string; icon: typeof Globe }> = {
  web: { label: "Web Application", icon: Globe },
  mobile: { label: "Mobile App", icon: Smartphone },
  ai: { label: "AI Integration", icon: Brain },
  integration: { label: "Integrations & Bots", icon: Plug },
};

function prettyProjectType(raw: string | null | undefined) {
  if (!raw) return { label: "Custom Project", icon: Sparkles };
  const key = raw.toLowerCase();
  return projectTypeLabels[key] || { label: raw, icon: Sparkles };
}

function formatMoney(n: number | string | null | undefined) {
  if (n == null) return "—";
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (!isFinite(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto p-8 text-center text-text-muted">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

interface ProjectData {
  id: string;
  name: string;
  status: string;
  progress: number;
  milestones: { id: string; title: string; status: string; completed_at: string | null; sort_order: number }[];
}

interface QuoteData {
  id: string;
  quote_number: string;
  project_type: string;
  selected_features: unknown;
  selected_automations: unknown;
  design_level: string | null;
  total_price: number | string;
  estimated_weeks: number | string | null;
  payment_plan: string | null;
  created_at: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const [showCelebration, setShowCelebration] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("cl_celebrated");
  });
  const [project, setProject] = useState<ProjectData | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Show celebration once per session, then never again
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
        sessionStorage.setItem("cl_celebrated", "1");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  // Fetch real project + quote data from Supabase; claim any ?quoteId=... first
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setDataLoaded(true); return; }

      // If arriving from the pricing flow with a quoteId, claim it so
      // the quote + any linked project attach to this profile.
      if (quoteId) {
        await supabase.rpc("claim_quote", { target_quote_id: quoteId });
      }

      // Find projects belonging to this profile (RLS enforces access)
      const { data: projects } = await supabase
        .from("projects")
        .select("id, name, status, progress, progress_percentage, milestones(id, title, status, completed_at, sort_order)")
        .eq("client_profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (projects && projects.length > 0) {
        const p = projects[0];
        // Prefer progress_percentage (newer field) but fall back to progress
        const progressValue = typeof p.progress_percentage === "number" && p.progress_percentage > 0
          ? p.progress_percentage
          : (p.progress ?? 0);
        setProject({
          id: p.id,
          name: p.name,
          status: p.status,
          progress: progressValue,
          milestones: (p.milestones || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
        });
      }

      // Also fetch the user's most recent quote so we can show what they
      // selected in the pricing flow. This covers both the URL param case
      // (just finished pricing) and returning visits after the param is gone.
      let quoteQuery = supabase
        .from("quotes")
        .select("id, quote_number, project_type, selected_features, selected_automations, design_level, total_price, estimated_weeks, payment_plan, created_at")
        .order("created_at", { ascending: false })
        .limit(1);
      if (quoteId) {
        quoteQuery = quoteQuery.eq("id", quoteId);
      } else {
        quoteQuery = quoteQuery.eq("client_profile_id", user.id);
      }
      const { data: quotes } = await quoteQuery;
      if (quotes && quotes.length > 0) {
        setQuote(quotes[0] as QuoteData);
      }

      setDataLoaded(true);
    };
    fetchData();
  }, [quoteId]);

  return (
    <>
      {/* Celebration overlay — shows once on first dashboard visit */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center"
            >
              {/* Animated rings */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute inset-0 rounded-full border-2 border-accent/20"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 0.5 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute inset-0 rounded-full border border-accent/10"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.6, opacity: 0.3 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="absolute inset-0 rounded-full border border-accent/5"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 12 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-accent/15 flex items-center justify-center">
                    <Rocket className="w-10 h-10 text-accent" />
                  </div>
                </motion.div>
              </div>

              {/* Floating stars — deterministic offsets so React purity is preserved */}
              {[
                { y: -110, x: -80 },
                { y: -90, x: 60 },
                { y: -130, x: -40 },
                { y: -100, x: 90 },
                { y: -80, x: -100 },
                { y: -120, x: 40 },
              ].map((offset, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={{ opacity: [0, 1, 0], y: offset.y, x: offset.x }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                  className="absolute left-1/2 top-1/3"
                >
                  <Star className="w-4 h-4 text-accent fill-accent" />
                </motion.div>
              ))}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-3xl sm:text-4xl font-bold mb-3"
              >
                You&apos;re In!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-text-secondary text-lg"
              >
                Welcome to your project portal
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard content */}
      {!dataLoaded ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-20 w-full rounded-2xl" />
          <div className="skeleton h-60 w-full rounded-2xl" />
        </div>
      ) : project ? (
        /* Real project view — always honest, drives every state from DB */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header: project name + real status pill */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${prettyStatus(project.status).dotClass}`} />
              <span className={`text-xs font-semibold uppercase tracking-wider ${prettyStatus(project.status).color}`}>
                {prettyStatus(project.status).label}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">{project.name}</h1>
          </motion.div>

          {/* Quote Configuration card — what they selected in the pricing flow */}
          {quote && (() => {
            const typeInfo = prettyProjectType(quote.project_type);
            const ProjectIcon = typeInfo.icon;
            const features = Array.isArray(quote.selected_features) ? (quote.selected_features as string[]) : [];
            const automations = Array.isArray(quote.selected_automations) ? (quote.selected_automations as string[]) : [];
            const weeks = typeof quote.estimated_weeks === "number"
              ? quote.estimated_weeks
              : quote.estimated_weeks ? parseFloat(String(quote.estimated_weeks)) : null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="glass-card p-6 sm:p-7 relative overflow-hidden"
              >
                {/* Warm ambient corner to echo the pricing "confidence" moment */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent-warm/[0.06] rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-16 w-56 h-56 bg-accent/[0.08] rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-accent font-semibold uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3" /> Your Project Configuration
                      </div>
                      <h2 className="text-lg font-semibold">Quote #{quote.quote_number}</h2>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text-muted">Total</div>
                      <div className="text-2xl font-bold gradient-text-warm">{formatMoney(quote.total_price)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="glass-card p-3 bg-accent/[0.02]">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                        <ProjectIcon className="w-4 h-4 text-accent" />
                      </div>
                      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Type</div>
                      <div className="text-xs font-semibold truncate">{typeInfo.label}</div>
                    </div>
                    <div className="glass-card p-3 bg-accent/[0.02]">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                        <Layers className="w-4 h-4 text-accent" />
                      </div>
                      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Features</div>
                      <div className="text-xs font-semibold">{features.length + automations.length}</div>
                    </div>
                    <div className="glass-card p-3 bg-accent/[0.02]">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                        <Calendar className="w-4 h-4 text-accent" />
                      </div>
                      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Timeline</div>
                      <div className="text-xs font-semibold">{weeks ? `~${weeks} weeks` : "TBD"}</div>
                    </div>
                    <div className="glass-card p-3 bg-accent/[0.02]">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                        <DollarSign className="w-4 h-4 text-accent" />
                      </div>
                      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Payment</div>
                      <div className="text-xs font-semibold capitalize">
                        {quote.payment_plan === "full" ? "Full" :
                         quote.payment_plan === "5050" ? "50/50 Split" :
                         quote.payment_plan === "3mo" ? "3 Months" :
                         quote.payment_plan === "6mo" ? "6 Months" :
                         (quote.payment_plan || "—")}
                      </div>
                    </div>
                  </div>

                  {(features.length > 0 || automations.length > 0) && (
                    <div>
                      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2 font-semibold">
                        What you selected
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[...features, ...automations].slice(0, 12).map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-bg-primary/60 border border-border text-[11px] text-text-secondary"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-accent" />
                            {String(f).replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        ))}
                        {(features.length + automations.length) > 12 && (
                          <span className="px-2 py-1 rounded-md bg-bg-primary/60 border border-border text-[11px] text-text-muted">
                            +{features.length + automations.length - 12} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })()}

          {/* Progress bar — real percentage from the project row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Project Progress</span>
              <span className="text-accent font-bold text-lg">{project.progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-bg-elevated rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full"
              />
            </div>
            {project.progress === 0 && (
              <p className="text-text-muted text-[11px] mt-3 leading-relaxed">
                We&apos;ve received your project configuration. Your progress bar will tick up as we complete each phase.
              </p>
            )}
          </motion.div>

          {/* Milestones — always the real ones from the database */}
          {project.milestones.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6"
            >
              <h2 className="text-sm font-semibold mb-5">Milestones</h2>
              <div className="space-y-3">
                {project.milestones.map((m, i) => (
                  <div key={m.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        m.status === "completed" ? "bg-accent/15 text-accent"
                          : m.status === "in_progress" ? "bg-amber-400/15 text-amber-400"
                          : "bg-bg-elevated text-text-muted"
                      }`}>
                        {m.status === "completed" ? <CheckCircle2 className="w-4 h-4" />
                          : m.status === "in_progress" ? <Clock className="w-4 h-4" />
                          : <Circle className="w-4 h-4" />}
                      </div>
                      {i < project.milestones.length - 1 && (
                        <div className={`w-px h-5 mt-1 ${m.status === "completed" ? "bg-accent/30" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <h3 className={`text-sm font-semibold ${
                        m.status === "completed" ? "text-accent"
                          : m.status === "in_progress" ? "text-text-primary"
                          : "text-text-muted"
                      }`}>
                        {m.title}
                        {m.status === "completed" && <span className="ml-2 text-[9px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">Done</span>}
                        {m.status === "in_progress" && <span className="ml-2 text-[9px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded animate-pulse">In Progress</span>}
                      </h3>
                      {m.completed_at && (
                        <p className="text-text-muted text-[10px] mt-0.5">
                          Completed {new Date(m.completed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact card — still useful during discovery */}
          {(project.status === "discovery" || project.status === "planning" || project.status === "in_review") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">Check Your Email</h3>
                  <p className="text-text-muted text-xs leading-relaxed">
                    You&apos;ll hear from us within 24 hours with next steps and questions. You can also{" "}
                    <a href="/dashboard/messages" className="text-accent hover:underline">send us a message here</a>
                    {" "}or{" "}
                    <a href="/dashboard/files" className="text-accent hover:underline">upload reference files</a>
                    {" "}— we have everything we need from the quote to get started.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Direct signup — no project yet */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to CodeLaunch!</h1>
            <p className="text-text-secondary text-base mb-8">You&apos;re all set. Let&apos;s get your project started.</p>

            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cta text-cta-text font-semibold rounded-xl btn-glow hover:bg-cta-hover transition-all text-base"
            >
              <Sparkles className="w-5 h-5" />
              Start Your Project
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-xs font-bold">1</div>
                <div>
                  <h3 className="text-sm font-semibold">Configure Your Project</h3>
                  <p className="text-text-muted text-xs mt-0.5">Use our pricing calculator to pick your project type, features, and design. See exact pricing in real-time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-xs font-bold">2</div>
                <div>
                  <h3 className="text-sm font-semibold">We Review & Kick Off</h3>
                  <p className="text-text-muted text-xs mt-0.5">Our team reviews your configuration and reaches out via email within 24 hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-xs font-bold">3</div>
                <div>
                  <h3 className="text-sm font-semibold">Track Everything Here</h3>
                  <p className="text-text-muted text-xs mt-0.5">Once your project starts, this dashboard becomes your command center — progress, files, invoices, and messaging all in one place.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
