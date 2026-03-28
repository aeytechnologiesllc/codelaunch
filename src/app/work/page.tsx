"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Smart Hiring Platform",
    category: "Web Application",
    description: "AI-powered recruitment platform with Kanban pipeline, automated screening, and candidate matching. Replaced 4 disconnected tools.",
    results: ["3x faster time-to-hire", "10K+ applications processed", "87% AI match accuracy"],
    tags: ["React", "Node.js", "AI/ML", "PostgreSQL"],
    color: "from-accent-secondary/20 to-pink-500/20",
  },
  {
    title: "Financial Analytics Dashboard",
    category: "Complex Web App",
    description: "Real-time financial dashboard pulling from 12+ data sources. Automated reports that used to take 6 hours manually.",
    results: ["12 data sources unified", "6hrs → 0 report time", "Real-time P&L visibility"],
    tags: ["Next.js", "Python", "AI Analytics", "REST APIs"],
    color: "from-accent/20 to-accent-secondary/20",
  },
  {
    title: "Restaurant Ordering System",
    category: "Web + Mobile App",
    description: "Custom online ordering platform with real-time kitchen display, driver tracking, and Telegram notifications for new orders.",
    results: ["$2,400/mo saved vs DoorDash", "200% increase in direct orders", "45s avg order processing"],
    tags: ["React Native", "Next.js", "Stripe", "Telegram Bot"],
    color: "from-orange-500/20 to-accent/20",
  },
  {
    title: "Field Service Management App",
    category: "Mobile App",
    description: "Job scheduling, real-time dispatch, GPS tracking, and one-tap invoicing for a plumbing company with 15 technicians.",
    results: ["30% more jobs per week", "10hrs/week saved on admin", "Same-day invoicing"],
    tags: ["React Native", "Node.js", "Maps API", "Stripe"],
    color: "from-blue-500/20 to-accent-secondary/20",
  },
  {
    title: "AI Customer Service Bot",
    category: "AI & Automation",
    description: "WhatsApp and website chatbot handling 80% of customer inquiries automatically. Escalates complex issues to humans.",
    results: ["80% auto-resolution rate", "24/7 customer support", "90% satisfaction score"],
    tags: ["Claude API", "WhatsApp Business", "Node.js", "NLP"],
    color: "from-green-500/20 to-accent/20",
  },
  {
    title: "Inventory Management Platform",
    category: "Web Application",
    description: "Multi-location inventory tracking with demand forecasting, automated reordering, and supplier management portal.",
    results: ["35% reduction in stockouts", "Auto-reorder triggers", "3 locations unified"],
    tags: ["Next.js", "Python", "AI Forecasting", "PostgreSQL"],
    color: "from-accent/20 to-blue-500/20",
  },
];

export default function WorkPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Our Work</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Built. Shipped. <span className="gradient-text">Proven.</span>
            </h1>
            <p className="text-text-secondary text-lg">Real projects with real results. Every one of these solved a specific business problem.</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <div className="glass-card overflow-hidden h-full group hover:border-accent/15 transition-all duration-300">
                {/* Color header */}
                <div className={`h-2 bg-gradient-to-r ${p.color}`} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-accent text-xs font-medium uppercase tracking-wider mb-1">{p.category}</p>
                      <h3 className="text-lg font-bold group-hover:text-accent transition-colors">{p.title}</h3>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed mb-5">{p.description}</p>

                  <div className="space-y-2 mb-5">
                    {p.results.map((r) => (
                      <div key={r} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="text-text-secondary">{r}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-bg-primary/60 rounded-full text-[11px] text-text-muted border border-border">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
