"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = {
  Process: { color: "#a78bfa", bg: "rgba(167, 139, 250, 0.1)", border: "rgba(167, 139, 250, 0.2)" },
  Timeline: { color: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)", border: "rgba(251, 191, 36, 0.2)" },
  Ownership: { color: "#34d399", bg: "rgba(52, 211, 153, 0.1)", border: "rgba(52, 211, 153, 0.2)" },
  Pricing: { color: "#60a5fa", bg: "rgba(96, 165, 250, 0.1)", border: "rgba(96, 165, 250, 0.2)" },
  Support: { color: "#f472b6", bg: "rgba(244, 114, 182, 0.1)", border: "rgba(244, 114, 182, 0.2)" },
} as const;

type Category = keyof typeof categories;

const faqs: { question: string; answer: string; category: Category }[] = [
  {
    question: "What if I don't like the design?",
    answer: "You get a full project brief with wireframes before we write any code. If you don't love the design, your deposit is refunded — no questions asked. We take the risk, not you.",
    category: "Process",
  },
  {
    question: "How long does a project take?",
    answer: "Most projects launch in 4-8 weeks. Simple web apps can be done in 3-4 weeks. Complex apps with AI take 6-8 weeks. You'll see live progress every week with demos — never wondering what's happening.",
    category: "Timeline",
  },
  {
    question: "Do I own the code?",
    answer: "Yes. 100%. The code, the design, the database, everything — it's yours. We hand over the full repository and all credentials on delivery. No lock-in, no hostage situations.",
    category: "Ownership",
  },
  {
    question: "What happens after launch?",
    answer: "Every project includes 1 month of free maintenance. After that, optional maintenance plans start at $149/mo. We monitor uptime, apply security patches, and fix bugs. Your app doesn't get abandoned.",
    category: "Support",
  },
  {
    question: "I'm not technical — will I understand what's going on?",
    answer: "That's exactly who we build for. We explain everything in plain English, show you progress with weekly video demos, and your client dashboard lets you track every milestone like tracking a package.",
    category: "Process",
  },
  {
    question: "How is the price calculated?",
    answer: "Our pricing calculator shows you exactly what you're paying for — feature by feature. Essentials are included free. Add-ons have clear prices. No hidden fees. The price you see is the price you pay.",
    category: "Pricing",
  },
  {
    question: "Can I change my mind on features mid-project?",
    answer: "Within the same scope, absolutely — that's what revision rounds are for. If you want to add entirely new features, we'll quote the addition separately so there are no surprises. Changes never torpedo the budget without your approval.",
    category: "Process",
  },
  {
    question: "What if something breaks after launch?",
    answer: "If you're on a maintenance plan, we fix it — often within hours. Critical issues get same-day fixes. Even without a plan, we offer pay-per-fix support. Your business doesn't stop because of a bug.",
    category: "Support",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              Questions
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              You&apos;re Probably Wondering...
            </h2>
            <p className="text-text-secondary text-base">
              Straight answers. No sales-speak.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const cat = categories[faq.category];
            const isOpen = openIndex === i;
            return (
              <ScrollReveal key={i} delay={i * 0.03}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full glass-card p-5 sm:p-6 text-left transition-all duration-300 ${
                    isOpen ? "bg-white/[0.04] border-accent/10" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Number */}
                    <span className="hidden sm:block text-text-muted/30 text-xs font-mono font-bold flex-shrink-0 w-6 text-right">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Category badge */}
                    <span
                      className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        color: cat.color,
                        background: cat.bg,
                        border: `1px solid ${cat.border}`,
                      }}
                    >
                      {faq.category}
                    </span>

                    {/* Question */}
                    <h3 className="font-medium text-sm sm:text-base flex-1">{faq.question}</h3>

                    {/* Chevron with ring */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                        isOpen ? "border-accent/30 bg-accent/10" : "border-border bg-transparent"
                      }`}
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-all duration-300 ${
                          isOpen ? "rotate-180 text-accent" : "text-text-muted"
                        }`}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-text-secondary text-sm leading-relaxed mt-4 pt-4 border-t border-border/50 ml-10 sm:ml-[4.25rem]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
