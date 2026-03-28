"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 radial-glow" />
      <div className="absolute top-1/4 -left-32 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-accent-secondary/8 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-accent/6 rounded-full blur-[120px] animate-float" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Software Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight"
            >
              We Don&apos;t Build
              <br />
              Websites. We Build
              <br />
              <span className="gradient-text">Revenue Machines.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-text-secondary max-w-xl leading-relaxed"
            >
              Your competitors are using cookie-cutter templates. We build custom software
              with AI baked in — apps that book clients, process orders, and grow your
              business while you sleep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-bg-primary font-semibold rounded-xl glow-green hover:bg-accent-hover transition-all text-base"
              >
                Book a Free Strategy Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-glass border border-glass-border rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/8 transition-all text-base font-medium"
              >
                See Our Work
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-8 border-t border-border grid grid-cols-3 gap-8"
            >
              {[
                { value: "50+", label: "Projects Delivered" },
                { value: "98%", label: "Client Satisfaction" },
                { value: "3x", label: "Avg. ROI for Clients" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-bold gradient-text-green">{stat.value}</div>
                  <div className="text-text-muted text-xs sm:text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Rich App Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative animate-float">
              {/* Main dashboard mockup */}
              <div className="glass-card p-3 rounded-2xl shadow-2xl shadow-accent-secondary/5">
                <div className="bg-bg-elevated rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-bg-primary/60 rounded-md px-3 py-1 text-xs text-text-muted text-center">
                        dashboard.yourcompany.com
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-4 min-h-[300px]">
                    {/* Dashboard header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-text-muted">Good morning, Owner</div>
                        <div className="text-sm font-semibold mt-0.5">Business Dashboard</div>
                      </div>
                      <div className="px-3 py-1.5 bg-accent/15 rounded-lg text-xs text-accent font-medium">
                        Live
                      </div>
                    </div>
                    {/* Stat cards */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { label: "Revenue", value: "$48.2K", change: "+18%", up: true },
                        { label: "Orders", value: "1,284", change: "+24%", up: true },
                        { label: "Customers", value: "847", change: "+12%", up: true },
                      ].map((s) => (
                        <div key={s.label} className="bg-bg-primary/60 rounded-lg p-3">
                          <div className="text-[10px] text-text-muted">{s.label}</div>
                          <div className="text-sm font-bold mt-1">{s.value}</div>
                          <div className="text-[10px] text-green-400 mt-0.5">{s.change}</div>
                        </div>
                      ))}
                    </div>
                    {/* Chart */}
                    <div className="bg-bg-primary/60 rounded-lg p-4">
                      <div className="text-[10px] text-text-muted mb-3">Weekly Revenue</div>
                      <div className="h-24 flex items-end gap-1.5">
                        {[35, 50, 40, 65, 55, 80, 70, 90, 60, 95, 85, 100].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${h}%`, background: `linear-gradient(to top, rgba(139,92,246,0.4), rgba(212,160,23,0.4))` }} />
                        ))}
                      </div>
                    </div>
                    {/* Recent activity */}
                    <div className="space-y-2">
                      {[
                        { text: "New order #1284", time: "2 min ago", color: "bg-green-400" },
                        { text: "AI bot resolved inquiry", time: "8 min ago", color: "bg-accent-secondary" },
                        { text: "Invoice #892 paid", time: "15 min ago", color: "bg-accent" },
                      ].map((item) => (
                        <div key={item.text} className="flex items-center gap-2.5 px-3 py-2 bg-bg-primary/40 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-[11px] text-text-secondary flex-1">{item.text}</span>
                          <span className="text-[10px] text-text-muted">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <div className="absolute -bottom-6 -left-10 w-48 glass-card p-3 rounded-xl shadow-2xl shadow-accent/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-400/15 flex items-center justify-center">
                    <span className="text-green-400 text-xs font-bold">$</span>
                  </div>
                  <div>
                    <div className="text-[10px] text-text-muted">New Payment</div>
                    <div className="text-sm font-bold text-green-400">+$1,247.00</div>
                  </div>
                </div>
              </div>

              {/* Floating AI card */}
              <div className="absolute -top-4 -right-6 w-44 glass-card p-3 rounded-xl shadow-2xl shadow-accent-secondary/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-dim flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-secondary" />
                  </div>
                  <div>
                    <div className="text-[10px] text-text-muted">AI Assistant</div>
                    <div className="text-[11px] font-medium text-text-secondary">3 replies sent</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
