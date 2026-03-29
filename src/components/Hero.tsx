"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-cta text-cta-text font-semibold rounded-xl glow-accent hover:bg-cta-hover transition-all text-base"
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

            {/* Stats */}
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

          {/* Right: Real product image — fades into background */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Edge fade masks — dissolves image into the dark background */}
              <div className="absolute inset-0 z-10 pointer-events-none" style={{
                maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 40%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 40%, transparent 100%)",
              }}>
                <Image
                  src="/images/hero-laptop-phone.png"
                  alt="CodeLaunch dashboard on laptop and mobile"
                  width={800}
                  height={533}
                  className="w-full h-auto"
                  priority
                />
              </div>
              {/* Invisible version for layout sizing */}
              <Image
                src="/images/hero-laptop-phone.png"
                alt=""
                width={800}
                height={533}
                className="w-full h-auto invisible"
                aria-hidden="true"
              />
              {/* Subtle glow behind */}
              <div className="absolute inset-0 -z-10 bg-accent/5 blur-[80px] rounded-full scale-75" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
