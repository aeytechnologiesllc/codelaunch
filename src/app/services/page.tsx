"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { Globe, Smartphone, Brain, Plug, Check } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: "web",
    icon: Globe,
    title: "Web Applications",
    tagline: "Replace 10 tools with 1 platform",
    description: "Custom-built web apps that do exactly what your business needs. Dashboards that show you what matters, booking systems your clients love, and portals that keep everyone on the same page.",
    capabilities: [
      "Business dashboards & analytics",
      "Online booking & scheduling systems",
      "Client portals with secure login",
      "E-commerce & payment processing",
      "Admin panels & CMS",
      "Real-time data visualization",
    ],
    tech: ["React", "Next.js", "Node.js", "PostgreSQL", "Stripe"],
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Mobile Apps",
    tagline: "Your business in every pocket",
    description: "Beautiful, fast iOS & Android apps. Whether your customers need to order food, book appointments, or track deliveries — we build apps they'll actually want to use.",
    capabilities: [
      "iOS & Android (cross-platform)",
      "Push notifications & alerts",
      "Offline functionality",
      "GPS & location services",
      "Camera & media integration",
      "App Store & Play Store deployment",
    ],
    tech: ["React Native", "Swift", "Kotlin", "Firebase", "REST APIs"],
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI & Automation",
    tagline: "Your smartest employee never sleeps",
    description: "AI chatbots that handle customer inquiries at 2am. Smart scheduling that optimizes your calendar. Predictive analytics that tell you what's coming before it happens.",
    capabilities: [
      "AI chatbots (customer service, sales)",
      "Automated appointment scheduling",
      "Predictive analytics & forecasting",
      "Document processing & data extraction",
      "Workflow automation",
      "Natural language processing",
    ],
    tech: ["OpenAI", "Claude API", "Python", "TensorFlow", "LangChain"],
  },
  {
    id: "integrations",
    icon: Plug,
    title: "Integrations & Bots",
    tagline: "Make your tools talk to each other",
    description: "Get a Telegram message when someone places an order. Auto-sync your CRM when a lead fills out a form. Connect every tool in your stack so data flows automatically.",
    capabilities: [
      "Telegram & WhatsApp bots",
      "Payment system integration (Stripe, Square)",
      "CRM & email marketing sync",
      "POS system connections",
      "Custom API development",
      "Webhook & event-driven automation",
    ],
    tech: ["Telegram API", "WhatsApp Business", "Stripe", "Zapier", "REST/GraphQL"],
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Our Services</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Four Things. <span className="gradient-text">Done Right.</span>
            </h1>
            <p className="text-text-secondary text-lg">We don&apos;t try to do everything. We do these four things better than anyone for small businesses.</p>
          </div>
        </ScrollReveal>

        <div className="space-y-16">
          {services.map((s, i) => (
            <ScrollReveal key={s.id} delay={0.1}>
              <div id={s.id} className="glass-card p-8 lg:p-12 scroll-mt-28">
                <div className="grid lg:grid-cols-2 gap-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <s.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{s.title}</h2>
                        <p className="text-accent text-sm font-medium">{s.tagline}</p>
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-8">{s.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.tech.map((t) => (
                        <span key={t} className="px-3 py-1 bg-bg-primary/60 rounded-full text-xs text-text-muted border border-border">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">What we can build</h3>
                    <ul className="space-y-3">
                      {s.capabilities.map((c) => (
                        <li key={c} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-text-secondary text-sm">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2}>
          <div className="text-center mt-20">
            <p className="text-text-secondary text-lg mb-6">Not sure what you need? Most people aren&apos;t.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pricing" className="px-7 py-3.5 bg-accent text-bg-primary font-semibold rounded-xl glow-green hover:bg-accent-hover transition-all">
                Try the Pricing Calculator
              </Link>
              <Link href="/contact" className="px-7 py-3.5 bg-glass border border-glass-border rounded-xl text-text-secondary hover:text-text-primary transition-all font-medium">
                Book a Free Call
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
