"use client";

import { useRef, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { Globe, Smartphone, Brain, Plug, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Globe,
    title: "Web Applications",
    description: "From booking systems to full business dashboards — web apps that replace your spreadsheets and disconnected tools with one clean platform.",
    features: ["Business dashboards", "Booking systems", "Client portals", "E-commerce"],
    gradient: "from-accent/10 to-accent-secondary/10",
    href: "/services#web",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "iOS & Android apps that your customers actually want to use. Ordering, scheduling, tracking — beautiful and fast.",
    features: ["iOS & Android", "Push notifications", "Offline mode", "App Store ready"],
    gradient: "from-accent-secondary/10 to-pink-500/10",
    href: "/services#mobile",
  },
  {
    icon: Brain,
    title: "AI & Automation",
    description: "AI that works 24/7 so you don't have to. Chatbots that answer customers, systems that predict demand, workflows that run themselves.",
    features: ["AI chatbots", "Auto-scheduling", "Smart analytics", "Workflow automation"],
    gradient: "from-accent/10 to-green-500/10",
    href: "/services#ai",
  },
  {
    icon: Plug,
    title: "Integrations & Bots",
    description: "Get Telegram alerts when you get a sale. Connect Stripe, your POS, WhatsApp — make your tools talk to each other.",
    features: ["Telegram / WhatsApp bots", "Payment systems", "API connections", "Real-time alerts"],
    gradient: "from-blue-500/10 to-accent-secondary/10",
    href: "/services#integrations",
  },
];

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || window.innerWidth < 768) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlowPos({ x: 50, y: 50 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow follow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(167, 139, 250, 0.08) 0%, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="relative py-28 sm:py-32 bg-bg-secondary">
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="absolute inset-0 radial-glow opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              What We Build
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Four Things We Do.{" "}
              <span className="gradient-text">All of Them Well.</span>
            </h2>
            <p className="text-text-secondary text-lg">
              We don&apos;t do everything. We do these four things better than anyone else for small businesses.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.1} animation={i % 2 === 0 ? "slideLeft" : "slideRight"}>
              <Link href={service.href}>
                <TiltCard className="glass-card p-8 h-full group hover:border-accent/15 transition-all duration-300 relative overflow-hidden cursor-pointer">
                  <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(167,139,250,0.2)] transition-all duration-300`}>
                        <service.icon className="w-6 h-6 text-accent" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((f) => (
                        <span key={f} className="px-3 py-1 bg-bg-primary/60 rounded-full text-xs text-text-muted border border-border group-hover:border-accent/10 transition-colors">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
