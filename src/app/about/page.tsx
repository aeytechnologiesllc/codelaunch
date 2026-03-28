"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { Code2, Zap, Heart, Shield } from "lucide-react";
import Link from "next/link";

const values = [
  { icon: Zap, title: "Speed", description: "We ship fast. Weeks, not months. Your business can't wait 6 months for software that might work." },
  { icon: Heart, title: "Honesty", description: "If we can't help you, we'll say so. If a $49/month SaaS tool solves your problem, we'll tell you to use that instead." },
  { icon: Code2, title: "Craft", description: "We don't copy-paste templates. Every line of code is written for your specific business needs." },
  { icon: Shield, title: "Reliability", description: "We don't ghost after launch. Your software needs to work at 3am on a Saturday, and so do we if it doesn't." },
];

const techStack = [
  { category: "Frontend", items: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Redis", "GraphQL"] },
  { category: "AI & ML", items: ["OpenAI", "Claude API", "LangChain", "TensorFlow", "NLP"] },
  { category: "Infrastructure", items: ["AWS", "Vercel", "Supabase", "Docker", "CI/CD"] },
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">About Us</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Small Team. <span className="gradient-text">Big Impact.</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              We&apos;re a small, focused team of engineers and designers who got tired of watching small businesses
              get ripped off by agencies charging $50K for WordPress sites. We build real software — custom, fast,
              and at prices that actually make sense.
            </p>
          </div>
        </ScrollReveal>

        {/* Values */}
        <div className="grid sm:grid-cols-2 gap-6 mb-20">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 0.1}>
              <div className="glass-card p-8 h-full group hover:bg-white/[0.06] transition-all">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <v.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{v.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{v.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Tech stack */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our <span className="gradient-text">Tech Stack</span></h2>
            <p className="text-text-secondary">Modern tools for modern businesses. No legacy bloat.</p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {techStack.map((group, i) => (
            <ScrollReveal key={group.category} delay={i * 0.1}>
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">{group.category}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal>
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to work with us?</h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              We take on a limited number of projects at a time so we can give each one our full attention.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-7 py-3.5 bg-accent text-bg-primary font-semibold rounded-xl glow-gold hover:bg-accent-hover transition-all">
                Start a Project
              </Link>
              <Link href="/pricing" className="px-7 py-3.5 bg-glass border border-glass-border rounded-xl text-text-secondary hover:text-text-primary transition-all font-medium">
                See Pricing
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
