"use client";

import { ScrollReveal } from "./ScrollReveal";
import { UtensilsCrossed, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

const industries = [
  {
    icon: UtensilsCrossed,
    title: "For Restaurants & Food",
    tagline: "Keep your profits. Ditch the middleman.",
    description: "We build your own ordering platform so customers order directly from you — no 30% commission to DoorDash. Plus AI chatbots that handle reservations and FAQs at 2am.",
    features: [
      "Custom online ordering (zero commission fees)",
      "Smart table booking with auto-reminders",
      "AI chatbot for customer inquiries 24/7",
      "Real-time Telegram/WhatsApp order alerts",
      "Revenue analytics you actually understand",
    ],
    stat: "$2K+",
    statLabel: "saved per month vs delivery app fees",
    borderColor: "hover:border-orange-400/20",
    href: "/industries#restaurants",
  },
  {
    icon: Wrench,
    title: "For Contractors & Trades",
    tagline: "Your office. In your pocket.",
    description: "Stop running your crew on paper and phone calls. We build you a dispatch and invoicing system that works as hard as you do — schedule, track, invoice, get paid.",
    features: [
      "Drag-and-drop job scheduling",
      "Instant invoicing from the field",
      "Real-time GPS crew tracking",
      "Customer portal for approvals & payments",
      "Automated appointment reminders via SMS",
    ],
    stat: "10+ hrs",
    statLabel: "saved per week on admin work",
    borderColor: "hover:border-accent-secondary/20",
    href: "/industries#contractors",
  },
];

export function Industries() {
  return (
    <section id="industries" className="relative py-28 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              Who We Build For
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              We Speak{" "}
              <span className="gradient-text">Your Language</span>
            </h2>
            <p className="text-text-secondary text-lg">
              Not tech jargon. Your language. We know your industry, your pain points, and exactly what software will move the needle.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6">
          {industries.map((ind, i) => (
            <ScrollReveal key={ind.title} delay={i * 0.15}>
              <div className={`glass-card p-8 lg:p-10 h-full group transition-all duration-300 ${ind.borderColor}`}>
                <div className="flex items-center gap-3 mb-2">
                  <ind.icon className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-accent">{ind.tagline}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold mb-4">{ind.title}</h3>
                <p className="text-text-secondary leading-relaxed mb-8">{ind.description}</p>

                <ul className="space-y-3 mb-8">
                  {ind.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-gradient-to-r from-accent/10 to-accent-secondary/10 rounded-xl p-5 mb-8">
                  <div className="text-2xl font-bold gradient-text-gold">{ind.stat}</div>
                  <div className="text-text-muted text-sm">{ind.statLabel}</div>
                </div>

                <Link href={ind.href} className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                  See how it works <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
