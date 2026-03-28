"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { UtensilsCrossed, Wrench, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const industries = [
  {
    id: "restaurants",
    icon: UtensilsCrossed,
    title: "Software for Restaurants & Food Service",
    tagline: "Stop handing 30% of every order to delivery apps",
    problem: "DoorDash takes 15-30% per order. That's $2,000-5,000/month going to someone else. Your food, your customers, their profit.",
    solution: "We build your OWN ordering platform. Customers order directly from you — zero commission. Plus AI chatbots that handle reservations and FAQs while you cook.",
    features: [
      "Custom online ordering (your brand, zero fees)",
      "Table reservation system with auto-reminders",
      "AI chatbot for 24/7 customer support",
      "Kitchen display system (real-time orders)",
      "Telegram/WhatsApp instant order alerts",
      "Loyalty program & promotions",
      "Revenue dashboard & analytics",
      "Driver tracking for delivery",
    ],
    savings: "$2,000-5,000/mo",
    timeline: "4-6 weeks",
    startingAt: "$4,900",
  },
  {
    id: "contractors",
    icon: Wrench,
    title: "Software for Contractors & Trades",
    tagline: "Run your entire business from your phone",
    problem: "You're scheduling on whiteboards, invoicing from the truck, and losing jobs because you forgot to follow up. Your crew deserves better tools.",
    solution: "We build a custom dispatch and management system that fits YOUR workflow — not the other way around. Schedule, track, invoice, get paid. All from your phone.",
    features: [
      "Drag-and-drop job scheduling & dispatch",
      "One-tap invoicing from the field",
      "Real-time GPS crew tracking",
      "Customer portal (approvals & payments)",
      "Automated appointment reminders (SMS)",
      "Photo documentation per job",
      "Profit & loss per job tracking",
      "Inventory & parts management",
    ],
    savings: "10+ hrs/week",
    timeline: "4-8 weeks",
    startingAt: "$5,900",
  },
];

export default function IndustriesPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Industries</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              We Know <span className="gradient-text">Your Business</span>
            </h1>
            <p className="text-text-secondary text-lg">Not tech jargon. Your language, your problems, your solutions.</p>
          </div>
        </ScrollReveal>

        <div className="space-y-16">
          {industries.map((ind, i) => (
            <ScrollReveal key={ind.id}>
              <div id={ind.id} className="glass-card p-8 lg:p-12 scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <ind.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">{ind.title}</h2>
                    <p className="text-accent text-sm font-medium">{ind.tagline}</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                  <div>
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400 mb-2">The Problem</h3>
                      <p className="text-text-secondary leading-relaxed">{ind.problem}</p>
                    </div>
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-green-400 mb-2">Our Solution</h3>
                      <p className="text-text-secondary leading-relaxed">{ind.solution}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                        <div className="text-xl font-bold gradient-text-green">{ind.savings}</div>
                        <div className="text-text-muted text-xs mt-1">Estimated Savings</div>
                      </div>
                      <div className="bg-accent-secondary/5 rounded-xl p-4 border border-accent-secondary/10">
                        <div className="text-xl font-bold text-accent-secondary">{ind.timeline}</div>
                        <div className="text-text-muted text-xs mt-1">Build Time</div>
                      </div>
                      <div className="bg-green-400/5 rounded-xl p-4 border border-green-400/10">
                        <div className="text-xl font-bold text-green-400">{ind.startingAt}</div>
                        <div className="text-text-muted text-xs mt-1">Starting At</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">Everything included</h3>
                    <ul className="space-y-3 mb-8">
                      {ind.features.map((f) => (
                        <li key={f} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-text-secondary text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing" className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-semibold rounded-xl glow-green hover:bg-accent-hover transition-all text-sm">
                      Get Exact Pricing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
