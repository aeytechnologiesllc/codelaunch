"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Rocket, ArrowRight, Mail, Lock, User, Building, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { signUp, signInWithGoogle } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-muted">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const [authChecking, setAuthChecking] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push(quoteId ? `/dashboard?quoteId=${quoteId}` : "/dashboard");
      } else {
        setAuthChecking(false);
      }
    });
  }, [router, quoteId]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName) return;
    setLoading(true);
    setError("");

    const { data, error: authError } = await signUp(email, password, {
      full_name: `${firstName} ${lastName}`.trim(),
      company,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If no session (email confirmation required), show message
    if (!data.session) {
      setSuccess(true);
      setLoading(false);
      setError("Check your email to confirm your account, then log in.");
      return;
    }

    setSuccess(true);
    setLoading(false);
    // Session exists — redirect to dashboard
    setTimeout(() => router.push(quoteId ? `/dashboard?quoteId=${quoteId}` : "/dashboard"), 1500);
  };

  if (authChecking) {
    return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-muted text-sm">Loading...</div>;
  }

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
            <>
            <div className="space-y-4 mb-4">
              {/* Google Sign Up */}
              <button
                type="button"
                onClick={() => {
                  const redirect = quoteId ? `/dashboard?quoteId=${quoteId}` : "/dashboard";
                  signInWithGoogle(`${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`);
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-border rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                <div className="relative flex justify-center text-xs"><span className="bg-bg-elevated px-3 text-text-muted">or</span></div>
              </div>
            </div>

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
            </>
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
