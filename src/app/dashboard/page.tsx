"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, FileText, Sparkles, Rocket, Mail, MessageSquare, Phone, Star,
} from "lucide-react";

const welcomeSteps = [
  { title: "Project Received", description: "We've saved your configuration and pricing.", icon: CheckCircle2, done: true },
  { title: "Team Review", description: "Our team is reviewing your requirements.", icon: FileText, done: false, active: true },
  { title: "Kickoff Call", description: "We'll schedule a call to discuss your project in detail.", icon: Phone, done: false },
  { title: "Design Phase", description: "We create wireframes and designs for your approval.", icon: Sparkles, done: false },
  { title: "Development Begins", description: "Your software gets built with weekly progress demos.", icon: Rocket, done: false },
];

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto p-8 text-center text-text-muted">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const [showCelebration, setShowCelebration] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("cl_celebrated");
  });

  // Show celebration once per session, then never again
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
        sessionStorage.setItem("cl_celebrated", "1");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  return (
    <>
      {/* Celebration overlay — shows once on first dashboard visit */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center"
            >
              {/* Animated rings */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute inset-0 rounded-full border-2 border-accent/20"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 0.5 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute inset-0 rounded-full border border-accent/10"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.6, opacity: 0.3 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="absolute inset-0 rounded-full border border-accent/5"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 12 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-accent/15 flex items-center justify-center">
                    <Rocket className="w-10 h-10 text-accent" />
                  </div>
                </motion.div>
              </div>

              {/* Floating stars */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -80 - Math.random() * 60,
                    x: (Math.random() - 0.5) * 200,
                  }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                  className="absolute left-1/2 top-1/3"
                >
                  <Star className="w-4 h-4 text-accent fill-accent" />
                </motion.div>
              ))}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-3xl sm:text-4xl font-bold mb-3"
              >
                You&apos;re In!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-text-secondary text-lg"
              >
                Welcome to your project portal
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard content */}
      {quoteId ? (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Quote flow — project received */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to CodeLaunch!</h1>
            <p className="text-text-secondary text-base">We&apos;ve received your project configuration and our team is reviewing it.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-6">What Happens Next</h2>
            <div className="space-y-4">
              {welcomeSteps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      step.done ? "bg-accent/15 text-accent" : step.active ? "bg-accent/10 text-accent border border-accent/20" : "bg-bg-elevated text-text-muted"
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    {i < welcomeSteps.length - 1 && (
                      <div className={`w-px h-6 mt-1 ${step.done ? "bg-accent/30" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="pt-2">
                    <h3 className={`text-sm font-semibold ${step.done ? "text-accent" : step.active ? "text-text-primary" : "text-text-muted"}`}>
                      {step.title}
                      {step.done && <span className="ml-2 text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">Done</span>}
                      {step.active && <span className="ml-2 text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded animate-pulse">In Progress</span>}
                    </h3>
                    <p className="text-text-muted text-xs mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Check Your Email</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  You&apos;ll hear from us within 24 hours to schedule your kickoff call.
                  We&apos;ll also send you a detailed project brief and next steps via email and in-app message.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Your Project Portal</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  This dashboard is where you&apos;ll track progress, upload files, view invoices, and message your development team.
                  Once your project kicks off, everything happens right here.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Direct signup — no project yet */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome to CodeLaunch!</h1>
            <p className="text-text-secondary text-base mb-8">You&apos;re all set. Let&apos;s get your project started.</p>

            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cta text-cta-text font-semibold rounded-xl btn-glow hover:bg-cta-hover transition-all text-base"
            >
              <Sparkles className="w-5 h-5" />
              Start Your Project
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-xs font-bold">1</div>
                <div>
                  <h3 className="text-sm font-semibold">Configure Your Project</h3>
                  <p className="text-text-muted text-xs mt-0.5">Use our pricing calculator to pick your project type, features, and design. See exact pricing in real-time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-xs font-bold">2</div>
                <div>
                  <h3 className="text-sm font-semibold">We Review & Kick Off</h3>
                  <p className="text-text-muted text-xs mt-0.5">Our team reviews your configuration and schedules a kickoff call within 24 hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-xs font-bold">3</div>
                <div>
                  <h3 className="text-sm font-semibold">Track Everything Here</h3>
                  <p className="text-text-muted text-xs mt-0.5">Once your project starts, this dashboard becomes your command center — progress, files, invoices, and messaging all in one place.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
