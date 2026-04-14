"use client";

import { useEffect, useRef } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { MessageSquare, Palette, Code2, Rocket } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Discovery",
    description: "30-minute call. We listen to your problems, not pitch our solutions. If we can't help, we'll tell you.",
    duration: "Free \u00b7 30 min",
  },
  {
    number: "02",
    icon: Palette,
    title: "Design",
    description: "We design every screen and walk you through it. You don't pay for code until you love the design.",
    duration: "1-2 weeks",
  },
  {
    number: "03",
    icon: Code2,
    title: "Build",
    description: "Weekly demos. You see progress every 7 days. Change your mind? We adjust. No surprises.",
    duration: "4-8 weeks",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch",
    description: "We deploy, monitor, and optimize. Then we stick around because your success is our reputation.",
    duration: "Ongoing",
  },
];

export function Process() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === lineRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section id="process" className="relative py-28 sm:py-32 overflow-hidden section-ambient-cool">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Idea to Launch.{" "}
              <span className="gradient-text">Zero Guesswork.</span>
            </h2>
            <p className="text-text-secondary text-lg">
              You&apos;re in the loop every step. No black box development.
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop: horizontal with connecting line */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div className="absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-border">
            <div
              ref={lineRef}
              className="absolute inset-0 bg-gradient-to-r from-accent via-accent to-accent-hover origin-left"
            />
          </div>

          <div className="grid grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.15} animation="fadeUp">
                <div className="relative glass-card p-8 h-full group hover:bg-white/[0.06] transition-all duration-500 ">
                  {/* Step number bubble */}
                  <div className="w-12 h-12 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center mb-6 mx-auto group-hover:bg-accent/25 group-hover:border-accent/50 group-hover:shadow-[0_0_20px_rgba(167,139,250,0.2)] transition-all duration-300">
                    <span className="text-accent font-bold text-sm">{step.number}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                      <step.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-accent transition-colors">{step.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">{step.description}</p>
                    <span className="inline-block px-3 py-1 bg-accent/10 rounded-full text-xs text-accent font-medium">{step.duration}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.1}>
              <div className="relative glass-card p-8 h-full group hover:bg-white/[0.06] transition-all duration-300">
                <div className="text-5xl font-bold text-white/[0.03] absolute top-4 right-6 select-none">{step.number}</div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-accent transition-colors">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{step.description}</p>
                  <span className="inline-block px-3 py-1 bg-accent/10 rounded-full text-xs text-accent font-medium">{step.duration}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
