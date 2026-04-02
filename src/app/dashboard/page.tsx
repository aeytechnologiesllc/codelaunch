"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock, CheckCircle2, Circle, ArrowRight, CalendarDays,
  FileText, Package, Sparkles, Rocket, Mail, MessageSquare, Phone,
} from "lucide-react";

// Mock project data
const project = {
  name: "Custom Online Ordering Platform",
  type: "Web Application",
  quoteNumber: "CL-2026-0042",
  status: "In Progress",
  startDate: "March 10, 2026",
  estimatedCompletion: "April 18, 2026",
  daysRemaining: 21,
  totalWeeks: 6,
  currentWeek: 3,
  progress: 48,
  totalCost: "$7,400",
  paid: "$3,700",
  remaining: "$3,700",
  paymentPlan: "50/50 Split",
};

const milestones = [
  {
    id: 1,
    title: "Project Kickoff",
    description: "Discovery call completed, requirements gathered, project brief delivered.",
    date: "Mar 10",
    status: "completed" as const,
  },
  {
    id: 2,
    title: "Design Phase",
    description: "Wireframes and UI design for all screens. 2 design concepts presented.",
    date: "Mar 14",
    status: "completed" as const,
  },
  {
    id: 3,
    title: "Design Approved",
    description: "You approved the final design on March 18.",
    date: "Mar 18",
    status: "completed" as const,
  },
  {
    id: 4,
    title: "Core Development",
    description: "Building the ordering system, menu management, and customer-facing pages.",
    date: "Mar 19 – Apr 4",
    status: "in_progress" as const,
    subTasks: [
      { label: "Menu & product catalog", done: true },
      { label: "Shopping cart & checkout", done: true },
      { label: "Payment integration (Stripe)", done: false },
      { label: "Customer accounts", done: false },
      { label: "Order notifications (Telegram)", done: false },
    ],
  },
  {
    id: 5,
    title: "Admin Dashboard",
    description: "Your back-office: order management, analytics, menu editor.",
    date: "Apr 4 – Apr 11",
    status: "upcoming" as const,
  },
  {
    id: 6,
    title: "Testing & QA",
    description: "End-to-end testing, mobile testing, performance optimization.",
    date: "Apr 11 – Apr 15",
    status: "upcoming" as const,
  },
  {
    id: 7,
    title: "Launch",
    description: "Deploy to production, DNS setup, final walkthrough with you.",
    date: "Apr 18",
    status: "upcoming" as const,
  },
];

const recentActivity = [
  { text: "Shopping cart & checkout completed", time: "2 hours ago", type: "completed" },
  { text: "New design file uploaded: checkout-flow-v2.fig", time: "Yesterday", type: "file" },
  { text: "Weekly demo #2 delivered — recording available", time: "2 days ago", type: "demo" },
  { text: "Payment for Phase 1 received ($3,700)", time: "Mar 10", type: "payment" },
  { text: "Project brief delivered to your email", time: "Mar 10", type: "file" },
];

const welcomeSteps = [
  { title: "Project Received", description: "We've saved your configuration and pricing.", icon: CheckCircle2, done: true },
  { title: "Team Review", description: "Our team is reviewing your requirements.", icon: FileText, done: false, active: true },
  { title: "Kickoff Call", description: "We'll schedule a call to discuss your project in detail.", icon: Phone, done: false },
  { title: "Design Phase", description: "We create wireframes and designs for your approval.", icon: Sparkles, done: false },
  { title: "Development Begins", description: "Your software gets built with weekly progress demos.", icon: Rocket, done: false },
];

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto p-8 text-center text-text-muted">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");

  if (quoteId) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to CodeLaunch!</h1>
          <p className="text-text-secondary text-base">We&apos;ve received your project configuration and our team is reviewing it.</p>
        </motion.div>

        {/* What happens next */}
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

        {/* Contact info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Check Your Email</h3>
              <p className="text-text-muted text-xs leading-relaxed">
                You&apos;ll hear from us within 24 hours to schedule your kickoff call.
                We&apos;ll also send you a detailed project brief and next steps via email and in-app message.
              </p>
            </div>
          </div>
        </motion.div>

        {/* In-app messaging teaser */}
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
    );
  }

  // No quoteId — user signed up directly without going through pricing
  return (
    <div className="max-w-3xl mx-auto space-y-8">
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
              <p className="text-text-muted text-xs mt-0.5">Our team reviews your configuration and schedules a kickoff call within 24 hours.</p>
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
  );

  /* Original mock dashboard below — will be used when real project data exists */
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Project header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-text-muted text-xs">{project.quoteNumber}</span>
            <span className="px-2 py-0.5 bg-accent/10 rounded-full text-[10px] text-accent font-semibold">{project.status}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{project.name}</h1>
          <p className="text-text-muted text-sm mt-0.5">{project.type}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold gradient-text">{project.daysRemaining} days</div>
          <div className="text-text-muted text-xs">until estimated launch</div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-accent font-bold text-sm">{project.progress}%</span>
        </div>
        <div className="h-3 bg-bg-primary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.6), rgba(167,139,250,1))" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-text-muted">
          <span>Week {project.currentWeek} of {project.totalWeeks}</span>
          <span>Est. completion: {project.estimatedCompletion}</span>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Start Date", value: project.startDate, icon: CalendarDays },
          { label: "Total Cost", value: project.totalCost, icon: FileText },
          { label: "Paid", value: project.paid, icon: CheckCircle2 },
          { label: "Remaining", value: project.remaining, icon: Clock },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="glass-card p-4"
          >
            <stat.icon className="w-4 h-4 text-accent mb-2" />
            <div className="text-sm sm:text-base font-bold">{stat.value}</div>
            <div className="text-text-muted text-xs">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-5 sm:p-6"
        >
          <h2 className="text-base font-semibold mb-6 flex items-center gap-2">
            <Package className="w-4 h-4 text-accent" />
            Project Timeline
          </h2>

          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.id} className="flex gap-4">
                {/* Timeline line & dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.status === "completed"
                      ? "bg-cta text-cta-text"
                      : m.status === "in_progress"
                      ? "bg-accent/20 border-2 border-accent"
                      : "bg-bg-elevated border-2 border-border"
                  }`}>
                    {m.status === "completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : m.status === "in_progress" ? (
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    ) : (
                      <Circle className="w-3 h-3 text-text-muted" />
                    )}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[24px] ${
                      m.status === "completed" ? "bg-accent/30" : "bg-border"
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-6 flex-1 ${m.status === "upcoming" ? "opacity-50" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-semibold ${m.status === "in_progress" ? "text-accent" : ""}`}>
                      {m.title}
                      {m.status === "in_progress" && (
                        <span className="ml-2 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">Current</span>
                      )}
                    </h3>
                    <span className="text-[11px] text-text-muted whitespace-nowrap">{m.date}</span>
                  </div>
                  <p className="text-text-muted text-xs mt-1 leading-relaxed">{m.description}</p>

                  {/* Sub-tasks for in-progress milestone */}
                  {m.subTasks && (
                    <div className="mt-3 space-y-1.5">
                      {m.subTasks.map((task) => (
                        <div key={task.label} className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 ${
                            task.done ? "bg-cta text-cta-text" : "border border-border"
                          }`}>
                            {task.done && <CheckCircle2 className="w-2.5 h-2.5" />}
                          </div>
                          <span className={`text-xs ${task.done ? "text-text-secondary line-through" : "text-text-secondary"}`}>
                            {task.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Recent Activity
          </h2>

          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  a.type === "completed" ? "bg-accent" :
                  a.type === "payment" ? "bg-accent" :
                  a.type === "demo" ? "bg-accent/60" :
                  "bg-text-muted"
                }`} />
                <div>
                  <p className="text-xs text-text-secondary leading-relaxed">{a.text}</p>
                  <span className="text-[10px] text-text-muted">{a.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 text-center text-xs text-accent hover:text-accent-hover transition-colors py-2 border-t border-border">
            View All Activity
          </button>
        </motion.div>
      </div>
    </div>
  );
}
