"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowRight, LayoutDashboard, Calculator } from "lucide-react";

export function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 w-80 glass-card p-5 shadow-2xl"
          >
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-1">Need help getting started?</h3>
              <p className="text-text-muted text-xs leading-relaxed">
                We keep client communication inside the portal. Choose the starting point that fits you best.
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href="/pricing"
                className="flex items-center gap-3 w-full px-4 py-3 bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/15 transition-colors group"
                onClick={() => setOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-accent">Build a Quote</div>
                  <div className="text-[10px] text-text-muted">Pick features and lock in your scope</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-3 w-full px-4 py-3 bg-white/[0.03] border border-border rounded-xl hover:bg-white/[0.05] transition-colors group"
                onClick={() => setOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Start Project Intake</div>
                  <div className="text-[10px] text-text-muted">Send details once and continue in the portal</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-colors" />
              </Link>

              <Link
                href="/portal/login"
                className="flex items-center gap-3 w-full px-4 py-3 bg-white/[0.03] border border-border rounded-xl hover:bg-white/[0.05] transition-colors group"
                onClick={() => setOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Open Client Portal</div>
                  <div className="text-[10px] text-text-muted">Sign in to review messages and project status</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-colors" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((current) => !current)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          open ? "bg-bg-elevated border border-border" : "bg-accent glow-accent"
        }`}
      >
        {open ? (
          <X className="w-5 h-5 text-text-secondary" />
        ) : (
          <MessageCircle className="w-5 h-5 text-cta-text" />
        )}
      </motion.button>
    </div>
  );
}
