"use client";

import { ScrollReveal } from "./ScrollReveal";
import Link from "next/link";
import { ArrowUpRight, Smartphone, Monitor, Bot, Plug } from "lucide-react";

const projects = [
  {
    title: "Restaurant Ordering Platform",
    type: "Mobile + Web App",
    icon: Smartphone,
    description: "Direct ordering system that eliminated 30% delivery app commissions",
    metric: "$2K+/mo saved",
    tech: ["React Native", "Supabase", "Stripe"],
    gradientFrom: "#7c3aed",
    gradientTo: "#a78bfa",
  },
  {
    title: "Business Analytics Dashboard",
    type: "Web Application",
    icon: Monitor,
    description: "Real-time financial dashboard pulling from 12+ data sources",
    metric: "6hrs \u2192 0 reporting",
    tech: ["Next.js", "Python", "PostgreSQL"],
    gradientFrom: "#3b82f6",
    gradientTo: "#818cf8",
  },
  {
    title: "Contractor Dispatch System",
    type: "Mobile + Web App",
    icon: Smartphone,
    description: "Field service management with GPS tracking and instant invoicing",
    metric: "30% more jobs/week",
    tech: ["React Native", "Node.js", "Maps API"],
    gradientFrom: "#059669",
    gradientTo: "#34d399",
  },
  {
    title: "AI Customer Assistant",
    type: "AI Chatbot",
    icon: Bot,
    description: "24/7 AI chatbot handling 80% of customer inquiries automatically",
    metric: "80% auto-resolved",
    tech: ["OpenAI", "Next.js", "Supabase"],
    gradientFrom: "#a78bfa",
    gradientTo: "#c4b5fd",
  },
  {
    title: "Multi-Platform Integration",
    type: "API & Bots",
    icon: Plug,
    description: "Connected Stripe, POS, WhatsApp, and Telegram with real-time alerts",
    metric: "Zero manual entry",
    tech: ["Node.js", "Telegram API", "Stripe"],
    gradientFrom: "#f59e0b",
    gradientTo: "#fbbf24",
  },
];

export function VideoProof() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              What We&apos;ve Built
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Real Results. <span className="gradient-text">Real Impact.</span>
            </h2>
            <p className="text-text-secondary text-sm max-w-lg mx-auto">
              Every project built to solve a specific business problem — and deliver measurable results.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.08} animation="fadeUp">
              <Link href="/work">
                <div className="glass-card h-full group hover:bg-white/[0.04] transition-all duration-500 hover:shadow-[0_0_30px_rgba(167,139,250,0.08)] hover:border-accent/15 overflow-hidden">
                  {/* Gradient accent bar */}
                  <div
                    className="h-1 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${project.gradientFrom}, ${project.gradientTo})`,
                    }}
                  />

                  <div className="p-6">
                    {/* Type + icon row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <project.icon
                          className="w-4 h-4"
                          style={{ color: project.gradientTo }}
                          strokeWidth={1.8}
                        />
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: project.gradientTo }}
                        >
                          {project.type}
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Metric badge */}
                    <div
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold mb-4"
                      style={{
                        background: `${project.gradientFrom}15`,
                        color: project.gradientTo,
                        border: `1px solid ${project.gradientFrom}25`,
                      }}
                    >
                      {project.metric}
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/50">
                      {project.tech.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-bg-primary/60 rounded text-[10px] text-text-muted border border-border/50">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
