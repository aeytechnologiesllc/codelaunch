"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { ArrowRight, Download, Check, Loader2, BookOpen } from "lucide-react";

export function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // TODO: Wire to Supabase to save email + trigger email delivery
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="glass-card p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-10">
            {/* Left: Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                Free Guide
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                5 Signs Your Business Is Losing Money to Bad Software
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-2">
                Most business owners don&apos;t realize how much they&apos;re bleeding to delivery app fees,
                manual processes, and disconnected tools. This free guide shows you exactly where the leaks are
                and what to do about them.
              </p>
              <ul className="text-text-muted text-xs space-y-1.5 mb-6">
                <li className="flex items-center gap-2 justify-center lg:justify-start">
                  <Check className="w-3 h-3 text-accent" /> The hidden cost of delivery app commissions
                </li>
                <li className="flex items-center gap-2 justify-center lg:justify-start">
                  <Check className="w-3 h-3 text-accent" /> How manual scheduling costs you 10+ hours/week
                </li>
                <li className="flex items-center gap-2 justify-center lg:justify-start">
                  <Check className="w-3 h-3 text-accent" /> The ROI math on custom software vs. SaaS subscriptions
                </li>
                <li className="flex items-center gap-2 justify-center lg:justify-start">
                  <Check className="w-3 h-3 text-accent" /> Real case studies with actual dollar amounts saved
                </li>
              </ul>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-cta text-cta-text font-semibold rounded-xl glow-accent hover:bg-cta-hover transition-all text-sm whitespace-nowrap disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Get Free Guide
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Check your email!</div>
                    <div className="text-text-muted text-xs">The guide is on its way.</div>
                  </div>
                </div>
              )}

              <p className="text-text-muted text-[10px] mt-3 text-center lg:text-left">
                Free. No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Right: Visual */}
            <div className="w-48 sm:w-56 flex-shrink-0">
              <div className="glass-card p-4 rounded-xl relative">
                <div className="bg-bg-elevated rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-accent" />
                    <span className="text-[10px] font-semibold text-text-secondary">FREE GUIDE</span>
                  </div>
                  <div className="text-[9px] font-bold leading-tight">
                    5 Signs Your Business Is Losing Money to Bad Software
                  </div>
                  <div className="space-y-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-accent/10 flex items-center justify-center text-[7px] text-accent font-bold">{n}</div>
                        <div className="h-1.5 flex-1 bg-white/5 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[7px] text-text-muted text-center pt-2 border-t border-border">
                    by CodeLaunch · 12 pages
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
