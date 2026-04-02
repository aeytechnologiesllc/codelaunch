"use client";

import { ScrollReveal } from "./ScrollReveal";
import { MessageSquare, Palette, Code2, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Intake",
    description: "You send your requirements once. We review them, ask clear portal-based follow-up questions, and keep the scope organized from day one.",
    duration: "Same day start",
  },
  {
    number: "02",
    icon: Palette,
    title: "Design",
    description: "We design the screens, share them in the portal, and collect feedback there so approvals stay crystal clear.",
    duration: "1-2 weeks",
  },
  {
    number: "03",
    icon: Code2,
    title: "Build",
    description: "You see progress through portal updates, milestone check-ins, and deliverables tied to the real project workspace.",
    duration: "4-8 weeks",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch",
    description: "We deploy, monitor, and optimize. Then we stick around because your success is our reputation.",
    duration: "Ongoing",
  },
];

export function Process() {
  return (
    <section id="process" className="relative py-28 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Idea to Launch.{" "}
              <span className="gradient-text">Zero Guesswork.</span>
            </h2>
            <p className="text-text-secondary text-lg">
              You&apos;re in the loop every step. No black box development.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.1}>
              <div className="relative glass-card p-8 h-full group hover:bg-white/[0.06] transition-all duration-300">
                <div className="text-5xl font-bold text-white/[0.03] absolute top-4 right-6 select-none">{step.number}</div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-accent transition-colors">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{step.description}</p>
                  <span className="inline-block px-3 py-1 bg-accent/10 rounded-full text-xs text-accent font-medium">{step.duration}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
