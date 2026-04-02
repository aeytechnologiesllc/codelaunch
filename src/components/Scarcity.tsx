"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Calendar } from "lucide-react";
import Link from "next/link";

export function Scarcity() {
  // You can make this dynamic later (pull from Supabase)
  const spotsLeft = 2;
  const nextAvailable = "May 2026";

  return (
    <section className="relative py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-accent/10 bg-accent/[0.02]">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{spotsLeft}</div>
                <div className="text-text-muted text-xs">spots left</div>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-sm mb-1">
                We take on {spotsLeft + 1} new projects per month.
              </h3>
              <p className="text-text-muted text-xs leading-relaxed">
                Small team, focused attention. We limit projects so every client gets our full effort, not a fraction of it.
                {spotsLeft <= 1 && " Next available slot: " + nextAvailable + "."}
              </p>
            </div>

            <Link
              href="/pricing"
              className="px-5 py-2.5 bg-cta text-cta-text font-semibold text-sm rounded-xl glow-accent hover:bg-cta-hover transition-all whitespace-nowrap flex-shrink-0"
            >
              Check Availability
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
