"use client";

import { ScrollReveal } from "./ScrollReveal";

const techLogos = [
  { name: "Next.js", svg: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.234 14.234L9.684 8.372A.5.5 0 0 1 10 7.5h.5a.5.5 0 0 1 .5.5v7.5a.5.5 0 0 1-.5.5H10a.5.5 0 0 1-.316-.886L16.234 16.234z" },
  { name: "React", svg: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236z" },
  { name: "TypeScript", text: "TS" },
  { name: "Tailwind CSS", text: "TW" },
  { name: "Supabase", text: "SB" },
  { name: "Stripe", text: "S" },
  { name: "Vercel", text: "V" },
  { name: "OpenAI", text: "AI" },
  { name: "Node.js", text: "N" },
  { name: "PostgreSQL", text: "PG" },
  { name: "Flutter", text: "FL" },
  { name: "Figma", text: "F" },
];

function LogoItem({ name, text }: { name: string; text?: string }) {
  return (
    <div className="flex items-center gap-2.5 px-6 py-3 mx-3 rounded-full border border-border/50 bg-glass hover:border-accent/20 hover:bg-accent/5 transition-all duration-300 group whitespace-nowrap">
      <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent group-hover:bg-accent/20 transition-colors">
        {text || name[0]}
      </div>
      <span className="text-text-muted text-sm font-medium group-hover:text-text-secondary transition-colors">
        {name}
      </span>
    </div>
  );
}

export function LogoMarquee() {
  const logos = [...techLogos, ...techLogos]; // Duplicate for seamless loop

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden border-y border-border/30">
      <ScrollReveal animation="fadeIn">
        <p className="text-center text-text-muted text-xs uppercase tracking-widest mb-8 font-medium">
          Trusted technologies powering your growth
        </p>
      </ScrollReveal>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {logos.map((logo, i) => (
            <LogoItem key={`${logo.name}-${i}`} name={logo.name} text={logo.text} />
          ))}
        </div>
      </div>
    </section>
  );
}
