"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Play, Monitor } from "lucide-react";

export function VideoProof() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-8">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              See It In Action
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Watch Us Build Real Software
            </h2>
            <p className="text-text-secondary text-sm">
              No talking heads. Just screen recordings of actual apps we&apos;ve built for real businesses.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {/* Video placeholder — replace src with real Loom/YouTube embed */}
          <div className="glass-card overflow-hidden">
            <div className="relative aspect-video bg-bg-elevated flex items-center justify-center group cursor-pointer">
              {/* Placeholder content — replace with <iframe> when you have a real video */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-colors">
                  <Play className="w-7 h-7 text-accent ml-1" />
                </div>
                <div>
                  <div className="text-sm font-semibold">2-Minute Walkthrough</div>
                  <div className="text-text-muted text-xs mt-1">Custom ordering platform built for a local restaurant</div>
                </div>
              </div>

              {/* Decorative elements to make it look like a real thumbnail */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-text-muted" />
                <span className="text-[10px] text-text-muted">Screen Recording</span>
              </div>
              <div className="absolute bottom-4 right-4 px-2 py-1 bg-bg-primary/80 rounded text-[10px] text-text-muted">
                2:14
              </div>
            </div>
          </div>

          <p className="text-text-muted text-xs text-center mt-4">
            All recordings show real client projects with permission. No mockups, no simulations.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
