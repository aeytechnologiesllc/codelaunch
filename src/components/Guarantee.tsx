"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Shield, Sparkles, Eye, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    icon: Sparkles,
    title: "Free design phase",
    body: "We deliver full wireframes and visual concepts at no cost. Unlimited revisions until you're genuinely excited.",
  },
  {
    icon: Eye,
    title: "See exactly what you're getting",
    body: "No vague promises. You approve the real designs before a single line of code is written — or a single dollar is charged.",
  },
  {
    icon: XCircle,
    title: "Don't love it? Walk away",
    body: "If the design doesn't feel right, you keep your money and we part as friends. Zero pressure, zero fees.",
  },
];

export function Guarantee() {
  return (
    <section
      id="guarantee"
      className="relative py-20 sm:py-28 section-ambient-warm overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-warm/10 border border-accent-warm/20 text-accent-warm text-xs font-semibold mb-4">
              <Shield className="w-3.5 h-3.5" />
              100% Risk-Free Guarantee
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              You Don&apos;t Pay a Cent Until You{" "}
              <span className="gradient-text-warm">Love the Design</span>
            </h2>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              Hiring a software team is a big decision. We make it easy to say yes —
              we design your project first, for free. You only pay if you approve what you see.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <div className="glass-card p-6 h-full hover:border-accent-warm/20 transition-all duration-300 group relative overflow-hidden">
                {/* Warm ambient glow behind the icon */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-warm/[0.05] rounded-full blur-3xl pointer-events-none group-hover:bg-accent-warm/[0.08] transition-colors" />
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-accent-warm/10 border border-accent-warm/20 flex items-center justify-center mb-4">
                    <p.icon className="w-5 h-5 text-accent-warm" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{p.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.25}>
          <div className="glass-card p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 card-premium">
            <div className="flex-1 text-center sm:text-left relative z-10">
              <h3 className="text-lg font-semibold mb-1.5">
                The only thing you risk is an hour of your time.
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Start with a free discovery call. We&apos;ll scope your project, design concepts, and share a
                transparent fixed price. You decide if it&apos;s worth it — not us.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-cta-text font-semibold rounded-xl glow-warm hover:bg-cta-hover transition-all text-sm whitespace-nowrap flex-shrink-0 group"
            >
              Start Risk-Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
