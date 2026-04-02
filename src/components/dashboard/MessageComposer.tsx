"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

interface MessageComposerProps {
  projectId: string;
  variant?: "client" | "admin";
  label?: string;
  placeholder?: string;
}

export function MessageComposer({
  projectId,
  variant = "client",
  label,
  placeholder,
}: MessageComposerProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = variant === "admin";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!value.trim()) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/portal/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          body: value.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "We couldn't send your message.");
      }

      setValue("");
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
    <form
      onSubmit={handleSubmit}
      className={
        isAdmin
          ? "space-y-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,21,28,0.96),rgba(10,12,16,0.98))] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
          : "glass-card space-y-3 p-4"
      }
    >
      <div>
        <label
          className={
            isAdmin
              ? "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d8795]"
              : "mb-1.5 block text-xs text-text-muted"
          }
        >
          {label || "Send a portal message"}
        </label>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={4}
          placeholder={placeholder || "Ask a question, confirm a detail, or send feedback here."}
          className={
            isAdmin
              ? "w-full resize-none rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#718093] focus:border-[#f2c078]/45 focus:bg-[#10151d]"
              : "w-full resize-none rounded-xl border border-border bg-bg-primary/50 px-3 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
          }
        />
      </div>
      {error ? <p className={isAdmin ? "text-sm text-[#ff9e9e]" : "text-xs text-red-300"}>{error}</p> : null}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || !value.trim()}
          className={
            isAdmin
              ? "inline-flex items-center gap-2 rounded-2xl bg-[#f2c078] px-4 py-2.5 text-sm font-semibold text-[#111318] transition hover:bg-[#ffd8a2] disabled:opacity-60"
              : "inline-flex items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-text transition-colors hover:bg-cta-hover disabled:opacity-60"
          }
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {saving ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
