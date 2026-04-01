"use client";

import { ScrollReveal } from "./ScrollReveal";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const caseStudies = [
  {
    title: "Smart Hiring Platform",
    category: "Web Application",
    description: "AI-powered recruitment platform with Kanban pipeline, automated screening, and candidate matching. Replaced 4 disconnected tools.",
    results: ["3x faster time-to-hire", "10,000+ applications processed", "87% AI match accuracy"],
    tags: ["React", "Node.js", "AI/ML", "PostgreSQL"],
    image: "/images/web-analytics.png",
  },
  {
    title: "Financial Analytics Dashboard",
    category: "Complex Web App",
    description: "Real-time financial dashboard pulling data from 12+ sources. Automated weekly reports that used to take 6 hours manually.",
    results: ["12 data sources unified", "6hrs \u2192 0 report time", "Real-time P&L visibility"],
    tags: ["Next.js", "Python", "AI Analytics", "REST APIs"],
    image: "/images/web-contractor.png",
  },
];

export function CaseStudies() {
  return (
    <section id="work" className="relative py-28 sm:py-32 bg-bg-secondary">
      <div className="absolute inset-0 radial-glow-green opacity-30" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Our Work</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Don&apos;t Take Our Word For It.{" "}
              <span className="gradient-text">See It.</span>
            </h2>
            <p className="text-text-secondary text-lg">
              Real software we&apos;ve built. Real problems solved. Real results.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6">
          {caseStudies.map((study, i) => (
            <ScrollReveal key={study.title} delay={i * 0.15} animation={i === 0 ? "slideLeft" : "slideRight"}>
              <Link href="/work">
                <div className="glass-card overflow-hidden h-full group hover:border-accent/15 transition-all duration-500 hover:shadow-[0_0_30px_rgba(167,139,250,0.06)]">
                  {/* Image with parallax-like hover effect */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/30 to-transparent group-hover:from-bg-primary/80 transition-all duration-500" />

                    {/* Category badge on image */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-bg-primary/60 backdrop-blur-sm border border-border text-accent text-xs font-medium">
                      {study.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{study.title}</h3>
                      <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5">{study.description}</p>

                    <div className="space-y-2 mb-5">
                      {study.results.map((r) => (
                        <div key={r} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span className="text-text-secondary">{r}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {study.tags.map((t) => (
                        <span key={t} className="px-3 py-1 bg-bg-primary/60 rounded-full text-xs text-text-muted border border-border group-hover:border-accent/10 transition-colors">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
