"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Calculator, Eye, Shield, Zap, Clock, Code2 } from "lucide-react";

const differentiators = [
  {
    icon: Calculator,
    title: "Transparent Pricing",
    description: "Interactive pricing calculator. Pick features, see the price change live. No call needed to know what it costs.",
    contrast: "No more \"let's hop on a call to discuss pricing.\"",
  },
  {
    icon: Eye,
    title: "You See Everything",
    description: "Client dashboard with real-time progress tracking, weekly demos, and milestone updates.",
    contrast: "No more disappearing for 8 weeks.",
  },
  {
    icon: Shield,
    title: "You Own Everything",
    description: "You own the code, the design, the database. Full handover. Zero lock-in. Leave anytime.",
    contrast: "No more hostage situations with your own software.",
  },
  {
    icon: Zap,
    title: "AI Built In",
    description: "AI is part of the architecture from day one. Chatbots, automation, smart scheduling \u2014 baked in.",
    contrast: "No more paying extra to \"bolt on\" AI later.",
  },
  {
    icon: Clock,
    title: "Weeks, Not Months",
    description: "4-8 weeks for most projects. Agile sprints. Weekly demos. You see progress every 7 days.",
    contrast: "No more 6-month timelines and scope creep.",
  },
  {
    icon: Code2,
    title: "Built for You",
    description: "Every line of code is written for your specific workflow. Your ordering system, your business rules.",
    contrast: "No more templates with your logo slapped on.",
  },
];

export function WhyUs() {
  return (
    <section className="relative py-24 sm:py-28 bg-bg-secondary">
      <div className="absolute inset-0 radial-glow opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              Why CodeLaunch
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              What Makes Us <span className="gradient-text">Different</span>
            </h2>
            <p className="text-text-secondary text-base">
              We built CodeLaunch because we were tired of how agencies treat small businesses.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {differentiators.map((d, i) => (
            <ScrollReveal key={d.title} delay={i * 0.08} animation="fadeUp">
              <div className="glass-card p-7 h-full group hover:bg-white/[0.04] transition-all duration-500 hover:shadow-[0_0_30px_rgba(167,139,250,0.08)] hover:border-accent/15">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center mb-5 group-hover:bg-accent/20 group-hover:border-accent/30 transition-all duration-300">
                  <d.icon className="w-5 h-5 text-accent" strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-base mb-2 group-hover:text-accent transition-colors">
                  {d.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {d.description}
                </p>

                {/* Contrast line */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-text-muted text-xs leading-relaxed italic">
                    {d.contrast}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
