"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Calendar, Clock, CheckCircle, ArrowRight } from "lucide-react";

const projectTypes = [
  "Web App",
  "Mobile App",
  "AI & Automation",
  "Integration",
  "Not Sure",
];

const timeSlots = [
  { value: "morning", label: "Morning (9am - 12pm MT)" },
  { value: "afternoon", label: "Afternoon (12pm - 4pm MT)" },
  { value: "evening", label: "Evening (4pm - 6pm MT)" },
];

export default function BookPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    date: "",
    time: "",
    projectType: "",
    quoteNumber: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClasses =
    "w-full px-4 py-3 bg-bg-primary/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all";
  const labelClasses = "block text-sm font-medium text-text-secondary mb-2";

  if (submitted) {
    return (
      <div className="pt-28 pb-20">
        <div className="max-w-xl mx-auto px-6">
          <ScrollReveal>
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Call Requested!</h1>
              <p className="text-text-secondary leading-relaxed mb-6">
                We&apos;ll confirm via email within 24 hours with a calendar invite.
              </p>
              <p className="text-text-muted text-sm">
                Check your inbox at <span className="text-text-secondary">{form.email}</span> for
                the confirmation.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Book a Call</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Schedule a <span className="gradient-text">Strategy Call</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Pick a time that works for you. We&apos;ll discuss your project, answer questions, and
              figure out if we&apos;re the right fit.
            </p>
          </div>
        </ScrollReveal>

        {/* Info badges */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Clock className="w-4 h-4" /> 30 minutes
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Calendar className="w-4 h-4" /> Video or phone
            </div>
          </div>
        </ScrollReveal>

        {/* Form */}
        <ScrollReveal delay={0.15}>
          <div className="glass-card p-5 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className={labelClasses}>
                    Preferred Date <span className="text-accent">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={form.date}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="time" className={labelClasses}>
                    Preferred Time <span className="text-accent">*</span>
                  </label>
                  <select
                    id="time"
                    name="time"
                    required
                    value={form.time}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                  placeholder="e.g. CL-2026-0042"
                  value={form.quoteNumber}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <p className="text-text-muted text-xs mt-1.5">
                  If you received a quote from our pricing calculator, enter it here.
                </p>
              </div>

              <div>
                <label htmlFor="description" className={labelClasses}>
                  Brief Description <span className="text-accent">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  placeholder="Tell us a bit about your project, your business, and what problems you're trying to solve..."
                  value={form.description}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="group w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-cta text-cta-text font-semibold rounded-xl glow-green hover:bg-cta-hover transition-all"
              >
                Request Call{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </ScrollReveal>

        {/* Bottom note */}
        <ScrollReveal delay={0.2}>
          <p className="text-center text-text-muted text-sm mt-8">
            Free 30-minute call. No obligation. No sales pitch.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
