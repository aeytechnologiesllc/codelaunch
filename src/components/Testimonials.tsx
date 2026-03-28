"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "We were paying $3,200/month to DoorDash and UberEats. CodeLaunch built our own ordering system and it paid for itself in the first month. Best business decision we've made.",
    name: "Maria Santos",
    title: "Owner, Bella Cucina Restaurant",
    initials: "MS",
  },
  {
    quote: "My guys were writing jobs on napkins. Now they schedule, invoice, and get paid from their phones. We added 30% more jobs per week without hiring anyone new.",
    name: "James Mitchell",
    title: "Owner, Mitchell Plumbing Co.",
    initials: "JM",
  },
  {
    quote: "The AI chatbot handles 80% of our customer inquiries at 2am, 6am, weekends — whenever. It's like having a team member who never sleeps and never complains.",
    name: "Sarah Chen",
    title: "Director of Ops, GreenLeaf Services",
    initials: "SC",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-28 sm:py-32 bg-bg-secondary">
      <div className="relative max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              What Clients Say
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              They Didn&apos;t Believe It Either.{" "}
              <span className="gradient-text">Until They Saw Results.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <div className="glass-card p-8 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <div className="relative flex-1 mb-6">
                  <Quote className="w-8 h-8 text-accent/10 absolute -top-1 -left-1" />
                  <p className="text-text-secondary text-sm leading-relaxed relative z-10 pl-2">{t.quote}</p>
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">{t.initials}</div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-text-muted text-xs">{t.title}</div>
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
