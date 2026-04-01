"use client";

import { ScrollReveal } from "./ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const showcaseItems = [
  { src: "/images/mobile-restaurant.png", alt: "Restaurant ordering app", label: "Restaurant Ordering", type: "Mobile App", typeColor: "#34d399", featured: false },
  { src: "/images/web-analytics.png", alt: "Analytics dashboard", label: "Business Analytics", type: "Web App", typeColor: "#60a5fa", featured: true },
  { src: "/images/mobile-contractor.png", alt: "Field service app", label: "Contractor Dispatch", type: "Mobile App", typeColor: "#34d399", featured: false },
  { src: "/images/web-contractor.png", alt: "Contractor dashboard", label: "Field Service Hub", type: "Web App", typeColor: "#60a5fa", featured: true },
  { src: "/images/mobile-booking.png", alt: "Booking app", label: "Appointment Booking", type: "Mobile App", typeColor: "#34d399", featured: false },
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
              Not mockups. Not wireframes. Real, production-ready applications running for real businesses.
            </p>
          </div>
        </ScrollReveal>

        {/* Showcase grid — featured items span 2 cols */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[280px] sm:auto-rows-[320px]">
          {showcaseItems.map((item, i) => (
            <ScrollReveal
              key={item.src}
              delay={i * 0.08}
              className={item.featured ? "col-span-2 row-span-1" : "col-span-1 row-span-1"}
            >
              <Link href="/work" className="block h-full">
                <div className="glass-card overflow-hidden h-full group relative hover:border-accent/15 transition-all duration-500 hover:shadow-[0_0_30px_rgba(167,139,250,0.06)]">
                  {/* Image */}
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    sizes={item.featured ? "(max-width: 1024px) 100vw, 33vw" : "(max-width: 640px) 50vw, 16vw"}
                  />

                  {/* Gradient overlay — always visible, darker on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider backdrop-blur-sm border"
                      style={{
                        color: item.typeColor,
                        background: `${item.typeColor}15`,
                        borderColor: `${item.typeColor}25`,
                      }}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="text-sm font-semibold mb-1 group-hover:text-accent transition-colors">{item.label}</h3>

                    {/* View project — appears on hover */}
                    <div className="flex items-center gap-1 text-accent text-xs font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      View Project <ArrowUpRight className="w-3 h-3" />
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
