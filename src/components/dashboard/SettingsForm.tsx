"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { ProfileRecord } from "@/lib/portal-data";

interface SettingsFormProps {
  profile: ProfileRecord;
  isAdmin?: boolean;
}

export function SettingsForm({ profile, isAdmin = false }: SettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [companyName, setCompanyName] = useState(profile.company_name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [emailNotifications, setEmailNotifications] = useState(profile.email_notifications ?? true);
  const [messageNotifications, setMessageNotifications] = useState(profile.message_notifications ?? true);

  const inputClasses = isAdmin
    ? "w-full rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#718093] focus:border-[#f2c078]/45 focus:bg-[#10151d]"
    : "w-full rounded-lg border border-border bg-bg-primary/50 px-3 py-2.5 text-sm focus:border-accent/30 focus:outline-none";

  const panelClassName = isAdmin
    ? "space-y-5 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,28,0.96),rgba(10,12,16,0.98))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
    : "glass-card space-y-5 p-6";

  const mutedTextClassName = isAdmin ? "text-sm text-[#9ea7b4]" : "mt-1 text-xs text-text-muted";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/portal/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          companyName,
          phone,
          emailNotifications,
          messageNotifications,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "We couldn't save your settings.");
      }

      setSuccess("Settings saved.");
      startTransition(() => {
        router.refresh();
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={panelClassName}>
        <div>
          <h2 className={isAdmin ? "text-base font-semibold text-white" : "text-sm font-semibold"}>
            {isAdmin ? "Workspace Identity" : "Profile"}
          </h2>
          <p className={mutedTextClassName}>
            {isAdmin
              ? "Set the operator details and notification defaults tied to this admin workspace."
              : "Keep your portal details current so project updates stay clear for everyone."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={isAdmin ? "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d8795]" : "mb-1.5 block text-xs text-text-muted"}>
              Full Name
            </label>
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={isAdmin ? "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d8795]" : "mb-1.5 block text-xs text-text-muted"}>
              Email
            </label>
            <input value={profile.email || ""} disabled className={`${inputClasses} opacity-60`} />
          </div>
          <div>
            <label className={isAdmin ? "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d8795]" : "mb-1.5 block text-xs text-text-muted"}>
              Company
            </label>
            <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={isAdmin ? "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d8795]" : "mb-1.5 block text-xs text-text-muted"}>
              Phone
            </label>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClasses} />
          </div>
        </div>
      </div>

      <div className={isAdmin ? "space-y-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,28,0.96),rgba(10,12,16,0.98))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)]" : "glass-card space-y-4 p-6"}>
        <div>
          <h2 className={isAdmin ? "text-base font-semibold text-white" : "text-sm font-semibold"}>
            Alerts
          </h2>
          <p className={mutedTextClassName}>
            {isAdmin
              ? "Portal messaging stays primary. These controls decide when the admin side also nudges you by email."
              : "Portal messages are the source of truth. Toggle extra alerts to match how you work."}
          </p>
        </div>

        {[
          {
            label: "Email me when the team leaves a portal message",
            enabled: messageNotifications,
            toggle: () => setMessageNotifications((current) => !current),
          },
          {
            label: "Email me for milestone and status updates",
            enabled: emailNotifications,
            toggle: () => setEmailNotifications((current) => !current),
          },
        ].map((preference) => (
          <button
            key={preference.label}
            type="button"
            onClick={preference.toggle}
            className={
              isAdmin
                ? "flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition hover:border-white/16 hover:bg-white/[0.04]"
                : "flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
            }
          >
            <span className={isAdmin ? "text-sm text-[#d3d9e2]" : "text-sm text-text-secondary"}>
              {preference.label}
            </span>
            <span
              className={`w-10 h-5 rounded-full transition-colors ${
                preference.enabled ? (isAdmin ? "bg-[#f2c078]" : "bg-accent") : isAdmin ? "bg-white/12" : "bg-border"
              }`}
            >
              <span
                className={`block mt-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  preference.enabled ? "translate-x-5 ml-0.5" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
        ))}
      </div>

      {error ? <p className={isAdmin ? "text-sm text-[#ff9e9e]" : "text-sm text-red-300"}>{error}</p> : null}
      {success ? <p className={isAdmin ? "text-sm text-[#8ae3b4]" : "text-sm text-accent"}>{success}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className={
          isAdmin
            ? "inline-flex items-center gap-2 rounded-2xl bg-[#f2c078] px-5 py-3 text-sm font-semibold text-[#111318] transition hover:bg-[#ffd8a2] disabled:opacity-60"
            : "inline-flex items-center gap-2 rounded-lg bg-cta px-5 py-2.5 text-sm font-semibold text-cta-text transition-colors hover:bg-cta-hover disabled:opacity-60"
        }
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
