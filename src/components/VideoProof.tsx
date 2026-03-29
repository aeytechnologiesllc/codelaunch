"use client";

import { ScrollReveal } from "./ScrollReveal";
import Image from "next/image";

const showcaseItems = [
  { src: "/images/mobile-restaurant.png", alt: "Restaurant ordering app", label: "Restaurant Ordering App", type: "Mobile App" },
  { src: "/images/web-analytics.png", alt: "Analytics dashboard", label: "Business Analytics Dashboard", type: "Web App" },
  { src: "/images/mobile-contractor.png", alt: "Field service app", label: "Contractor Dispatch App", type: "Mobile App" },
  { src: "/images/web-contractor.png", alt: "Contractor dashboard", label: "Field Service Dashboard", type: "Web App" },
  { src: "/images/mobile-booking.png", alt: "Booking app", label: "Appointment Booking App", type: "Mobile App" },
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

        {/* Showcase grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {showcaseItems.map((item, i) => (
            <ScrollReveal key={item.src} delay={i * 0.08}>
              <div className="glass-card overflow-hidden group hover:border-accent/15 transition-all">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>
                <div className="p-3">
                  <div className="text-xs font-medium">{item.label}</div>
                  <div className="text-[10px] text-text-muted">{item.type}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
