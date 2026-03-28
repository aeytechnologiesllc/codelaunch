"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Ban, Clock, DollarSign } from "lucide-react";

const problems = [
  {
    icon: DollarSign,
    headline: "You&apos;re bleeding money",
    detail: "Delivery apps take 30%. Scheduling mistakes cost jobs. Generic tools charge monthly for features you never use. Your software should make you money, not drain it.",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
  {
    icon: Clock,
    headline: "You&apos;re wasting time",
    detail: "Copy-pasting between 10 different apps. Manually sending invoices. Answering the same customer questions at 11pm. There&apos;s a better way.",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    icon: Ban,
    headline: "Generic tools don&apos;t fit",
    detail: "You bought software built for everyone, which means it was built for no one. Your business has specific needs. Your software should too.",
    color: "text-accent-secondary",
    bgColor: "bg-purple-dim",
  },
];

export function ProblemStatement() {
  return (
    <section className="relative py-28 sm:py-32">
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
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="glass-card p-8 h-full hover:bg-white/[0.06] transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl ${p.bgColor} flex items-center justify-center mb-6`}>
                  <p.icon className={`w-6 h-6 ${p.color}`} />
                </div>
                <h3
                  className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors"
                  dangerouslySetInnerHTML={{ __html: p.headline }}
                />
                <p
                  className="text-text-secondary text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: p.detail }}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
