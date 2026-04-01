"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Calculator, Eye, Shield, Zap, Clock, Code2 } from "lucide-react";

const differentiators = [
  {
    icon: Calculator,
    title: "Transparent Pricing",
    them: "Other agencies: \"Let's hop on a call to discuss pricing.\" Translation: we make it up based on how much we think you'll pay.",
    us: "Us: Interactive pricing calculator. Pick features, see the price change live. No call needed to know what it costs.",
  },
  {
    icon: Eye,
    title: "You See Everything",
    them: "Other agencies: disappear for 8 weeks, show up with something you didn't ask for.",
    us: "Us: Client dashboard with real-time progress tracking, weekly demos, and milestone updates. Like tracking a package \u2014 but it's your software.",
  },
  {
    icon: Shield,
    title: "You Own Everything",
    them: "Other agencies: lock you into their hosting, their platform, their monthly fees. Leave? Start over.",
    us: "Us: You own the code, the design, the database. Full handover. Zero lock-in. Leave anytime (but you won't want to).",
  },
  {
    icon: Zap,
    title: "AI Built In, Not Bolted On",
    them: "Other agencies: build a standard app, then charge extra to \"add AI\" later.",
    us: "Us: AI is part of the architecture from day one. Chatbots, automation, smart scheduling \u2014 baked in, not an afterthought.",
  },
  {
    icon: Clock,
    title: "Weeks, Not Months",
    them: "Other agencies: 3-6 month timelines, scope creep, endless revisions.",
    us: "Us: 4-8 weeks for most projects. Agile sprints. Weekly demos. You see progress every 7 days.",
  },
  {
    icon: Code2,
    title: "Built for YOUR Business",
    them: "Other agencies: WordPress template with your logo slapped on. Same site, different colors.",
    us: "Us: Every line of code is written for your specific workflow. Your ordering system, your scheduling logic, your business rules.",
  },
];

export function WhyUs() {
  return (
    <section className="relative py-24 sm:py-28 bg-bg-secondary">
      <div className="absolute inset-0 radial-glow opacity-30" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
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
              Here&apos;s what we do differently.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {differentiators.map((d, i) => (
            <ScrollReveal key={d.title} delay={i * 0.08} animation="scaleIn">
              <div className="glass-card p-6 h-full group hover:bg-white/[0.04] transition-all duration-500 animated-border hover:shadow-[0_0_25px_rgba(167,139,250,0.06)]">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(167,139,250,0.15)] transition-all duration-300">
                  <d.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-sm mb-3 group-hover:text-accent transition-colors">{d.title}</h3>
                <div className="space-y-2">
                  <p className="text-text-muted text-xs leading-relaxed line-through decoration-text-muted/30">
                    {d.them}
                  </p>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {d.us}
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
