"use client";

import { motion } from "framer-motion";
import { User, Mail, Building, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Account Settings</h1>
        <p className="text-text-muted text-sm">Manage your profile and notification preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-5">
        <h2 className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4 text-accent" /> Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Full Name</label>
            <input defaultValue="David Barth" className="w-full px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-accent/30" />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Email</label>
            <input defaultValue="david@bellarestaurant.com" className="w-full px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-accent/30" />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Company</label>
            <input defaultValue="Bella Restaurant" className="w-full px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-accent/30" />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Phone</label>
            <input defaultValue="+1 (555) 987-6543" className="w-full px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-accent/30" />
          </div>
        </div>
        <button className="px-5 py-2 bg-accent text-bg-primary text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors">
          Save Changes
        </button>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-4">
        <h2 className="text-sm font-semibold flex items-center gap-2"><Bell className="w-4 h-4 text-accent" /> Notifications</h2>
        {[
          { label: "Email updates on project progress", enabled: true },
          { label: "SMS alerts for milestone completions", enabled: false },
          { label: "Weekly summary report", enabled: true },
          { label: "New message notifications", enabled: true },
        ].map((pref) => (
          <div key={pref.label} className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{pref.label}</span>
            <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${pref.enabled ? "bg-accent" : "bg-border"}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mt-0.5 ${pref.enabled ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 space-y-4">
        <h2 className="text-sm font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> Security</h2>
        <button className="px-5 py-2 bg-white/[0.03] border border-border text-sm font-medium rounded-lg hover:bg-white/[0.06] transition-colors">
          Change Password
        </button>
      </motion.div>
    </div>
  );
}
