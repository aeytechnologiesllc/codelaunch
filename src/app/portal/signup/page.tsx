"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Rocket, ArrowRight, Mail, Lock, User, Building, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { signUp } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName) return;
    setLoading(true);
    setError("");

    const { error: authError } = await signUp(email, password, {
      full_name: `${firstName} ${lastName}`.trim(),
      company,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    // Auto-redirect after 2 seconds
    setTimeout(() => router.push("/dashboard"), 2000);
  };

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
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-lg font-bold">Account Created!</h2>
              <p className="text-text-muted text-sm">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-secondary mb-1.5 block">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="David" required className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary mb-1.5 block">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Barth" className="w-full px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block">Company</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your business name" className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password (min 6 chars)" required minLength={6} className="w-full pl-10 pr-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3 bg-cta text-cta-text font-semibold rounded-xl glow-accent hover:bg-cta-hover transition-all text-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <span className="text-text-muted text-xs">Already have an account? </span>
              <Link href="/portal/login" className="text-accent text-xs font-medium hover:text-accent-hover transition-colors">Log in</Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
