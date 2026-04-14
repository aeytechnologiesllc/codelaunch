"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  email_notifications: boolean | null;
  message_notifications: boolean | null;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state — initialized once profile loads
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [messageNotif, setMessageNotif] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setProfile(data as Profile);
        setFullName(data.full_name || "");
        setEmail(data.email || user.email || "");
        setCompanyName(data.company_name || "");
        setPhone(data.phone || "");
        setEmailNotif(data.email_notifications ?? true);
        setMessageNotif(data.message_notifications ?? true);
      } else {
        // No profile row yet — prefill from auth
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!profile) return;
    setError(null);
    setSaving(true);

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        company_name: companyName.trim() || null,
        phone: phone.trim() || null,
        email_notifications: emailNotif,
        message_notifications: messageNotif,
      })
      .eq("id", profile.id);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSavedAt(Date.now());
    }
    setSaving(false);
  };

  const toggleRow = (label: string, value: boolean, setter: (v: boolean) => void, enabled = true) => (
    <div key={label} className={`flex items-center justify-between ${!enabled ? "opacity-50" : ""}`}>
      <span className="text-sm text-text-secondary">{label}</span>
      <button
        type="button"
        onClick={() => enabled && setter(!value)}
        disabled={!enabled}
        className={`w-10 h-5 rounded-full cursor-pointer transition-colors flex-shrink-0 ${value ? "bg-accent" : "bg-border"}`}
        aria-pressed={value}
        aria-label={label}
      >
        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mt-0.5 ${value ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-5 w-40" />
          <div className="skeleton h-3 w-64" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <div className="skeleton h-4 w-28" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="skeleton h-10 w-full" />
              <div className="skeleton h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Account Settings</h1>
        <p className="text-text-muted text-sm">Manage your profile and notification preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.form
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-accent" /> Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-accent/30"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Email</label>
            <input
              value={email}
              disabled
              title="Email is managed by your login — contact us to change it"
              className="w-full px-3 py-2.5 bg-bg-primary/30 border border-border rounded-lg text-sm text-text-muted cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Company</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-accent/30"
              placeholder="Your company (optional)"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-accent/30"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !profile}
            className="inline-flex items-center gap-2 px-5 py-2 bg-cta text-cta-text text-sm font-semibold rounded-lg hover:bg-cta-hover transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {savedAt && Date.now() - savedAt < 3500 && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-accent text-xs"
            >
              <Check className="w-3.5 h-3.5" /> Saved
            </motion.span>
          )}
        </div>
      </motion.form>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" /> Notifications
        </h2>
        {toggleRow("Email updates on project progress", emailNotif, setEmailNotif)}
        {toggleRow("New message notifications", messageNotif, setMessageNotif)}
        {toggleRow("Weekly summary report", weeklySummary, setWeeklySummary, false)}
        {toggleRow("SMS alerts for milestone completions", smsAlerts, setSmsAlerts, false)}
        <p className="text-text-muted text-[10px] pt-2 border-t border-border">
          SMS &amp; weekly summary coming soon. Email &amp; in-app notifications apply immediately on save.
        </p>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" /> Security
        </h2>
        <p className="text-text-muted text-xs">
          Password changes are handled through email — click below and we&apos;ll send you a reset link.
        </p>
        <button
          type="button"
          onClick={async () => {
            if (!email) return;
            await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/portal/login`,
            });
            alert("Password reset link sent to your email.");
          }}
          className="px-5 py-2 bg-white/[0.03] border border-border text-sm font-medium rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          Send Password Reset Email
        </button>
      </motion.div>
    </div>
  );
}
