"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, MessageSquareText } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const projectTypes = [
  "Web App",
  "Mobile App",
  "AI & Automation",
  "Integration",
  "Not Sure",
];

interface ClientIntakeFormProps {
  eyebrow: string;
  title: string;
  description: string;
  quoteNumber?: string;
}

export function ClientIntakeForm({
  eyebrow,
  title,
  description,
  quoteNumber = "",
}: ClientIntakeFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [intakeNumber, setIntakeNumber] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    quoteNumber,
    description: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const inputClasses =
    "w-full px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all";
  const labelClasses = "block text-sm font-medium text-text-secondary mb-2";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: form.name,
          clientEmail: form.email,
          companyName: form.company,
          projectType: form.projectType,
          quoteNumber: form.quoteNumber,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "We couldn't save your request.");
      }

      setIntakeNumber(data.intakeNumber);
      startTransition(() => setSubmitted(true));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-28 pb-20">
        <div className="max-w-xl mx-auto px-6">
          <ScrollReveal>
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Request Received</h1>
              <p className="text-text-secondary leading-relaxed mb-3">
                We saved your intake as <span className="text-accent font-semibold">{intakeNumber}</span>.
              </p>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                The next step is portal access. Use the same email address to create your portal login,
                and we&apos;ll keep the conversation there.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/portal/signup?email=${encodeURIComponent(form.email)}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cta text-cta-text font-semibold rounded-xl hover:bg-cta-hover transition-all"
                >
                  Create Portal Access
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/portal/login?email=${encodeURIComponent(form.email)}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-all"
                >
                  I Already Have an Account
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
              {eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-text-secondary text-lg">{description}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <MessageSquareText className="w-4 h-4" />
              Portal-first communication
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              No calls required
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="glass-card p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={labelClasses}>
                    Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Email <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className={labelClasses}>
                  Company Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  placeholder="Your company or business name"
                  value={form.company}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="projectType" className={labelClasses}>
                  Project Type <span className="text-accent">*</span>
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  required
                  value={form.projectType}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="" disabled>
                    What are you looking to build?
                  </option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quoteNumber" className={labelClasses}>
                  Quote Number <span className="text-text-muted text-xs font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="quoteNumber"
                  name="quoteNumber"
                  placeholder="e.g. CL-20260402-AB12"
                  value={form.quoteNumber}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <p className="text-text-muted text-xs mt-1.5">
                  If you already saved a quote, we&apos;ll connect it to this portal request.
                </p>
              </div>

              <div>
                <label htmlFor="description" className={labelClasses}>
                  Project Details <span className="text-accent">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  placeholder="Tell us what you want to build, what problem it should solve, and anything the client should be able to do inside the product."
                  value={form.description}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                />
                <p className="text-text-muted text-xs mt-1.5">
                  We keep follow-up questions in plain language and continue the conversation inside the portal.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-cta text-cta-text font-semibold rounded-xl glow-green hover:bg-cta-hover transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Request...
                  </>
                ) : (
                  <>
                    Start in the Portal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
