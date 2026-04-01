"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Ban, Clock, DollarSign } from "lucide-react";

const problems = [
  {
    icon: DollarSign,
    headline: "You\u2019re bleeding money",
    detail: "Delivery apps take 30%. Scheduling mistakes cost jobs. Generic tools charge monthly for features you never use. Your software should make you money, not drain it.",
    color: "text-red-400",
    ringColor: "border-red-400/30",
    glowFrom: "from-red-500/20",
    glowTo: "to-red-400/5",
    shadowColor: "shadow-red-500/20",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(248,113,113,0.15)]",
    iconGlow: "rgba(248, 113, 113, 0.4)",
  },
  {
    icon: Clock,
    headline: "You\u2019re wasting time",
    detail: "Copy-pasting between 10 different apps. Manually sending invoices. Answering the same customer questions at 11pm. There\u2019s a better way.",
    color: "text-amber-400",
    ringColor: "border-amber-400/30",
    glowFrom: "from-amber-500/20",
    glowTo: "to-amber-400/5",
    shadowColor: "shadow-amber-500/20",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(251,191,36,0.15)]",
    iconGlow: "rgba(251, 191, 36, 0.4)",
  },
  {
    icon: Ban,
    headline: "Generic tools don\u2019t fit",
    detail: "You bought software built for everyone, which means it was built for no one. Your business has specific needs. Your software should too.",
    color: "text-accent",
    ringColor: "border-accent/30",
    glowFrom: "from-accent/20",
    glowTo: "to-accent/5",
    shadowColor: "shadow-accent/20",
    hoverShadow: "group-hover:shadow-[0_0_40px_rgba(167,139,250,0.15)]",
    iconGlow: "rgba(167, 139, 250, 0.4)",
  },
];

export function ProblemStatement() {
  return (
    <section className="relative py-28 sm:py-32 section-fade-top">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              The Problem
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Most Small Businesses Are{" "}
              <span className="gradient-text">Held Back</span> by Their Software
            </h2>
            <p className="text-text-secondary text-lg">
              Sound familiar? You&apos;re not alone — and it doesn&apos;t have to be this way.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <ScrollReveal key={i} delay={i * 0.12} animation="slideLeft">
              <div className={`glass-card p-8 h-full hover:bg-white/[0.06] transition-all duration-500 group ${p.hoverShadow}`}>
                {/* Premium icon with glow ring */}
                <div className="relative w-16 h-16 mb-8">
                  {/* Outer glow */}
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${p.iconGlow} 0%, transparent 70%)` }}
                  />
                  {/* Icon container */}
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${p.glowFrom} ${p.glowTo} border ${p.ringColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                    <p.icon className={`w-7 h-7 ${p.color}`} strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                  {p.headline}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {p.detail}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
