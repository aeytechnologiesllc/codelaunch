"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { Code2, Zap, Heart, Shield, MapPin, Building, Calendar, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const values = [
  { icon: Zap, title: "Speed", description: "We ship fast. Weeks, not months. Your business can't wait 6 months for software that might work." },
  { icon: Heart, title: "Honesty", description: "If we can't help you, we'll say so. If a $49/month SaaS tool solves your problem, we'll tell you to use that instead." },
  { icon: Code2, title: "Craft", description: "We don't copy-paste templates. Every line of code is written for your specific business needs." },
  { icon: Shield, title: "Reliability", description: "We don't ghost after launch. Your software needs to work at 3am on a Saturday, and so do we if it doesn't." },
];

const team = [
  { role: "Lead Developer", focus: "Full-stack architecture, AI integration, system design", initials: "LD" },
  { role: "Design Lead", focus: "UI/UX design, brand identity, user research", initials: "DL" },
  { role: "Project Manager", focus: "Client communication, timelines, quality assurance", initials: "PM" },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">About CodeLaunch</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              We Started Because We Were <span className="gradient-text">Angry.</span>
            </h1>
          </div>
        </ScrollReveal>

        {/* The Story */}
        <ScrollReveal>
          <div className="max-w-3xl mx-auto mb-20">
            <div className="glass-card p-8 sm:p-10 space-y-6 text-text-secondary leading-relaxed">
              <p className="text-lg">
                A few years ago, a friend of mine — a guy who makes the best birria tacos
                you&apos;ve ever had — showed me his monthly statements. DoorDash and UberEats
                were taking <span className="text-text-primary font-semibold">$3,200 every month</span> in
                commissions. Not for making food. Not for hiring staff. Just for the privilege
                of being listed on their app.
              </p>
              <p>
                He asked me if I could build him something. His own ordering system. Something
                simple — customers order, kitchen gets notified, driver picks up. No 30% cut
                to a corporation in San Francisco.
              </p>
              <p>
                I built it in five weeks. His first month with his own platform, he kept
                that $3,200. By month three, direct orders had doubled because customers
                preferred ordering from his site — no app fees, faster delivery, better
                experience.
              </p>
              <p>
                Then his plumber called. Then his wife&apos;s salon. Then the dentist down
                the street. Every small business owner had the same story: <span className="text-text-primary font-semibold italic">&quot;I&apos;m
                paying for software that doesn&apos;t fit my business, and I can&apos;t afford
                the agencies that charge $50,000 for a custom solution.&quot;</span>
              </p>
              <p>
                That&apos;s why CodeLaunch exists. Not because we saw a market opportunity.
                Because we watched real people — people who wake up at 4am to prep food,
                who crawl under houses to fix pipes, who spend their weekends doing books
                instead of being with their kids — get squeezed by software that was
                supposed to help them.
              </p>
              <p className="text-text-primary font-medium">
                We build software that actually fits. That saves real money. That works
                the way your business works, not the way some product manager in Silicon
                Valley decided it should.
              </p>
              <p className="text-text-muted text-sm pt-4 border-t border-border">
                That taco shop is still our client. So is the plumber. And the salon.
                And about 50 other businesses that deserve software as good as the
                services they provide.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Trust Badges */}
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20 max-w-3xl mx-auto">
            <div className="glass-card p-4 text-center">
              <Building className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-xs font-semibold">Southern Digital Technologies LLC</div>
              <div className="text-text-muted text-[10px] mt-0.5">Registered LLC</div>
            </div>
            <div className="glass-card p-4 text-center">
              <MapPin className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-xs font-semibold">Helena, Montana</div>
              <div className="text-text-muted text-[10px] mt-0.5">55 W 14th St, Suite 101</div>
            </div>
            <div className="glass-card p-4 text-center">
              <Calendar className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-xs font-semibold">Founded 2024</div>
              <div className="text-text-muted text-[10px] mt-0.5">2+ years building</div>
            </div>
            <div className="glass-card p-4 text-center">
              <Award className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-xs font-semibold">50+ Projects</div>
              <div className="text-text-muted text-[10px] mt-0.5">98% satisfaction</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Our Team */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The <span className="gradient-text">Team</span></h2>
            <p className="text-text-secondary max-w-lg mx-auto">Small on purpose. Every project gets our full attention, not a fraction of it.</p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-5 mb-20 max-w-3xl mx-auto">
          {team.map((member, i) => (
            <ScrollReveal key={member.role} delay={i * 0.1}>
              <div className="glass-card p-6 text-center group hover:bg-white/[0.03] transition-all">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent font-bold text-lg">
                  {member.initials}
                </div>
                <h3 className="font-semibold text-sm mb-1">{member.role}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{member.focus}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Values */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What We <span className="gradient-text">Stand For</span></h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-5 mb-20 max-w-4xl mx-auto">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 0.08}>
              <div className="glass-card p-6 h-full group hover:bg-white/[0.03] transition-all">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{v.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{v.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Tech stack */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our <span className="gradient-text">Tech Stack</span></h2>
            <p className="text-text-secondary text-sm">Modern tools for modern businesses. No legacy bloat.</p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20 max-w-4xl mx-auto">
          {techStack.map((group, i) => (
            <ScrollReveal key={group.category} delay={i * 0.08}>
              <div className="glass-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">{group.category}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-text-secondary">
                      <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0" />
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
          <div className="glass-card p-10 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Want to work with us?</h2>
            <p className="text-text-secondary mb-6 max-w-lg mx-auto text-sm">
              We take on a limited number of projects at a time so every client gets our full attention.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pricing" className="px-7 py-3.5 bg-cta text-cta-text font-semibold rounded-xl glow-accent hover:bg-cta-hover transition-all text-sm">
                Get Your Exact Price
              </Link>
              <Link href="/book" className="px-7 py-3.5 bg-glass border border-glass-border rounded-xl text-text-secondary hover:text-text-primary transition-all font-medium text-sm">
                Book a Free Call
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
