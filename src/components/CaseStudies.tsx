"use client";

import { ScrollReveal } from "./ScrollReveal";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

function HiringAppMockup() {
  return (
    <div className="bg-bg-elevated rounded-xl overflow-hidden text-[11px]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500/60" /><div className="w-2 h-2 rounded-full bg-yellow-500/60" /><div className="w-2 h-2 rounded-full bg-green-500/60" /></div>
        <div className="flex-1 text-center text-[9px] text-text-muted">hire.platform.com</div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold">Hiring Pipeline</div>
          <div className="px-2 py-0.5 bg-accent/15 rounded text-[9px] text-accent">12 Active</div>
        </div>
        {/* Kanban columns */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { stage: "Applied", count: 24, items: ["Sarah K.", "Mike R.", "Ana L."] },
            { stage: "Screening", count: 8, items: ["John D.", "Lisa M."] },
            { stage: "Interview", count: 5, items: ["Chris P."] },
            { stage: "Offer", count: 2, items: ["Emma W."] },
          ].map((col) => (
            <div key={col.stage} className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[9px] text-text-muted">{col.stage}</span>
                <span className="text-[9px] text-text-muted bg-bg-primary/60 px-1 rounded">{col.count}</span>
              </div>
              {col.items.map((name) => (
                <div key={name} className="bg-bg-primary/60 rounded p-1.5 border border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-accent-secondary/20 flex items-center justify-center text-[7px] text-accent-secondary font-bold">
                      {name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-[9px]">{name}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* AI match bar */}
        <div className="flex items-center gap-2 bg-accent-secondary/10 rounded-lg p-2 border border-accent-secondary/10">
          <div className="text-[9px] text-accent-secondary font-medium">AI Match Score</div>
          <div className="flex-1 h-1.5 bg-bg-primary/60 rounded-full overflow-hidden">
            <div className="h-full w-[87%] bg-gradient-to-r from-accent-secondary to-accent rounded-full" />
          </div>
          <div className="text-[9px] text-accent-secondary font-bold">87%</div>
        </div>
      </div>
    </div>
  );
}

function FinanceDashMockup() {
  return (
    <div className="bg-bg-elevated rounded-xl overflow-hidden text-[11px]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500/60" /><div className="w-2 h-2 rounded-full bg-yellow-500/60" /><div className="w-2 h-2 rounded-full bg-green-500/60" /></div>
        <div className="flex-1 text-center text-[9px] text-text-muted">analytics.dashboard.io</div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold">Financial Overview</div>
          <div className="flex gap-1">
            {["1W", "1M", "3M", "1Y"].map((p) => (
              <button key={p} className={`px-1.5 py-0.5 rounded text-[8px] ${p === "1M" ? "bg-accent/15 text-accent" : "text-text-muted"}`}>{p}</button>
            ))}
          </div>
        </div>
        {/* Revenue card */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-bg-primary/60 rounded-lg p-3">
            <div className="text-[9px] text-text-muted">Total Revenue</div>
            <div className="text-base font-bold mt-1">$284,392</div>
            <div className="text-[9px] text-green-400">+22.4% vs last month</div>
          </div>
          <div className="bg-bg-primary/60 rounded-lg p-3">
            <div className="text-[9px] text-text-muted">Net Profit</div>
            <div className="text-base font-bold mt-1">$67,841</div>
            <div className="text-[9px] text-green-400">+18.1% vs last month</div>
          </div>
        </div>
        {/* Chart */}
        <div className="bg-bg-primary/60 rounded-lg p-3">
          <div className="h-20 flex items-end gap-1">
            {[45, 60, 38, 72, 55, 85, 67, 92, 78, 95, 88, 70, 98, 82, 105].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i >= 12 ? "linear-gradient(to top, rgba(212,160,23,0.6), rgba(139,92,246,0.4))" : "linear-gradient(to top, rgba(212,160,23,0.2), rgba(139,92,246,0.15))" }} />
            ))}
          </div>
        </div>
        {/* Expense breakdown */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "Payroll", pct: 42, color: "bg-accent-secondary" },
            { label: "Marketing", pct: 23, color: "bg-accent" },
            { label: "Operations", pct: 19, color: "bg-green-400" },
          ].map((e) => (
            <div key={e.label} className="bg-bg-primary/60 rounded p-2">
              <div className="text-[8px] text-text-muted mb-1">{e.label}</div>
              <div className="h-1 bg-bg-primary rounded-full overflow-hidden">
                <div className={`h-full ${e.color} rounded-full`} style={{ width: `${e.pct * 2}%` }} />
              </div>
              <div className="text-[9px] font-medium mt-1">{e.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const caseStudies = [
  {
    title: "Smart Hiring Platform",
    category: "Web Application",
    description: "End-to-end recruitment platform with AI-powered candidate matching, Kanban pipeline tracking, and automated screening. Replaced 4 disconnected tools with one.",
    results: ["3x faster time-to-hire", "10,000+ applications processed", "87% AI match accuracy"],
    tags: ["React", "Node.js", "AI/ML", "PostgreSQL"],
    Mockup: HiringAppMockup,
  },
  {
    title: "Financial Analytics Dashboard",
    category: "Complex Web App",
    description: "Real-time financial dashboard pulling data from 12+ sources into one view. Automated weekly reports that used to take 6 hours to compile manually.",
    results: ["12 data sources unified", "Automated reporting (6hrs → 0)", "Real-time P&L visibility"],
    tags: ["Next.js", "Python", "AI Analytics", "REST APIs"],
    Mockup: FinanceDashMockup,
  },
];

export function CaseStudies() {
  return (
    <section id="work" className="relative py-28 sm:py-32 bg-bg-secondary">
      <div className="absolute inset-0 radial-glow-gold opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              Our Work
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Don&apos;t Take Our Word For It.{" "}
              <span className="gradient-text">See It.</span>
            </h2>
            <p className="text-text-secondary text-lg">
              Real software we&apos;ve built. Real problems solved. Real results.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6">
          {caseStudies.map((study, i) => (
            <ScrollReveal key={study.title} delay={i * 0.15}>
              <Link href="/work">
                <div className="glass-card overflow-hidden h-full group hover:border-accent/15 transition-all duration-300">
                  {/* App mockup */}
                  <div className="p-5 pb-0">
                    <study.Mockup />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-accent text-xs font-medium uppercase tracking-wider mb-1">{study.category}</p>
                        <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{study.title}</h3>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5">{study.description}</p>

                    {/* Results */}
                    <div className="space-y-2 mb-5">
                      {study.results.map((r) => (
                        <div key={r} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span className="text-text-secondary">{r}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {study.tags.map((t) => (
                        <span key={t} className="px-3 py-1 bg-bg-primary/60 rounded-full text-xs text-text-muted border border-border">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12">
            <Link href="/work" className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );
}
