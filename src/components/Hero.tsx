"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Zap, Bot } from "lucide-react";
import Link from "next/link";

function MobileMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="lg:hidden mt-10"
    >
      {/* Compact phone-style mockup for mobile */}
      <div className="max-w-sm mx-auto glass-card p-3 rounded-2xl">
        <div className="bg-bg-elevated rounded-xl overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="text-[10px] font-semibold text-text-secondary">Business Dashboard</span>
            <span className="text-[9px] text-accent bg-accent/10 px-2 py-0.5 rounded-full">Live</span>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 p-3">
            {[
              { label: "Revenue", value: "$48.2K", icon: TrendingUp },
              { label: "Orders", value: "1,284", icon: Zap },
              { label: "AI Replies", value: "847", icon: Bot },
            ].map((s) => (
              <div key={s.label} className="bg-bg-primary/50 rounded-lg p-2.5 text-center">
                <s.icon className="w-3.5 h-3.5 text-accent mx-auto mb-1" />
                <div className="text-xs font-bold">{s.value}</div>
                <div className="text-[8px] text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Mini chart */}
          <div className="px-3 pb-3">
            <div className="bg-bg-primary/50 rounded-lg p-3">
              <div className="h-12 flex items-end gap-1">
                {[35, 50, 40, 65, 55, 80, 70, 90, 60, 95, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${h}%`,
                      background: "linear-gradient(to top, rgba(167,139,250,0.5), rgba(167,139,250,0.15))",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Activity */}
          <div className="px-3 pb-3 space-y-1.5">
            {[
              { text: "New order received", time: "2m", dot: "bg-accent" },
              { text: "AI resolved inquiry", time: "8m", dot: "bg-accent/60" },
            ].map((a) => (
              <div key={a.text} className="flex items-center gap-2 px-2.5 py-1.5 bg-bg-primary/30 rounded-lg">
                <div className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />
                <span className="text-[10px] text-text-secondary flex-1">{a.text}</span>
                <span className="text-[9px] text-text-muted">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DesktopMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="hidden lg:block relative"
    >
      <div className="relative animate-float">
        <div className="glass-card p-3 rounded-2xl shadow-2xl shadow-accent/5">
          <div className="bg-bg-elevated rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-bg-primary/60 rounded-md px-3 py-1 text-xs text-text-muted text-center">
                  dashboard.yourcompany.com
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4 min-h-[300px]">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-text-muted">Good morning, Owner</div>
                  <div className="text-sm font-semibold mt-0.5">Business Dashboard</div>
                </div>
                <div className="px-3 py-1.5 bg-accent/10 rounded-lg text-xs text-accent font-medium">Live</div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "Revenue", value: "$48.2K", change: "+18%" },
                  { label: "Orders", value: "1,284", change: "+24%" },
                  { label: "Customers", value: "847", change: "+12%" },
                ].map((s) => (
                  <div key={s.label} className="bg-bg-primary/60 rounded-lg p-3">
                    <div className="text-[10px] text-text-muted">{s.label}</div>
                    <div className="text-sm font-bold mt-1">{s.value}</div>
                    <div className="text-[10px] text-accent mt-0.5">{s.change}</div>
                  </div>
                ))}
              </div>
              <div className="bg-bg-primary/60 rounded-lg p-4">
                <div className="text-[10px] text-text-muted mb-3">Weekly Revenue</div>
                <div className="h-24 flex items-end gap-1.5">
                  {[35, 50, 40, 65, 55, 80, 70, 90, 60, 95, 85, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${h}%`,
                        background: "linear-gradient(to top, rgba(167,139,250,0.5), rgba(167,139,250,0.15))",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { text: "New order #1284", time: "2 min ago" },
                  { text: "AI bot resolved inquiry", time: "8 min ago" },
                  { text: "Invoice #892 paid", time: "15 min ago" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 px-3 py-2 bg-bg-primary/40 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-[11px] text-text-secondary flex-1">{item.text}</span>
                    <span className="text-[10px] text-text-muted">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute -bottom-6 -left-10 w-48 glass-card p-3 rounded-xl shadow-2xl shadow-accent/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-[10px] text-text-muted">New Payment</div>
              <div className="text-sm font-bold text-accent">+$1,247.00</div>
            </div>
          </div>
        </div>

        <div className="absolute -top-4 -right-6 w-44 glass-card p-3 rounded-xl shadow-2xl shadow-accent/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-[10px] text-text-muted">AI Assistant</div>
              <div className="text-[11px] font-medium text-text-secondary">3 replies sent</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 radial-glow" />
      <div className="absolute top-1/4 -left-32 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-accent/5 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-accent/4 rounded-full blur-[120px] animate-float" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/15 text-accent text-xs sm:text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Software Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[2.1rem] leading-[1.12] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              We Don&apos;t Build Websites.
              <br className="hidden sm:block" />{" "}
              We Build{" "}
              <span className="gradient-text">Revenue Machines.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Custom software with AI baked in — apps that book clients,
              process orders, and grow your business while you sleep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/pricing"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-bg-primary font-semibold rounded-xl glow-accent hover:bg-accent-hover transition-all text-base"
              >
                Get Your Exact Price
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-glass border border-glass-border rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-base font-medium"
              >
                See Our Work
              </Link>
            </motion.div>

            {/* Stats - horizontal on mobile, grid on desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-6 sm:pt-8 border-t border-border flex justify-between sm:grid sm:grid-cols-3 gap-4 sm:gap-8"
            >
              {[
                { value: "50+", label: "Projects" },
                { value: "98%", label: "Satisfaction" },
                { value: "3x", label: "Avg. ROI" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-text-muted text-[10px] sm:text-xs mt-0.5 sm:mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Desktop mockup - only on lg+ */}
          <DesktopMockup />
        </div>

        {/* Mobile mockup - only on mobile/tablet */}
        <MobileMockup />
      </div>
    </section>
  );
}
