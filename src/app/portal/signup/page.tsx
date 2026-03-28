"use client";

import { motion } from "framer-motion";
import { Rocket, ArrowRight, Mail, Lock, User, Building } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 radial-glow opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Code<span className="text-accent">Launch</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
          <p className="text-text-muted text-sm">Track your project, upload files, and chat with your team</p>
        </div>

        <div className="glass-card p-8">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block">First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="text" placeholder="David" className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block">Last Name</label>
                <input type="text" placeholder="Barth" className="w-full px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Company</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" placeholder="Your business name" className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" placeholder="you@company.com" className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="password" placeholder="Create a password" className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
              </div>
            </div>
            <Link
              href="/dashboard"
              className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3 bg-accent text-bg-primary font-semibold rounded-xl glow-accent hover:bg-accent-hover transition-all text-sm"
            >
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </form>

          <div className="mt-6 text-center">
            <span className="text-text-muted text-xs">Already have an account? </span>
            <Link href="/portal/login" className="text-accent text-xs font-medium hover:text-accent-hover transition-colors">Log in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
