"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Check, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Smart Hiring Platform",
    category: "Web Application",
    description: "AI-powered recruitment platform with Kanban pipeline, automated screening, and candidate matching. Replaced 4 disconnected tools.",
    fullDescription: "A fast-growing staffing company was managing candidates across spreadsheets, email, and 3 different tools. We built a unified platform with an AI matching engine that scores candidates against job requirements automatically. The Kanban board lets recruiters drag candidates through stages, while automated emails keep applicants in the loop without manual effort.",
    challenge: "The client was losing candidates because their process took 3 weeks. Top talent was getting hired elsewhere before they could even schedule interviews.",
    solution: "We built a real-time Kanban pipeline with AI-powered candidate scoring, automated screening questions, and one-click interview scheduling. The AI analyzes resumes and ranks candidates by match percentage.",
    results: ["3x faster time-to-hire", "10,000+ applications processed", "87% AI match accuracy", "4 tools replaced with 1"],
    tags: ["React", "Node.js", "AI/ML", "PostgreSQL", "OpenAI"],
    color: "from-accent-secondary/20 to-pink-500/20",
    timeline: "6 weeks",
  },
  {
    title: "Financial Analytics Dashboard",
    category: "Complex Web App",
    description: "Real-time financial dashboard pulling from 12+ data sources. Automated reports that used to take 6 hours manually.",
    fullDescription: "A mid-size services company was spending every Monday morning compiling financial data from QuickBooks, Stripe, their CRM, and spreadsheets into a weekly report. By the time the report was done, the data was already outdated. We built a dashboard that pulls from all 12 sources in real-time and generates the report automatically.",
    challenge: "The CFO was spending 6+ hours every week manually compiling data from 12 different systems into spreadsheets. Reports were always outdated by the time they were finished.",
    solution: "We built API integrations to all 12 data sources with real-time syncing, a visual dashboard with drill-down capabilities, and automated PDF reports sent every Monday at 7am.",
    results: ["12 data sources unified", "6hrs → 0 report time", "Real-time P&L visibility", "Automated weekly PDF reports"],
    tags: ["Next.js", "Python", "AI Analytics", "REST APIs", "Stripe"],
    color: "from-accent/20 to-accent-secondary/20",
    timeline: "8 weeks",
  },
  {
    title: "Restaurant Ordering System",
    category: "Web + Mobile App",
    description: "Custom online ordering platform with real-time kitchen display, driver tracking, and Telegram notifications.",
    fullDescription: "A family-owned restaurant with 2 locations was paying $3,200/month to DoorDash and UberEats in commissions. We built their own branded ordering platform — customers order directly, the kitchen gets real-time notifications on a display screen, and drivers are tracked on a map. The owner gets a Telegram ping for every new order.",
    challenge: "Delivery apps were taking 25-30% of every order. The restaurant was essentially working for free on delivery orders after food costs.",
    solution: "Custom ordering website and mobile app with zero commission fees, real-time kitchen display system, driver GPS tracking, and Telegram bot for instant order alerts to the owner.",
    results: ["$2,400/mo saved vs DoorDash", "200% increase in direct orders", "45-second average order processing", "Owner gets Telegram alerts instantly"],
    tags: ["React Native", "Next.js", "Stripe", "Telegram Bot", "Maps API"],
    color: "from-orange-500/20 to-accent/20",
    timeline: "5 weeks",
  },
  {
    title: "Field Service Management App",
    category: "Mobile App",
    description: "Job scheduling, real-time dispatch, GPS tracking, and one-tap invoicing for a plumbing company.",
    fullDescription: "A plumbing company with 15 technicians was scheduling jobs on a whiteboard and invoicing from paper forms in the truck. Techs would forget jobs, double-book, and invoices would take 2 weeks to get sent. We built a mobile app that lets the office dispatch in real-time and techs invoice on the spot.",
    challenge: "The owner was losing 5+ hours/day on scheduling phone calls and the team was sending invoices 1-2 weeks late, causing cash flow problems.",
    solution: "Mobile app with drag-and-drop scheduling, GPS tracking for all 15 trucks, one-tap invoicing with photo documentation, and automated SMS appointment reminders to customers.",
    results: ["30% more jobs per week", "10hrs/week saved on admin", "Same-day invoicing (was 2 weeks)", "Zero missed appointments"],
    tags: ["React Native", "Node.js", "Maps API", "Stripe", "SMS"],
    color: "from-blue-500/20 to-accent-secondary/20",
    timeline: "7 weeks",
  },
  {
    title: "AI Customer Service Bot",
    category: "AI & Automation",
    description: "WhatsApp and website chatbot handling 80% of customer inquiries automatically.",
    fullDescription: "A home services company was getting 200+ customer inquiries per week — most of them the same 20 questions. Their support person was overwhelmed and response times were 4+ hours. We built an AI bot trained on their specific services, pricing, and policies that handles inquiries on WhatsApp and their website simultaneously.",
    challenge: "200+ weekly inquiries with 4+ hour response time. One support person couldn't keep up, and slow responses were losing potential customers.",
    solution: "AI chatbot trained on company-specific FAQs, pricing, and service areas. Deployed on WhatsApp Business and website widget. Complex issues auto-escalate to human with full context.",
    results: ["80% auto-resolution rate", "24/7 customer support", "90% customer satisfaction", "Response time: instant (was 4hrs)"],
    tags: ["Claude API", "WhatsApp Business", "Node.js", "NLP"],
    color: "from-accent/20 to-accent/20",
    timeline: "3 weeks",
  },
  {
    title: "Inventory Management Platform",
    category: "Web Application",
    description: "Multi-location inventory tracking with demand forecasting and automated reordering.",
    fullDescription: "A retail business with 3 locations was tracking inventory in spreadsheets. They'd regularly run out of top-selling items and over-order slow movers. We built a platform that tracks inventory across all locations in real-time, uses AI to predict demand, and auto-generates purchase orders when stock gets low.",
    challenge: "Frequent stockouts on popular items (lost sales) and excess inventory on slow movers (wasted capital). No visibility across 3 locations.",
    solution: "Centralized inventory platform with barcode scanning, real-time stock levels across locations, AI-powered demand forecasting, and automated purchase order generation when stock drops below threshold.",
    results: ["35% reduction in stockouts", "Auto-reorder triggers saved 8hrs/week", "3 locations unified in one view", "20% reduction in excess inventory"],
    tags: ["Next.js", "Python", "AI Forecasting", "PostgreSQL", "Barcode API"],
    color: "from-accent/20 to-blue-500/20",
    timeline: "6 weeks",
  },
];

export default function WorkPage() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Our Work</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Built. Shipped. <span className="gradient-text">Proven.</span>
            </h1>
            <p className="text-text-secondary text-lg">Click any project to see the full story — the problem, our solution, and the results.</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <button
                onClick={() => setSelectedProject(p)}
                className="glass-card overflow-hidden h-full group hover:border-accent/15 transition-all duration-300 text-left w-full"
              >
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
                    {p.results.slice(0, 3).map((r) => (
                      <div key={r} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
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
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedProject(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative glass-card max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            >
              {/* Color bar */}
              <div className={`h-2 rounded-t-2xl bg-gradient-to-r ${selectedProject.color}`} />

              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 sm:p-10">
                {/* Header */}
                <p className="text-accent text-xs font-medium uppercase tracking-wider mb-1">{selectedProject.category}</p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{selectedProject.title}</h2>
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="text-text-muted text-sm">Built in {selectedProject.timeline}</span>
                  <span className="text-text-muted text-sm">|</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-bg-primary/60 rounded-full text-[11px] text-text-muted border border-border">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-8">
                  <div>
                    <p className="text-text-secondary leading-relaxed">{selectedProject.fullDescription}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-red-400/5 border border-red-400/10 rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">The Challenge</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{selectedProject.challenge}</p>
                    </div>
                    <div className="bg-accent/5 border border-accent/10 rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Our Solution</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{selectedProject.solution}</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Results</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {selectedProject.results.map((r) => (
                        <div key={r} className="flex items-center gap-3 bg-accent/5 border border-accent/10 rounded-lg p-3">
                          <Check className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-text-secondary text-sm">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-6 border-t border-border flex flex-wrap gap-4">
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-semibold rounded-xl glow-green hover:bg-accent-hover transition-all text-sm"
                    >
                      Want Something Like This? <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href="/pricing"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-glass border border-glass-border rounded-xl text-text-secondary hover:text-text-primary transition-all text-sm font-medium"
                    >
                      See Pricing
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
