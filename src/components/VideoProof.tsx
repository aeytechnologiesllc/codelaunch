"use client";

import { ScrollReveal } from "./ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    src: "/images/mockup-dashboard.png",
    title: "Business Analytics Dashboard",
    type: "Web App",
    typeColor: "#a78bfa",
    description: "Real-time revenue tracking with 12+ data source integrations",
  },
  {
    src: "/images/mockup-dispatch.png",
    title: "Contractor Dispatch System",
    type: "Web App",
    typeColor: "#34d399",
    description: "Live GPS tracking, job scheduling, and field crew management",
  },
  {
    src: "/images/mockup-chatbot.png",
    title: "AI Customer Assistant",
    type: "AI Platform",
    typeColor: "#c4b5fd",
    description: "24/7 automated support handling 80% of inquiries",
  },
];

export function VideoProof() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              See It In Action
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Real Software We&apos;ve <span className="gradient-text">Built</span>
            </h2>
            <p className="text-text-secondary text-sm max-w-lg mx-auto">
              Not mockups. Not wireframes. Real interfaces built for real businesses.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1} animation={i % 2 === 0 ? "slideLeft" : "slideRight"}>
              <Link href="/work">
                <div className="glass-card overflow-hidden group hover:border-accent/15 transition-all duration-500 hover:shadow-[0_0_40px_rgba(167,139,250,0.08)]">
                  {/* Screenshot */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={project.src}
                      alt={project.title}
                      fill
                      className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Type badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm border"
                        style={{
                          color: project.typeColor,
                          background: `${project.typeColor}12`,
                          borderColor: `${project.typeColor}25`,
                        }}
                      >
                        {project.type}
                      </span>
                    </div>

                    {/* Bottom content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-1 group-hover:text-accent transition-colors">{project.title}</h3>
                        <p className="text-text-secondary text-sm">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-accent text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex-shrink-0 ml-4">
                        View <ArrowUpRight className="w-4 h-4" />
                      </div>
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
