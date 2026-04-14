"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, Clock, FileText, Sparkles, Rocket, Mail, MessageSquare, Star,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const welcomeSteps = [
  { title: "Project Received", description: "We've saved your configuration and pricing.", icon: CheckCircle2, done: true },
  { title: "Team Review", description: "Our team is reviewing your requirements.", icon: FileText, done: false, active: true },
  { title: "We Reach Out", description: "We'll email you with next steps, questions, and a project brief.", icon: Mail, done: false },
  { title: "Design Phase", description: "We create wireframes and designs for your approval.", icon: Sparkles, done: false },
  { title: "Development", description: "We start building your project. You'll track progress right here in your dashboard.", icon: Rocket, done: false },
];

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

function DashboardContent() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const [showCelebration, setShowCelebration] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("cl_celebrated");
  });
  const [project, setProject] = useState<ProjectData | null>(null);
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

  // Fetch real project data from Supabase; claim any ?quoteId=... first
  useEffect(() => {
    const fetchProject = async () => {
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
      setDataLoaded(true);
    };
    fetchProject();
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

              {/* Floating stars */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -80 - Math.random() * 60,
                    x: (Math.random() - 0.5) * 200,
                  }}
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
        <div className="flex items-center justify-center h-40 text-text-muted text-sm">Loading your projects...</div>
      ) : project ? (
        /* Real project with milestones from Supabase */
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">{project.name}</h1>
            <p className="text-text-muted text-sm capitalize">{project.status.replace("_", " ")}</p>
          </motion.div>

          {/* Progress bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
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
          </motion.div>

          {/* Milestones */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h2 className="text-sm font-semibold mb-5">Milestones</h2>
            <div className="space-y-3">
              {project.milestones.map((m, i) => (
                <div key={m.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
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
                      <p className="text-text-muted text-[10px] mt-0.5">Completed {new Date(m.completed_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : quoteId ? (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Quote flow — project received but not started yet */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to CodeLaunch!</h1>
            <p className="text-text-secondary text-base">We&apos;ve received your project configuration and our team is reviewing it.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-6">What Happens Next</h2>
            <div className="space-y-4">
              {welcomeSteps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      step.done ? "bg-accent/15 text-accent" : step.active ? "bg-accent/10 text-accent border border-accent/20" : "bg-bg-elevated text-text-muted"
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    {i < welcomeSteps.length - 1 && (
                      <div className={`w-px h-6 mt-1 ${step.done ? "bg-accent/30" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="pt-2">
                    <h3 className={`text-sm font-semibold ${step.done ? "text-accent" : step.active ? "text-text-primary" : "text-text-muted"}`}>
                      {step.title}
                      {step.done && <span className="ml-2 text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">Done</span>}
                      {step.active && <span className="ml-2 text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded animate-pulse">In Progress</span>}
                    </h3>
                    <p className="text-text-muted text-xs mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Check Your Email</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  You&apos;ll hear from us within 24 hours with next steps, questions about your project, and a detailed project brief.
                  All communication happens via email and right here in your dashboard.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Your Project Portal</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  This dashboard is where you&apos;ll track progress, upload files, view invoices, and message your development team.
                  Once your project kicks off, everything happens right here.
                </p>
              </div>
            </div>
          </motion.div>
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
