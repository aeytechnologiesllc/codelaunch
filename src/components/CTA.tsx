"use client";

import { ScrollReveal } from "./ScrollReveal";
import { ArrowRight, Zap, Calculator } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section id="contact" className="relative py-28 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 radial-glow-gold" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[150px]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Two Ways to Start
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Stop Settling for{" "}
            <span className="gradient-text">Generic?</span>
          </h2>

          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Not sure what you need? That&apos;s fine — most of our clients weren&apos;t either.
            Start with a free call or try our instant pricing tool.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Option 1: Talk to us */}
            <Link href="/contact">
              <div className="glass-card p-8 text-left group hover:border-accent/20 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                  Book a Free Call
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">
                  30 minutes. No sales pitch. We listen to your problem and tell you honestly if we can help.
                </p>
                <span className="inline-flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-3 transition-all">
                  Schedule Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Option 2: Pricing configurator */}
            <Link href="/pricing">
              <div className="glass-card p-8 text-left group hover:border-accent-secondary/20 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-purple-dim flex items-center justify-center mb-5 group-hover:bg-accent-secondary/20 transition-colors">
                  <Calculator className="w-6 h-6 text-accent-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent-secondary transition-colors">
                  Get Instant Pricing
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">
                  Pick your project type, choose features, and see real-time pricing. No call needed.
                </p>
                <span className="inline-flex items-center gap-2 text-accent-secondary font-semibold text-sm group-hover:gap-3 transition-all">
                  Try the Calculator <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
