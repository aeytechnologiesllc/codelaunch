"use client";

import { ScrollReveal } from "./ScrollReveal";

const technologies = [
  { name: "Next.js", category: "Framework", abbr: "N" },
  { name: "React", category: "UI Library", abbr: "R" },
  { name: "React Native", category: "Mobile", abbr: "RN" },
  { name: "Flutter", category: "Mobile", abbr: "FL" },
  { name: "Node.js", category: "Backend", abbr: "No" },
  { name: "Python", category: "AI/ML", abbr: "Py" },
  { name: "Supabase", category: "Database", abbr: "SB" },
  { name: "PostgreSQL", category: "Database", abbr: "PG" },
  { name: "Stripe", category: "Payments", abbr: "St" },
  { name: "OpenAI", category: "AI", abbr: "AI" },
  { name: "Vercel", category: "Hosting", abbr: "V" },
  { name: "Tailwind CSS", category: "Styling", abbr: "TW" },
];

export function TechBadges() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              Our Stack
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Built with the <span className="gradient-text">Best Tools</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {technologies.map((tech, i) => (
            <ScrollReveal key={tech.name} delay={i * 0.04} animation="scaleIn">
              <div className="glass-card p-4 text-center group hover:bg-white/[0.04] hover:border-accent/15 transition-all duration-300 hover:shadow-[0_0_20px_rgba(167,139,250,0.08)]">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2.5 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <span className="text-accent font-bold text-xs">{tech.abbr}</span>
                </div>
                <div className="text-sm font-medium group-hover:text-accent transition-colors">{tech.name}</div>
                <div className="text-text-muted text-[10px] mt-0.5">{tech.category}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
