"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import dynamic from "next/dynamic";
import { MagneticButton } from "./MagneticButton";
import { MobileHeroCanvas } from "./MobileHeroCanvas";

const HeroScene = dynamic(
  () => import("./HeroScene").then((mod) => ({ default: mod.HeroScene })),
  { ssr: false }
);

function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
        }
      },
    });
  }, [inView, value, suffix, prefix]);

  return (
    <span ref={ref} className="gradient-text">
      {prefix}0{suffix}
    </span>
  );
}

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge entrance
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 }
      );

      // Headline — word-by-word reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".hero-word");
        tl.fromTo(
          words,
          { opacity: 0, y: 40, rotateX: -30 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.5,
            stagger: 0.04,
          },
          "-=0.3"
        );
      }

      // Subtext
      tl.fromTo(
        subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2"
      );

      // CTAs
      if (ctaRef.current) {
        const buttons = ctaRef.current.children;
        tl.fromTo(
          buttons,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.2"
        );
      }

      // Stats
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.15"
      );
    });

    return () => ctx.revert();
  }, []);

  // Split headline into words for animation
  const headlineWords = (text: string) =>
    text.split(" ").map((word, i) => (
      <span
        key={i}
        className="hero-word inline-block"
        style={{ perspective: "600px" }}
      >
        {word}&nbsp;
      </span>
    ));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-bg" />
        <div className="aurora-gradient" />
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-purple-500/[0.07] rounded-full blur-[120px] aurora-orb-1" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/[0.05] rounded-full blur-[100px] aurora-orb-2" />
        <div className="absolute top-[40%] left-[50%] w-[600px] h-[600px] bg-violet-500/[0.04] rounded-full blur-[140px] aurora-orb-3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div ref={badgeRef} className="flex justify-center lg:justify-start opacity-0">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs sm:text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Software Studio
              </span>
            </div>

            <h1
              ref={headlineRef}
              className="text-[2.1rem] leading-[1.12] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              style={{ perspective: "600px" }}
            >
              {headlineWords("We Don't Build Websites.")}
              <br className="hidden sm:block" />
              {headlineWords("We Build")}
              <span className="hero-word inline-block gradient-text">
                Revenue&nbsp;
              </span>
              <span className="hero-word inline-block gradient-text">
                Machines.
              </span>
            </h1>

            <p
              ref={subtextRef}
              className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-0"
            >
              Custom software with AI baked in — apps that book clients,
              process orders, and grow your business while you sleep.
            </p>

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <MagneticButton strength={0.25}>
                <Link
                  href="/pricing"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-cta text-cta-text font-semibold rounded-xl hover:bg-cta-hover transition-all text-base relative overflow-hidden btn-glow"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Build With Us
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 glass-card text-text-secondary hover:text-text-primary hover:border-accent/20 transition-all text-base font-medium"
                >
                  See Our Work
                </Link>
              </MagneticButton>
            </div>

            {/* Risk-free trust badge */}
            <Link
              href="#guarantee"
              className="inline-flex items-center gap-2 text-xs text-accent-warm hover:text-accent-warm/80 transition-colors mt-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="font-medium">Free design phase · Only pay if you love it</span>
            </Link>

            {/* Stats */}
            <div
              ref={statsRef}
              className="pt-6 sm:pt-8 border-t border-border flex justify-between sm:grid sm:grid-cols-3 gap-4 sm:gap-8 opacity-0"
            >
              {[
                { value: 50, suffix: "+", label: "Projects" },
                { value: 98, suffix: "%", label: "Satisfaction" },
                { value: 3, suffix: "x", label: "Avg. ROI" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-text-muted text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Canvas animated particle orb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="lg:hidden absolute inset-0 pointer-events-none"
          >
            <MobileHeroCanvas />
          </motion.div>

          {/* Desktop: 3D Scene */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 -z-10 bg-accent/5 blur-[80px] rounded-full scale-90" />
            <HeroScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
