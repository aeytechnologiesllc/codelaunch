"use client";

import { motion } from "framer-motion";
import { Rocket, ArrowRight, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="absolute inset-0 radial-glow opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Code<span className="text-accent">Launch</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-text-muted text-sm">Log in to track your project progress</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form className="space-y-5">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-text-secondary">Password</label>
                <button type="button" className="text-[11px] text-accent hover:text-accent-hover transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all"
                />
              </div>
            </div>
            <Link
              href="/dashboard"
              className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3 bg-accent text-bg-primary font-semibold rounded-xl glow-accent hover:bg-accent-hover transition-all text-sm"
            >
              Log In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </form>

          <div className="mt-6 text-center">
            <span className="text-text-muted text-xs">Don&apos;t have an account? </span>
            <Link href="/portal/signup" className="text-accent text-xs font-medium hover:text-accent-hover transition-colors">
              Sign up
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-text-muted text-xs hover:text-text-primary transition-colors">
            &larr; Back to CodeLaunch
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
