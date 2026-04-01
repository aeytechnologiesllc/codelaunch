"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Calculator, Eye, Shield, Zap, Clock, Code2, X, Check } from "lucide-react";

const differentiators = [
  {
    icon: Calculator,
    title: "Transparent Pricing",
    them: "\"Let's hop on a call to discuss pricing.\" Translation: we make it up.",
    us: "Interactive pricing calculator. Pick features, see the price change live.",
    accentColor: "#a78bfa",
  },
  {
    icon: Eye,
    title: "You See Everything",
    them: "Disappear for 8 weeks, show up with something you didn't ask for.",
    us: "Client dashboard with real-time tracking, weekly demos, milestone updates.",
    accentColor: "#818cf8",
  },
  {
    icon: Shield,
    title: "You Own Everything",
    them: "Lock you into their hosting, their platform, their monthly fees.",
    us: "You own the code, the design, the database. Full handover. Zero lock-in.",
    accentColor: "#a78bfa",
  },
  {
    icon: Zap,
    title: "AI Built In, Not Bolted On",
    them: "Build a standard app, then charge extra to \"add AI\" later.",
    us: "AI is part of the architecture from day one. Baked in, not an afterthought.",
    accentColor: "#c4b5fd",
  },
  {
    icon: Clock,
    title: "Weeks, Not Months",
    them: "3-6 month timelines, scope creep, endless revisions.",
    us: "4-8 weeks. Agile sprints. Weekly demos. Progress every 7 days.",
    accentColor: "#818cf8",
  },
  {
    icon: Code2,
    title: "Built for YOUR Business",
    them: "WordPress template with your logo slapped on. Same site, different colors.",
    us: "Every line of code written for your specific workflow and business rules.",
    accentColor: "#a78bfa",
  },
];

export function WhyUs() {
  return (
    <section className="relative py-24 sm:py-28 bg-bg-secondary">
      <div className="absolute inset-0 radial-glow opacity-30" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
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

        {/* Comparison rows */}
        <div className="space-y-3">
          {differentiators.map((d, i) => (
            <ScrollReveal key={d.title} delay={i * 0.06} animation={i % 2 === 0 ? "slideLeft" : "slideRight"}>
              <div className="glass-card group hover:bg-white/[0.04] transition-all duration-500 hover:shadow-[0_0_30px_rgba(167,139,250,0.06)]">
                <div className="grid md:grid-cols-[auto_1fr_auto_1fr] items-center gap-4 md:gap-0 p-5 sm:p-6">
                  {/* Icon */}
                  <div className="flex items-center gap-3 md:pr-6">
                    <div className="relative">
                      <div
                        className="absolute -inset-2 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity"
                        style={{ background: d.accentColor }}
                      />
                      <div
                        className="relative w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          background: `${d.accentColor}15`,
                          borderColor: `${d.accentColor}25`,
                        }}
                      >
                        <d.icon className="w-5 h-5" style={{ color: d.accentColor }} strokeWidth={1.8} />
                      </div>
                    </div>
                    <span className="font-semibold text-sm md:hidden">{d.title}</span>
                  </div>

                  {/* "Them" — the old way */}
                  <div className="flex items-start gap-3 md:px-5 md:border-l border-border/50">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="hidden md:block text-[10px] uppercase tracking-wider text-text-muted mb-1 font-medium">Other agencies</span>
                      <p className="text-text-muted text-xs leading-relaxed">{d.them}</p>
                    </div>
                  </div>

                  {/* VS divider — desktop only */}
                  <div className="hidden md:flex items-center px-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-accent tracking-wider">VS</span>
                    </div>
                  </div>

                  {/* "Us" — the CodeLaunch way */}
                  <div className="flex items-start gap-3 md:px-5 md:border-l border-accent/10">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="hidden md:block text-[10px] uppercase tracking-wider text-accent mb-1 font-medium">{d.title}</span>
                      <p className="text-text-secondary text-xs leading-relaxed">{d.us}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
