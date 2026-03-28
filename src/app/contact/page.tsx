"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Contact</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Let&apos;s Talk About <span className="gradient-text">Your Project</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Free 30-minute strategy call. No sales pitch — just honest conversation about how we can help.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <ScrollReveal className="lg:col-span-3">
            <div className="glass-card p-8">
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
                    <input type="text" placeholder="Your name" className="w-full px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                    <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Business Type</label>
                  <select className="w-full px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm text-text-muted focus:outline-none focus:border-accent/50 transition-all">
                    <option>Restaurant / Food Service</option>
                    <option>Contractor / Trades</option>
                    <option>Healthcare / Clinic</option>
                    <option>Professional Services</option>
                    <option>E-commerce / Retail</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">What do you need?</label>
                  <select className="w-full px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm text-text-muted focus:outline-none focus:border-accent/50 transition-all">
                    <option>Website or Web App</option>
                    <option>Mobile App</option>
                    <option>AI / Automation</option>
                    <option>Integration / Bot</option>
                    <option>Not sure yet — help me figure it out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Tell us more</label>
                  <textarea rows={4} placeholder="What's the biggest problem in your business right now?" className="w-full px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-all resize-none" />
                </div>
                <button type="submit" className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-bg-primary font-semibold rounded-xl glow-green hover:bg-accent-hover transition-all">
                  Send Message <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal delay={0.2} className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Quick Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-text-secondary text-sm">
                  <Mail className="w-5 h-5 text-accent" /> hello@codelaunch.dev
                </li>
                <li className="flex items-center gap-3 text-text-secondary text-sm">
                  <Phone className="w-5 h-5 text-accent" /> +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-3 text-text-secondary text-sm">
                  <MapPin className="w-5 h-5 text-accent" /> Remote-first, worldwide
                </li>
                <li className="flex items-center gap-3 text-text-secondary text-sm">
                  <Clock className="w-5 h-5 text-accent" /> Response within 24 hours
                </li>
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3">What happens next?</h3>
              <ol className="space-y-3">
                {[
                  "We review your message (same day)",
                  "We schedule a free 30-min call",
                  "We discuss your problems & propose a solution",
                  "You decide if we're the right fit — zero pressure",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-secondary text-sm">
                    <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
