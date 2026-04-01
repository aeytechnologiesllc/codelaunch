"use client";

import { ScrollReveal } from "./ScrollReveal";

const techGroups = [
  {
    label: "Frontend",
    color: "#a78bfa",
    tools: [
      { name: "Next.js", abbr: "N" },
      { name: "React", abbr: "R" },
      { name: "Tailwind CSS", abbr: "TW" },
      { name: "TypeScript", abbr: "TS" },
    ],
  },
  {
    label: "Backend & Data",
    color: "#60a5fa",
    tools: [
      { name: "Node.js", abbr: "No" },
      { name: "Python", abbr: "Py" },
      { name: "Supabase", abbr: "SB" },
      { name: "PostgreSQL", abbr: "PG" },
    ],
  },
  {
    label: "Mobile",
    color: "#34d399",
    tools: [
      { name: "React Native", abbr: "RN" },
      { name: "Flutter", abbr: "FL" },
    ],
  },
  {
    label: "AI & Infrastructure",
    color: "#fbbf24",
    tools: [
      { name: "OpenAI", abbr: "AI" },
      { name: "Stripe", abbr: "St" },
      { name: "Vercel", abbr: "V" },
      { name: "Figma", abbr: "F" },
    ],
  },
];

export function TechBadges() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-6">
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

        <div className="space-y-6">
          {techGroups.map((group, gi) => (
            <ScrollReveal key={group.label} delay={gi * 0.08} animation="fadeUp">
              <div className="glass-card p-5 sm:p-6">
                {/* Category label */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: group.color }}
                  />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: group.color }}
                  >
                    {group.label}
                  </span>
                </div>

                {/* Tools row */}
                <div className="flex flex-wrap gap-3">
                  {group.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-bg-primary/60 border transition-all duration-300 hover:scale-[1.03] hover:shadow-lg group/tool"
                      style={{
                        borderColor: `${group.color}15`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${group.color}40`;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${group.color}15`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${group.color}15`;
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: `${group.color}15`,
                          color: group.color,
                        }}
                      >
                        {tool.abbr}
                      </div>
                      <span className="text-sm font-medium text-text-secondary group-hover/tool:text-text-primary transition-colors">
                        {tool.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
