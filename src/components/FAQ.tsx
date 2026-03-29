"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What if I don't like the design?",
    answer: "You get a full project brief with wireframes before we write any code. If you don't love the design, your deposit is refunded — no questions asked. We take the risk, not you.",
  },
  {
    question: "How long does a project take?",
    answer: "Most projects launch in 4-8 weeks. Simple web apps can be done in 3-4 weeks. Complex apps with AI take 6-8 weeks. You'll see live progress every week with demos — never wondering what's happening.",
  },
  {
    question: "Do I own the code?",
    answer: "Yes. 100%. The code, the design, the database, everything — it's yours. We hand over the full repository and all credentials on delivery. No lock-in, no hostage situations.",
  },
  {
    question: "What happens after launch?",
    answer: "Every project includes 1 month of free maintenance. After that, optional maintenance plans start at $149/mo. We monitor uptime, apply security patches, and fix bugs. Your app doesn't get abandoned.",
  },
  {
    question: "I'm not technical — will I understand what's going on?",
    answer: "That's exactly who we build for. We explain everything in plain English, show you progress with weekly video demos, and your client dashboard lets you track every milestone like tracking a package.",
  },
  {
    question: "How is the price calculated?",
    answer: "Our pricing calculator shows you exactly what you're paying for — feature by feature. Essentials are included free. Add-ons have clear prices. No hidden fees. The price you see is the price you pay.",
  },
  {
    question: "Can I change my mind on features mid-project?",
    answer: "Within the same scope, absolutely — that's what revision rounds are for. If you want to add entirely new features, we'll quote the addition separately so there are no surprises. Changes never torpedo the budget without your approval.",
  },
  {
    question: "What if something breaks after launch?",
    answer: "If you're on a maintenance plan, we fix it — often within hours. Critical issues get same-day fixes. Even without a plan, we offer pay-per-fix support. Your business doesn't stop because of a bug.",
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
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.03}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full glass-card p-5 text-left transition-all hover:bg-white/[0.03]"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium text-sm sm:text-base">{faq.question}</h3>
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-text-secondary text-sm leading-relaxed mt-3 pt-3 border-t border-border">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
