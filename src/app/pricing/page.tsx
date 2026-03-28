"use client";

import { useState, useMemo, useCallback } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Smartphone, Brain, Plug,
  Check, ArrowRight, Calculator, Clock, RefreshCw, Sparkles,
  Zap, Shield, AlertTriangle, ChevronDown, ChevronUp, Users,
  UtensilsCrossed, Wrench, Lightbulb, MessageSquare, Loader2,
  TrendingUp, Star,
} from "lucide-react";
import Link from "next/link";

/* ───────────────────────── Types ───────────────────────── */

type ProjectType = "web" | "mobile" | "ai" | "integration";

interface SubOption {
  id: string;
  label: string;
  description: string;
  price: number;
  timeWeeks: number;
}

interface Feature {
  id: string;
  label: string;
  description: string;
  price: number;
  timeWeeks: number;
  included?: boolean;
  premium?: boolean;
  popular?: boolean;
  popularPct?: number;
  pairsWith?: string[];
  automations?: SubOption[];
}

interface CustomFeatureEstimate {
  description: string;
  complexity: "simple" | "moderate" | "complex";
  priceMin: number;
  priceMax: number;
  timeWeeks: number;
  explanation: string;
}

/* ───────────────────────── Data ───────────────────────── */

const projectTypes = [
  {
    id: "web" as const,
    icon: Globe,
    label: "Web Application",
    basePrice: 4900,
    baseWeeks: 4,
    included: "User auth, admin dashboard, analytics, payment processing (Stripe), email notifications, responsive design, basic SEO",
  },
  {
    id: "mobile" as const,
    icon: Smartphone,
    label: "Mobile App",
    basePrice: 5900,
    baseWeeks: 5,
    included: "iOS & Android, user auth, push notifications, analytics, crash reporting, App Store submission",
  },
  {
    id: "ai" as const,
    icon: Brain,
    label: "AI & Automation",
    basePrice: 3400,
    baseWeeks: 3,
    included: "AI model setup, basic chatbot or automation, testing & training, API integration, monitoring dashboard",
  },
  {
    id: "integration" as const,
    icon: Plug,
    label: "Integrations & Bots",
    basePrice: 1900,
    baseWeeks: 2,
    included: "One platform integration, webhook setup, error handling, monitoring, basic notifications",
  },
];

const industryQuickStarts = [
  {
    id: "restaurant",
    icon: UtensilsCrossed,
    label: "Restaurant Starter",
    description: "Online ordering, booking, AI chatbot, Telegram alerts",
    projectType: "web" as const,
    preselect: ["booking", "cms", "notifications_auto", "ai_chat_web", "telegram_sub"],
  },
  {
    id: "contractor",
    icon: Wrench,
    label: "Contractor Essentials",
    description: "Scheduling, invoicing, GPS tracking, customer portal",
    projectType: "web" as const,
    preselect: ["booking", "portal", "gps_sub", "invoice_auto"],
  },
  {
    id: "startup",
    icon: TrendingUp,
    label: "SaaS / Startup MVP",
    description: "Auth, dashboard, payments, multi-user, analytics",
    projectType: "web" as const,
    preselect: ["multiuser", "advanalytics", "cms"],
  },
];

const featuresByType: Record<ProjectType, Feature[]> = {
  web: [
    // Included
    { id: "auth", label: "User Authentication & Accounts", description: "Login, signup, password reset, role-based access", price: 0, timeWeeks: 0, included: true },
    { id: "dashboard", label: "Admin Dashboard & Analytics", description: "Business metrics, charts, user management, activity logs", price: 0, timeWeeks: 0, included: true },
    { id: "payments", label: "Payment Processing (Stripe)", description: "Accept payments, invoicing, receipts, refunds", price: 0, timeWeeks: 0, included: true },
    { id: "email_notif", label: "Email & SMS Notifications", description: "Order confirmations, reminders, status updates", price: 0, timeWeeks: 0, included: true },
    { id: "responsive", label: "Mobile Responsive Design", description: "Looks great on phone, tablet, desktop", price: 0, timeWeeks: 0, included: true },
    { id: "seo", label: "Basic SEO Setup", description: "Meta tags, sitemap, schema markup, fast loading", price: 0, timeWeeks: 0, included: true },
    // Standard
    { id: "booking", label: "Booking / Scheduling System", description: "Calendar, time slots, auto-reminders, customer self-booking", price: 900, timeWeeks: 1, popular: true, popularPct: 78, pairsWith: ["ai_chat_web", "cms"],
      automations: [
        { id: "booking_remind", label: "Auto-reminder sequence (24hr + 1hr before)", description: "SMS + email reminders", price: 150, timeWeeks: 0 },
        { id: "booking_followup", label: "Post-appointment follow-up", description: "Auto-send review request 24hrs after", price: 100, timeWeeks: 0 },
        { id: "booking_noshow", label: "No-show detection & re-booking", description: "Auto-flag no-shows, send reschedule link", price: 200, timeWeeks: 0.5 },
      ],
    },
    { id: "cms", label: "Content Management (CMS)", description: "Edit text, images, blog posts without code", price: 400, timeWeeks: 0.5, popular: true, popularPct: 72 },
    { id: "search", label: "Advanced Search & Filtering", description: "Search bar, filters, sorting, instant results", price: 350, timeWeeks: 0.5 },
    { id: "reviews", label: "Ratings & Reviews", description: "Customer reviews, star ratings, photo reviews", price: 400, timeWeeks: 0.5,
      automations: [
        { id: "reviews_request", label: "Auto-request reviews after purchase", description: "Email customers 3 days after order", price: 100, timeWeeks: 0 },
      ],
    },
    { id: "multilang", label: "Multi-Language Support", description: "2+ languages with auto-detection", price: 500, timeWeeks: 0.5 },
    // Premium
    { id: "ecommerce", label: "Full E-commerce / Online Store", description: "Product catalog, cart, checkout, inventory, order management", price: 1800, timeWeeks: 1.5, premium: true, popular: true, popularPct: 65,
      automations: [
        { id: "ecom_lowstock", label: "Low-stock alerts", description: "Get notified when inventory drops below threshold", price: 100, timeWeeks: 0 },
        { id: "ecom_abandon", label: "Abandoned cart recovery emails", description: "Auto-email customers who didn't complete checkout", price: 200, timeWeeks: 0.5 },
        { id: "ecom_reorder", label: "Auto-reorder from suppliers", description: "Trigger purchase orders when stock is low", price: 350, timeWeeks: 0.5 },
      ],
    },
    { id: "portal", label: "Client Portal", description: "Secure branded area — docs, invoices, project status", price: 1100, timeWeeks: 1, premium: true, pairsWith: ["multiuser"] },
    { id: "advanalytics", label: "Advanced Analytics & Reports", description: "Custom reports, PDF export, scheduled email reports", price: 800, timeWeeks: 0.5, premium: true,
      automations: [
        { id: "analytics_weekly", label: "Weekly report to your phone", description: "Auto-generated PDF sent every Monday", price: 100, timeWeeks: 0 },
        { id: "analytics_alerts", label: "Anomaly alerts", description: "Get notified when metrics spike or drop unexpectedly", price: 150, timeWeeks: 0 },
      ],
    },
    { id: "multiuser", label: "Multi-User & Team Roles", description: "Staff accounts, permissions, team management, audit logs", price: 600, timeWeeks: 0.5, premium: true },
    { id: "multilocation", label: "Multi-Location Support", description: "Manage multiple branches from one dashboard", price: 900, timeWeeks: 0.5, premium: true },
    { id: "ai_chat_web", label: "AI Chatbot Integration", description: "24/7 AI assistant on your site — answers questions, books appointments", price: 1400, timeWeeks: 1, premium: true, popular: true, popularPct: 61,
      automations: [
        { id: "ai_escalate", label: "Smart escalation to human", description: "AI detects when to hand off to you", price: 200, timeWeeks: 0 },
        { id: "ai_learn", label: "Self-improving from conversations", description: "AI gets smarter from every interaction", price: 300, timeWeeks: 0.5 },
      ],
    },
    { id: "custom_api_web", label: "Custom API / Third-Party Integrations", description: "Connect to CRM, ERP, POS, or any external system", price: 800, timeWeeks: 0.5, premium: true },
  ],
  mobile: [
    { id: "crossplatform", label: "iOS & Android (Cross-Platform)", description: "One codebase, both app stores", price: 0, timeWeeks: 0, included: true },
    { id: "push", label: "Push Notifications", description: "Order updates, reminders, promotions", price: 0, timeWeeks: 0, included: true },
    { id: "auth_mobile", label: "User Auth & Profiles", description: "Login, signup, profile management", price: 0, timeWeeks: 0, included: true },
    { id: "mobileanalytics", label: "Analytics & Crash Reporting", description: "Track usage, crashes, user behavior", price: 0, timeWeeks: 0, included: true },
    { id: "appstore", label: "App Store Submission", description: "We handle Apple & Google Play", price: 0, timeWeeks: 0, included: true },
    { id: "camera", label: "Camera & Photo Upload", description: "Take photos, scan documents, upload images", price: 400, timeWeeks: 0.5, popular: true, popularPct: 70 },
    { id: "gps", label: "GPS & Maps", description: "Location tracking, directions, nearby search", price: 600, timeWeeks: 0.5, popular: true, popularPct: 68 },
    { id: "darkmode", label: "Dark Mode", description: "Light & dark theme with system detection", price: 200, timeWeeks: 0.5 },
    { id: "biometric", label: "Face ID / Fingerprint Login", description: "Biometric authentication", price: 300, timeWeeks: 0.5 },
    { id: "offline", label: "Full Offline Mode", description: "Works without internet, syncs when back online", price: 1000, timeWeeks: 1, premium: true },
    { id: "mobilepay", label: "Apple Pay / Google Pay", description: "Native payment processing", price: 800, timeWeeks: 0.5, premium: true, popular: true, popularPct: 62 },
    { id: "realtime", label: "Real-Time Live Updates", description: "Instant data sync — orders, tracking, chat", price: 700, timeWeeks: 0.5, premium: true },
    { id: "chat_mobile", label: "In-App Messaging", description: "Customer-to-business chat in the app", price: 900, timeWeeks: 0.5, premium: true },
    { id: "ai_mobile", label: "AI Features", description: "Smart suggestions, voice commands, auto-categorization", price: 1200, timeWeeks: 1, premium: true },
  ],
  ai: [
    { id: "setup", label: "AI Model Setup & Config", description: "Set up and fine-tune for your use case", price: 0, timeWeeks: 0, included: true },
    { id: "testing", label: "Testing & Training", description: "Train on your data, test edge cases", price: 0, timeWeeks: 0, included: true },
    { id: "monitor", label: "Monitoring Dashboard", description: "Track performance, accuracy, usage", price: 0, timeWeeks: 0, included: true },
    { id: "chatbot", label: "Customer Service Chatbot", description: "24/7 FAQ answering, appointment booking, inquiry handling", price: 800, timeWeeks: 1, popular: true, popularPct: 82 },
    { id: "workflow", label: "Workflow Automation", description: "Auto-assign tasks, follow-ups, event triggers", price: 600, timeWeeks: 0.5, popular: true, popularPct: 71 },
    { id: "emailai", label: "AI Email Responses", description: "Draft and send intelligent replies automatically", price: 500, timeWeeks: 0.5 },
    { id: "scheduling_ai", label: "Smart Scheduling Optimizer", description: "AI optimizes your calendar, reduces gaps", price: 1000, timeWeeks: 1, premium: true },
    { id: "analytics_ai", label: "Predictive Analytics", description: "Forecast demand, revenue, inventory", price: 1400, timeWeeks: 1, premium: true },
    { id: "docprocess", label: "Document Processing (OCR)", description: "Auto-extract data from invoices, receipts", price: 1100, timeWeeks: 1, premium: true },
    { id: "voice", label: "Voice AI / Phone Bot", description: "AI answers phone calls, handles inquiries", price: 2000, timeWeeks: 1.5, premium: true },
    { id: "custom_model", label: "Custom Trained Model", description: "AI trained on YOUR business data", price: 2500, timeWeeks: 2, premium: true },
  ],
  integration: [
    { id: "one_platform", label: "One Platform Integration", description: "Connect one service of your choice", price: 0, timeWeeks: 0, included: true },
    { id: "webhooks", label: "Webhook Setup & Monitoring", description: "Automated triggers, error handling", price: 0, timeWeeks: 0, included: true },
    { id: "telegram", label: "Telegram Bot", description: "Order alerts, admin commands, customer chat", price: 500, timeWeeks: 0.5, popular: true, popularPct: 74 },
    { id: "whatsapp", label: "WhatsApp Business Bot", description: "Automated customer communication", price: 700, timeWeeks: 0.5, popular: true, popularPct: 69 },
    { id: "stripe_int", label: "Stripe / Square Payments", description: "Payment processing, subscriptions", price: 400, timeWeeks: 0.5 },
    { id: "email_int", label: "Email Marketing Sync", description: "Mailchimp/SendGrid contact & campaign sync", price: 350, timeWeeks: 0.5 },
    { id: "crm", label: "CRM Integration (HubSpot/Salesforce)", description: "Sync leads, contacts, deals", price: 700, timeWeeks: 0.5, premium: true },
    { id: "pos", label: "POS System Connection", description: "Square, Toast, Clover integration", price: 800, timeWeeks: 0.5, premium: true },
    { id: "accounting", label: "QuickBooks / Xero Sync", description: "Auto-sync invoices, payments, expenses", price: 600, timeWeeks: 0.5, premium: true },
    { id: "custom_api", label: "Custom API Development", description: "Build APIs for any third-party system", price: 1000, timeWeeks: 1, premium: true },
    { id: "multi_int", label: "Multi-Platform Real-Time Sync", description: "Keep 3+ systems in sync automatically", price: 1200, timeWeeks: 1, premium: true },
  ],
};

const designOptions = [
  { id: "standard", label: "Clean & Professional", description: "Modern, responsive. Based on our proven templates.", price: 0 },
  { id: "custom", label: "Custom Branded", description: "Unique to your brand. 2 concepts, you pick.", price: 1200 },
  { id: "premium", label: "Premium / Award-Level", description: "Animations, micro-interactions, 3D elements.", price: 3000 },
];

const revisionOptions = [
  { id: "2", label: "2 Rounds", price: 0 },
  { id: "5", label: "5 Rounds", price: 400 },
  { id: "unlimited", label: "Unlimited", price: 900 },
];

const maintenancePlans = [
  { id: "none", label: "No Maintenance", description: "You handle it", price: 0 },
  { id: "basic", label: "Basic — $149/mo", description: "Hosting, SSL, security, monitoring, 2hrs support/mo", price: 149 },
  { id: "standard", label: "Standard — $299/mo", description: "Basic + bug fixes, tweaks, weekly backups, 5hrs/mo", price: 299 },
  { id: "premium", label: "Premium — $499/mo", description: "Standard + priority, new features, analytics, 10hrs/mo", price: 499 },
];

/* ───────────────────────── Component ───────────────────────── */

export default function PricingPage() {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedAutomations, setSelectedAutomations] = useState<string[]>([]);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [design, setDesign] = useState("standard");
  const [revisions, setRevisions] = useState("2");
  const [maintenance, setMaintenance] = useState("none");
  const [rushDelivery, setRushDelivery] = useState(false);

  // AI custom feature
  const [customText, setCustomText] = useState("");
  const [customEstimate, setCustomEstimate] = useState<CustomFeatureEstimate | null>(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customAdded, setCustomAdded] = useState(false);

  const currentType = projectTypes.find((p) => p.id === projectType);
  const features = projectType ? featuresByType[projectType] : [];
  const includedFeatures = features.filter((f) => f.included);
  const standardAddons = features.filter((f) => !f.included && !f.premium);
  const premiumAddons = features.filter((f) => f.premium);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
    // Remove automations if feature is deselected
    if (selectedFeatures.includes(id)) {
      const feat = features.find((f) => f.id === id);
      if (feat?.automations) {
        setSelectedAutomations((prev) =>
          prev.filter((a) => !feat.automations!.some((auto) => auto.id === a))
        );
      }
    }
  };

  const toggleAutomation = (id: string) => {
    setSelectedAutomations((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const applyQuickStart = (qs: typeof industryQuickStarts[0]) => {
    setProjectType(qs.projectType);
    setSelectedFeatures(qs.preselect);
    setStep(1);
  };

  const analyzeCustomFeature = useCallback(async () => {
    if (!customText.trim()) return;
    setCustomLoading(true);
    setCustomEstimate(null);
    try {
      const res = await fetch("/api/analyze-feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: customText, projectType }),
      });
      const data = await res.json();
      if (data.error) {
        setCustomEstimate({
          description: customText,
          complexity: "moderate",
          priceMin: 500,
          priceMax: 2000,
          timeWeeks: 1,
          explanation: "We couldn't analyze this automatically. This is a rough estimate — book a free call for exact pricing.",
        });
      } else {
        setCustomEstimate(data);
      }
    } catch {
      setCustomEstimate({
        description: customText,
        complexity: "moderate",
        priceMin: 500,
        priceMax: 2000,
        timeWeeks: 1,
        explanation: "We couldn't analyze this automatically. This is a rough estimate — book a free call for exact pricing.",
      });
    }
    setCustomLoading(false);
  }, [customText, projectType]);

  const pricing = useMemo(() => {
    if (!currentType) return { total: 0, weeks: 0, monthly: 0 };

    const featureCost = selectedFeatures.reduce((sum, id) => {
      const f = features.find((feat) => feat.id === id);
      return sum + (f?.price || 0);
    }, 0);
    const featureWeeks = selectedFeatures.reduce((sum, id) => {
      const f = features.find((feat) => feat.id === id);
      return sum + (f?.timeWeeks || 0);
    }, 0);
    const automationCost = selectedAutomations.reduce((sum, id) => {
      for (const f of features) {
        const auto = f.automations?.find((a) => a.id === id);
        if (auto) return sum + auto.price;
      }
      return sum;
    }, 0);
    const automationWeeks = selectedAutomations.reduce((sum, id) => {
      for (const f of features) {
        const auto = f.automations?.find((a) => a.id === id);
        if (auto) return sum + auto.timeWeeks;
      }
      return sum;
    }, 0);

    const designCost = designOptions.find((d) => d.id === design)?.price || 0;
    const revisionCost = revisionOptions.find((r) => r.id === revisions)?.price || 0;
    const customCost = customAdded && customEstimate ? Math.round((customEstimate.priceMin + customEstimate.priceMax) / 2) : 0;
    const customWeeks = customAdded && customEstimate ? customEstimate.timeWeeks : 0;

    let subtotal = currentType.basePrice + featureCost + automationCost + designCost + revisionCost + customCost;
    let weeks = Math.ceil(currentType.baseWeeks + featureWeeks + automationWeeks + customWeeks);

    if (rushDelivery) {
      subtotal = Math.round(subtotal * 1.4);
      weeks = Math.max(1, Math.ceil(weeks * 0.6));
    }

    const monthly = maintenancePlans.find((m) => m.id === maintenance)?.price || 0;
    return { total: subtotal, weeks, monthly };
  }, [currentType, selectedFeatures, selectedAutomations, features, design, revisions, rushDelivery, maintenance, customAdded, customEstimate]);

  /* ── Render helpers ── */

  const renderFeatureRow = (f: Feature, type: "standard" | "premium") => {
    const isSelected = selectedFeatures.includes(f.id);
    const isExpanded = expandedFeature === f.id;
    const hasAutomations = f.automations && f.automations.length > 0;
    const borderClass = type === "premium"
      ? (isSelected ? "border-accent-secondary/30 bg-accent-secondary/5" : "hover:bg-white/[0.03]")
      : (isSelected ? "border-accent/30 bg-accent/5" : "hover:bg-white/[0.03]");
    const checkClass = type === "premium"
      ? (isSelected ? "border-accent-secondary bg-accent-secondary" : "border-border")
      : (isSelected ? "border-accent bg-accent" : "border-border");

    // Find pairs
    const pairsMessage = isSelected && f.pairsWith && f.pairsWith.length > 0
      ? f.pairsWith
          .filter((pid) => !selectedFeatures.includes(pid))
          .map((pid) => features.find((ff) => ff.id === pid)?.label)
          .filter(Boolean)
      : [];

    return (
      <div key={f.id} className="space-y-0">
        <button
          onClick={() => toggleFeature(f.id)}
          className={`w-full glass-card p-4 text-left flex items-center gap-3 transition-all ${borderClass}`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checkClass}`}>
            {isSelected && <Check className="w-3 h-3 text-bg-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{f.label}</span>
              {f.popular && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-accent/10 rounded text-[9px] text-accent font-semibold">
                  <Star className="w-2.5 h-2.5" />{f.popularPct}% add this
                </span>
              )}
              {type === "premium" && (
                <span className="px-1.5 py-0.5 bg-accent-secondary/15 rounded text-[9px] text-accent-secondary font-semibold">PREMIUM</span>
              )}
            </div>
            <p className="text-text-muted text-xs mt-0.5">{f.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold whitespace-nowrap ${type === "premium" ? "text-accent-secondary" : "text-accent"}`}>
              +${f.price.toLocaleString()}
            </span>
            {hasAutomations && isSelected && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedFeature(isExpanded ? null : f.id); }}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
              </button>
            )}
          </div>
        </button>

        {/* Pairs suggestion */}
        {pairsMessage.length > 0 && (
          <div className="px-4 py-2 text-[11px] text-accent/70 flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3" />
            Works great with: {pairsMessage.join(", ")}
          </div>
        )}

        {/* Automation sub-options */}
        <AnimatePresence>
          {hasAutomations && isSelected && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="ml-8 space-y-1.5 py-2">
                <p className="text-[10px] text-accent uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2">
                  <Zap className="w-3 h-3" /> Add Automations
                </p>
                {f.automations!.map((auto) => (
                  <button
                    key={auto.id}
                    onClick={() => toggleAutomation(auto.id)}
                    className={`w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all text-xs ${
                      selectedAutomations.includes(auto.id)
                        ? "bg-accent/10 border border-accent/20"
                        : "bg-bg-primary/40 border border-transparent hover:border-border"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedAutomations.includes(auto.id) ? "border-accent bg-accent" : "border-border"
                    }`}>
                      {selectedAutomations.includes(auto.id) && <Check className="w-2.5 h-2.5 text-bg-primary" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{auto.label}</span>
                      <span className="text-text-muted ml-2">{auto.description}</span>
                    </div>
                    <span className="text-accent font-semibold">+${auto.price}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              Interactive Pricing
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Build Your Quote in <span className="gradient-text">60 Seconds</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Essentials included. Add what you need. See the price change live.
            </p>
          </div>
        </ScrollReveal>

        {/* Progress */}
        <div className="flex gap-2 mb-10 max-w-lg mx-auto">
          {["Project Type", "Features", "Design & Extras", "Summary"].map((label, i) => (
            <button key={label} onClick={() => { if (i <= step && (i === 0 || projectType)) setStep(i); }} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-border"}`} />
              <div className={`text-[10px] mt-1.5 text-center ${i <= step ? "text-accent" : "text-text-muted"}`}>{label}</div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* ── Step 0: Project Type ── */}
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  {/* Quick starts */}
                  <h2 className="text-lg font-bold mb-1">Quick Start</h2>
                  <p className="text-text-muted text-sm mb-4">Pre-configured for your industry. You can still change everything.</p>
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {industryQuickStarts.map((qs) => (
                      <button
                        key={qs.id}
                        onClick={() => applyQuickStart(qs)}
                        className="glass-card p-4 text-left group hover:border-accent/20 transition-all"
                      >
                        <qs.icon className="w-5 h-5 text-accent mb-2" />
                        <h4 className="font-semibold text-sm group-hover:text-accent transition-colors">{qs.label}</h4>
                        <p className="text-text-muted text-[11px] mt-1">{qs.description}</p>
                      </button>
                    ))}
                  </div>

                  <h2 className="text-lg font-bold mb-1">Or Choose Your Project Type</h2>
                  <p className="text-text-muted text-sm mb-4">Each includes essentials at no extra cost.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {projectTypes.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setProjectType(p.id); setSelectedFeatures([]); setSelectedAutomations([]); setStep(1); }}
                        className="glass-card p-6 text-left group hover:border-accent/20 transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                          <p.icon className="w-5 h-5 text-accent" />
                        </div>
                        <h3 className="font-semibold mb-1">{p.label}</h3>
                        <p className="text-accent text-sm font-semibold mb-2">From ${p.basePrice.toLocaleString()}</p>
                        <p className="text-text-muted text-xs leading-relaxed">
                          <span className="text-green-400 font-medium">Included free:</span> {p.included}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Step 1: Features ── */}
              {step === 1 && projectType && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Choose Your Features</h2>
                    <button onClick={() => setStep(0)} className="text-text-muted text-sm hover:text-text-primary">&larr; Change type</button>
                  </div>
                  <p className="text-text-muted text-sm mb-6">Green = free. Click features to add. Expand for automation options.</p>

                  {/* Included */}
                  <div className="mb-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">
                      <Check className="w-4 h-4" /> Included Free
                    </h3>
                    <div className="space-y-1.5">
                      {includedFeatures.map((f) => (
                        <div key={f.id} className="glass-card p-3 flex items-center gap-3 border-green-400/10 bg-green-400/[0.03]">
                          <div className="w-4 h-4 rounded border-2 border-green-400 bg-green-400 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-bg-primary" />
                          </div>
                          <span className="font-medium text-sm flex-1">{f.label}</span>
                          <span className="text-green-400 text-xs font-semibold">FREE</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Standard */}
                  {standardAddons.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Add-ons</h3>
                      <div className="space-y-2">
                        {standardAddons.map((f) => renderFeatureRow(f, "standard"))}
                      </div>
                    </div>
                  )}

                  {/* Premium */}
                  <div className="mb-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-secondary uppercase tracking-wider mb-3">
                      <Sparkles className="w-4 h-4" /> Premium Upgrades
                    </h3>
                    <div className="space-y-2">
                      {premiumAddons.map((f) => renderFeatureRow(f, "premium"))}
                    </div>
                  </div>

                  {/* Custom AI Feature */}
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-3">
                      <MessageSquare className="w-4 h-4" /> Need Something Custom?
                    </h3>
                    <div className="glass-card p-5 space-y-4">
                      <p className="text-text-muted text-sm">
                        Describe what you need in plain English. Our AI will analyze the complexity and give you a price estimate instantly.
                      </p>
                      <textarea
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        rows={3}
                        placeholder="e.g., I want the system to automatically text customers when their appointment is tomorrow, and if they don't confirm, reschedule to the next available slot..."
                        className="w-full px-4 py-3 bg-bg-primary/60 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-all resize-none"
                      />
                      <button
                        onClick={analyzeCustomFeature}
                        disabled={!customText.trim() || customLoading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/15 border border-accent/20 rounded-xl text-accent text-sm font-semibold hover:bg-accent/25 transition-all disabled:opacity-40"
                      >
                        {customLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                        {customLoading ? "Analyzing..." : "Analyze & Price This"}
                      </button>

                      {/* AI Estimate Result */}
                      <AnimatePresence>
                        {customEstimate && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-3 border-t border-border">
                            <div className="flex items-center gap-3">
                              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                customEstimate.complexity === "simple" ? "bg-green-400/15 text-green-400" :
                                customEstimate.complexity === "moderate" ? "bg-accent/15 text-accent" :
                                "bg-accent-secondary/15 text-accent-secondary"
                              }`}>
                                {customEstimate.complexity.charAt(0).toUpperCase() + customEstimate.complexity.slice(1)} complexity
                              </div>
                              <span className="text-sm text-text-secondary">~{customEstimate.timeWeeks} week{customEstimate.timeWeeks !== 1 ? "s" : ""} additional</span>
                            </div>
                            <div className="text-xl font-bold gradient-text-gold">
                              ${customEstimate.priceMin.toLocaleString()} – ${customEstimate.priceMax.toLocaleString()}
                            </div>
                            <p className="text-text-muted text-xs leading-relaxed">{customEstimate.explanation}</p>
                            {!customAdded ? (
                              <button
                                onClick={() => setCustomAdded(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-bg-primary rounded-lg text-sm font-semibold hover:bg-accent-hover transition-all"
                              >
                                <Check className="w-3.5 h-3.5" /> Add to Quote
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                <Check className="w-4 h-4" /> Added to your quote
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <button onClick={() => setStep(2)} className="px-6 py-3 bg-accent text-bg-primary font-semibold rounded-xl glow-gold hover:bg-accent-hover transition-all text-sm">
                    Next: Design & Extras &rarr;
                  </button>
                </motion.div>
              )}

              {/* ── Step 2: Design, Rush, Maintenance ── */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Design, Delivery & Support</h2>
                    <button onClick={() => setStep(1)} className="text-text-muted text-sm hover:text-text-primary">&larr; Back</button>
                  </div>

                  {/* Design */}
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Design Level</h3>
                  <div className="space-y-2 mb-8">
                    {designOptions.map((d) => (
                      <button key={d.id} onClick={() => setDesign(d.id)} className={`w-full glass-card p-4 text-left flex items-center gap-3 transition-all ${design === d.id ? "border-accent/30 bg-accent/5" : "hover:bg-white/[0.03]"}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${design === d.id ? "border-accent" : "border-border"}`}>
                          {design === d.id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between"><span className="font-medium text-sm">{d.label}</span><span className="text-accent text-sm font-semibold">{d.price === 0 ? "Included" : `+$${d.price.toLocaleString()}`}</span></div>
                          <p className="text-text-muted text-xs mt-0.5">{d.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Revisions */}
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Revisions</h3>
                  <div className="flex gap-3 mb-8">
                    {revisionOptions.map((r) => (
                      <button key={r.id} onClick={() => setRevisions(r.id)} className={`flex-1 glass-card p-4 text-center transition-all ${revisions === r.id ? "border-accent/30 bg-accent/5" : "hover:bg-white/[0.03]"}`}>
                        <div className="font-medium text-sm">{r.label}</div>
                        <div className="text-accent text-xs font-semibold mt-1">{r.price === 0 ? "Free" : `+$${r.price}`}</div>
                      </button>
                    ))}
                  </div>

                  {/* Rush */}
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Delivery Speed</h3>
                  <button
                    onClick={() => setRushDelivery(!rushDelivery)}
                    className={`w-full glass-card p-5 text-left flex items-center gap-4 mb-8 transition-all ${rushDelivery ? "border-orange-400/30 bg-orange-400/5" : "hover:bg-white/[0.03]"}`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${rushDelivery ? "border-orange-400 bg-orange-400" : "border-border"}`}>
                      {rushDelivery && <Check className="w-3 h-3 text-bg-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-400" />
                        <span className="font-medium text-sm">Rush Delivery</span>
                        <span className="px-1.5 py-0.5 bg-orange-400/15 rounded text-[9px] text-orange-400 font-semibold">40% surcharge · ~40% faster</span>
                      </div>
                      <p className="text-text-muted text-xs mt-1">Dedicated team, extended hours, priority in our pipeline.</p>
                    </div>
                  </button>

                  {/* Maintenance */}
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                    <Shield className="w-4 h-4" /> Ongoing Maintenance
                  </h3>
                  <div className="space-y-2 mb-8">
                    {maintenancePlans.map((m) => (
                      <button key={m.id} onClick={() => setMaintenance(m.id)} className={`w-full glass-card p-4 text-left flex items-center gap-3 transition-all ${maintenance === m.id ? "border-accent/30 bg-accent/5" : "hover:bg-white/[0.03]"}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${maintenance === m.id ? "border-accent" : "border-border"}`}>
                          {maintenance === m.id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm">{m.label}</span>
                          <p className="text-text-muted text-xs mt-0.5">{m.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button onClick={() => setStep(3)} className="px-6 py-3 bg-accent text-bg-primary font-semibold rounded-xl glow-gold hover:bg-accent-hover transition-all text-sm">
                    View Summary &rarr;
                  </button>
                </motion.div>
              )}

              {/* ── Step 3: Summary ── */}
              {step === 3 && currentType && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Your Quote</h2>
                    <button onClick={() => setStep(2)} className="text-text-muted text-sm hover:text-text-primary">&larr; Back</button>
                  </div>

                  <div className="glass-card p-6 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-border">
                      <div><h3 className="font-semibold">{currentType.label}</h3><p className="text-green-400 text-[11px] mt-0.5">Includes: auth, dashboard, payments, notifications, responsive, SEO</p></div>
                      <span className="font-semibold">${currentType.basePrice.toLocaleString()}</span>
                    </div>

                    {selectedFeatures.filter((id) => !features.find((f) => f.id === id)?.included).length > 0 && (
                      <div className="space-y-1.5 pb-4 border-b border-border">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Features</h4>
                        {selectedFeatures.map((id) => {
                          const f = features.find((feat) => feat.id === id);
                          if (!f || f.included || f.price === 0) return null;
                          return (
                            <div key={id} className="flex justify-between text-sm">
                              <span className="text-text-secondary">{f.label}</span>
                              <span className="text-text-secondary">${f.price.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {selectedAutomations.length > 0 && (
                      <div className="space-y-1.5 pb-4 border-b border-border">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Automations</h4>
                        {selectedAutomations.map((id) => {
                          for (const f of features) {
                            const auto = f.automations?.find((a) => a.id === id);
                            if (auto) return (
                              <div key={id} className="flex justify-between text-sm">
                                <span className="text-text-secondary">{auto.label}</span>
                                <span className="text-text-secondary">${auto.price.toLocaleString()}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}

                    {customAdded && customEstimate && (
                      <div className="pb-4 border-b border-border">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Custom Feature</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">{customEstimate.description.slice(0, 60)}...</span>
                          <span className="text-text-secondary">~${Math.round((customEstimate.priceMin + customEstimate.priceMax) / 2).toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 pb-4 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">{designOptions.find((d) => d.id === design)?.label}</span>
                        <span className="text-text-secondary">{(designOptions.find((d) => d.id === design)?.price || 0) === 0 ? "Included" : `$${designOptions.find((d) => d.id === design)?.price.toLocaleString()}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">{revisionOptions.find((r) => r.id === revisions)?.label} revisions</span>
                        <span className="text-text-secondary">{(revisionOptions.find((r) => r.id === revisions)?.price || 0) === 0 ? "Included" : `$${revisionOptions.find((r) => r.id === revisions)?.price.toLocaleString()}`}</span>
                      </div>
                    </div>

                    {rushDelivery && (
                      <div className="flex justify-between text-sm pb-4 border-b border-border">
                        <span className="flex items-center gap-2 text-orange-400"><Zap className="w-3.5 h-3.5" /> Rush Delivery (40%)</span>
                        <span className="text-orange-400">Applied</span>
                      </div>
                    )}

                    <div className="pt-2 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-3xl font-bold gradient-text-gold">${pricing.total.toLocaleString()}</div>
                          <p className="text-text-muted text-xs">One-time project cost</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 text-accent-secondary"><Clock className="w-4 h-4" /><span className="font-semibold">~{pricing.weeks} weeks</span></div>
                          <p className="text-text-muted text-xs">Estimated delivery</p>
                        </div>
                      </div>
                      {pricing.monthly > 0 && (
                        <div className="flex justify-between items-center pt-3 border-t border-border">
                          <div><div className="text-lg font-bold text-accent">+${pricing.monthly}/mo</div><p className="text-text-muted text-xs">Ongoing maintenance</p></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="glass-card p-4 mt-4 flex items-start gap-3 border-amber-400/10 bg-amber-400/[0.03]">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-text-muted text-xs leading-relaxed">
                      This is an estimate. Final price is locked after a free strategy call. No surprises.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link href="/contact" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-bg-primary font-semibold rounded-xl glow-gold hover:bg-accent-hover transition-all">
                      Get This Built <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button onClick={() => { setStep(0); setProjectType(null); setSelectedFeatures([]); setSelectedAutomations([]); setDesign("standard"); setRevisions("2"); setMaintenance("none"); setRushDelivery(false); setCustomEstimate(null); setCustomAdded(false); setCustomText(""); }}
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-glass border border-glass-border rounded-xl text-text-secondary hover:text-text-primary transition-all font-medium">
                      <RefreshCw className="w-4 h-4" /> Start Over
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Sticky Price Card ── */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2 text-accent"><Sparkles className="w-5 h-5" /><h3 className="font-semibold">Live Estimate</h3></div>
                <div>
                  <div className="text-4xl font-bold gradient-text-gold">${pricing.total.toLocaleString()}</div>
                  <p className="text-text-muted text-sm mt-1">One-time cost</p>
                </div>
                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent-secondary" />~{pricing.weeks} weeks</div>
                  <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-accent" />{revisionOptions.find((r) => r.id === revisions)?.label} revisions</div>
                  {rushDelivery && <div className="flex items-center gap-2 text-orange-400"><Zap className="w-4 h-4" />Rush delivery</div>}
                  {pricing.monthly > 0 && <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" />+${pricing.monthly}/mo maintenance</div>}
                  {selectedFeatures.filter((id) => !features.find((f) => f.id === id)?.included).length > 0 && (
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" />{selectedFeatures.filter((id) => !features.find((f) => f.id === id)?.included).length} add-ons selected</div>
                  )}
                  {selectedAutomations.length > 0 && (
                    <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-accent" />{selectedAutomations.length} automation{selectedAutomations.length > 1 ? "s" : ""}</div>
                  )}
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-text-muted text-xs">Estimate only. Exact price confirmed after free call.</p>
                </div>
                <Link href="/contact" className="block w-full text-center px-6 py-3 bg-accent text-bg-primary font-semibold rounded-xl glow-gold hover:bg-accent-hover transition-all text-sm">
                  Book Free Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
