"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Smartphone, Brain, Plug,
  Check, ArrowRight, Calculator, Clock, RefreshCw, Sparkles,
  Zap, Shield, AlertTriangle, ChevronDown, ChevronUp, Users,
  UtensilsCrossed, Wrench, Lightbulb, MessageSquare, Loader2,
  TrendingUp, Star, Upload,
} from "lucide-react";
import Link from "next/link";
import { getTemplatesForContext, type DesignTemplate } from "@/components/DesignTemplates";
import { supabase } from "@/lib/supabase";

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
    basePrice: 1900,
    baseWeeks: 2,
    included: "Simple chatbot OR one automation, trained on your data, embedded on your site, monitoring dashboard",
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
    // Included in $1,900 base (AI Starter)
    { id: "ai_setup", label: "AI Model Setup & Configuration", description: "Set up, configure, and fine-tune for your use case", price: 0, timeWeeks: 0, included: true },
    { id: "ai_training", label: "Training on Your Data", description: "Feed it your FAQs, docs, pricing — AI learns your business", price: 0, timeWeeks: 0, included: true },
    { id: "ai_embed", label: "Website Embed / Deployment", description: "Chatbot or automation live on your site or platform", price: 0, timeWeeks: 0, included: true },
    { id: "ai_monitor", label: "Monitoring Dashboard", description: "Track conversations, accuracy, usage stats", price: 0, timeWeeks: 0, included: true },
    // Standard add-ons
    { id: "ai_extra_channel", label: "Additional AI Channel", description: "Add AI to a second platform (e.g., chatbot on site + WhatsApp bot)", price: 500, timeWeeks: 0.5, popular: true, popularPct: 68 },
    { id: "ai_workflow", label: "Workflow Automation", description: "Auto-assign tasks, send follow-ups, trigger actions on events", price: 600, timeWeeks: 0.5, popular: true, popularPct: 71 },
    { id: "ai_email", label: "AI Email Responses", description: "Draft and send intelligent replies to customer emails automatically", price: 500, timeWeeks: 0.5 },
    { id: "ai_booking", label: "AI Appointment Booking", description: "Chatbot books appointments directly into your calendar", price: 400, timeWeeks: 0.5 },
    // Premium add-ons (complex integrations)
    { id: "ai_integration", label: "Connect to Your Existing Software", description: "Integrate AI with your CRM, POS, or any existing system via API", price: 1200, timeWeeks: 1, premium: true, popular: true, popularPct: 58 },
    { id: "ai_scheduling", label: "Smart Scheduling Optimizer", description: "AI optimizes your calendar, reduces gaps, suggests best times", price: 1000, timeWeeks: 1, premium: true },
    { id: "ai_analytics", label: "Predictive Analytics & Forecasting", description: "Forecast demand, revenue, inventory using your historical data", price: 1400, timeWeeks: 1, premium: true },
    { id: "ai_ocr", label: "Document Processing (OCR)", description: "Auto-extract data from invoices, receipts, forms", price: 1100, timeWeeks: 1, premium: true },
    { id: "ai_voice", label: "Voice AI / Phone Bot", description: "AI answers phone calls and handles basic inquiries", price: 2000, timeWeeks: 1.5, premium: true },
    { id: "ai_custom_model", label: "Custom Trained Model", description: "AI model trained specifically on YOUR business data for maximum accuracy", price: 2500, timeWeeks: 2, premium: true },
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
  { id: "none", label: "No Maintenance", description: "You handle updates and hosting yourself", price: 0, badge: null },
  { id: "basic", label: "Basic — $149/mo", description: "Hosting, SSL, security updates, uptime monitoring, 2hrs support/mo", price: 149, badge: "Recommended" },
  { id: "standard", label: "Standard — $299/mo", description: "Basic + bug fixes, minor tweaks, weekly backups, 5hrs support/mo", price: 299, badge: null },
  { id: "premium", label: "Premium — $499/mo", description: "Standard + priority support, new features, analytics review, 10hrs/mo", price: 499, badge: null },
];

/* ───────────────────────── Component ───────────────────────── */

export default function PricingPage() {
  const router = useRouter();
  const [step, _setStep] = useState(0);
  const setStep = (s: number) => { _setStep(s); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedAutomations, setSelectedAutomations] = useState<string[]>([]);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [design, setDesign] = useState("standard");
  const [revisions, setRevisions] = useState("2");
  const [maintenance, setMaintenance] = useState("none");
  const [rushDelivery, setRushDelivery] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<"full" | "5050" | "3mo" | "6mo">("full");

  // Save quote
  const [saveNotes, setSaveNotes] = useState("");
  const [saveFiles, setSaveFiles] = useState<File[]>([]);
  const [saveName, setSaveName] = useState("");
  const [saveEmail, setSaveEmail] = useState("");
  const [savePhone, setSavePhone] = useState("");
  const [saveCompany, setSaveCompany] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedQuoteNumber, setSavedQuoteNumber] = useState<string | null>(null);

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

  const saveQuote = async () => {
    if (!saveName.trim() || !saveEmail.trim() || !currentType) return;
    setSaveLoading(true);
    try {
      const res = await fetch("/api/save-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: saveName,
          clientEmail: saveEmail,
          clientPhone: savePhone,
          companyName: saveCompany,
          projectType: currentType.id,
          selectedFeatures,
          selectedAutomations,
          customFeatureDescription: customText || null,
          customFeaturePrice: customAdded && customEstimate ? Math.round((customEstimate.priceMin + customEstimate.priceMax) / 2) : 0,
          designLevel: design,
          selectedTemplate,
          revisionRounds: revisions,
          rushDelivery,
          maintenancePlan: maintenance,
          paymentPlan,
          totalPrice: pricing.total,
          monthlyPrice: pricing.monthly,
          estimatedWeeks: pricing.weeks,
        }),
      });
      const data = await res.json();
      if (data.quoteId) {
        // Check if user is already logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Already authenticated — go straight to dashboard
          router.push(`/dashboard?quoteId=${data.quoteId}`);
        } else {
          // Not authenticated — go to signup
          router.push(`/portal/signup?quoteId=${data.quoteId}`);
        }
        return;
      }
      if (data.quoteNumber) setSavedQuoteNumber(data.quoteNumber);
    } catch (e) {
      console.error("Failed to save quote:", e);
    }
    setSaveLoading(false);
  };

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
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setExpandedFeature(isExpanded ? null : f.id); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setExpandedFeature(isExpanded ? null : f.id); } }}
                className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
              </span>
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
          {["Project", "Features", "Look & Feel", "Extras", "Summary"].map((label, i) => (
            <button key={label} onClick={() => { if (i <= step && (i === 0 || projectType)) setStep(i); }} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-border"}`} />
              <div className={`text-[10px] mt-1.5 text-center ${i <= step ? "text-accent" : "text-text-muted"}`}>{label}</div>
            </button>
          ))}
        </div>

        {/* Project type indicator - shows after selection */}
        {step > 0 && currentType && (
          <div className="flex items-center gap-3 mb-8 px-4 py-3 bg-white/[0.02] border border-border rounded-xl max-w-5xl mx-auto">
            <currentType.icon className="w-5 h-5 text-accent" />
            <div className="flex-1">
              <span className="text-sm font-medium">{currentType.label}</span>
              <span className="text-text-muted text-xs ml-2">from ${currentType.basePrice.toLocaleString()}</span>
            </div>
            <button onClick={() => setStep(0)} className="text-text-muted text-xs hover:text-text-primary transition-colors">Change</button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* ── Step 0: Project Type ── */}
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  {/* Quick starts */}
                  <h2 className="text-lg font-bold mb-1">Quick Start</h2>
                  <p className="text-text-muted text-sm mb-4">Pre-configured for your industry. You can still change everything.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
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
                          <span className="text-accent font-medium">Included free:</span> {p.included}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Step 1: Features ── */}
              {step === 1 && projectType && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setStep(0)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-border rounded-lg text-text-secondary text-xs hover:bg-white/10 hover:text-text-primary transition-all"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
                    <h2 className="text-xl font-bold">Choose Your Features</h2>
                  </div>
                  <p className="text-text-muted text-sm mb-6">Green = free. Click features to add. Expand for automation options.</p>

                  {/* Included features moved to sidebar */}

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
                                customEstimate.complexity === "simple" ? "bg-accent/15 text-green-400" :
                                customEstimate.complexity === "moderate" ? "bg-accent/15 text-accent" :
                                "bg-accent-secondary/15 text-accent-secondary"
                              }`}>
                                {customEstimate.complexity.charAt(0).toUpperCase() + customEstimate.complexity.slice(1)} complexity
                              </div>
                              <span className="text-sm text-text-secondary">~{customEstimate.timeWeeks} week{customEstimate.timeWeeks !== 1 ? "s" : ""} additional</span>
                            </div>
                            <div className="text-xl font-bold gradient-text-green">
                              ${customEstimate.priceMin.toLocaleString()} – ${customEstimate.priceMax.toLocaleString()}
                            </div>
                            <p className="text-text-muted text-xs leading-relaxed">{customEstimate.explanation}</p>
                            {!customAdded ? (
                              <button
                                onClick={() => setCustomAdded(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-cta text-cta-text rounded-lg text-sm font-semibold hover:bg-cta-hover transition-all"
                              >
                                <Check className="w-3.5 h-3.5" /> Add to Quote
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-accent text-sm font-medium">
                                <Check className="w-4 h-4" /> Added to your quote
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <button onClick={() => setStep(2)} className="px-6 py-3 bg-cta text-cta-text font-semibold rounded-xl glow-green hover:bg-cta-hover transition-all text-sm">
                    Next: Choose Your Look &rarr;
                  </button>
                </motion.div>
              )}

              {/* ── Step 2: Template Selection (NEW) ── */}
              {step === 2 && projectType && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-border rounded-lg text-text-secondary text-xs hover:bg-white/10 hover:text-text-primary transition-all"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
                    <h2 className="text-xl font-bold">Choose Your Look</h2>
                  </div>
                  <p className="text-text-muted text-sm mb-6">Pick a pre-built design to keep costs down, or go custom for a one-of-a-kind look.</p>

                  {/* Pre-built templates */}
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider mb-4">
                    <Check className="w-4 h-4" /> Pre-Built Templates — Included Free
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                    {getTemplatesForContext(projectType, selectedFeatures).map((tmpl, i) => (
                      <button
                        key={tmpl.id}
                        onClick={() => { setSelectedTemplate(tmpl.id); setDesign("standard"); }}
                        className={`glass-card overflow-hidden text-left transition-all duration-300 relative group ${
                          selectedTemplate === tmpl.id ? "border-accent/40 ring-1 ring-accent/20 shadow-[0_0_20px_rgba(167,139,250,0.1)]" : "hover:border-white/15"
                        }`}
                      >
                        {/* Recommended badge */}
                        {i === 0 && (
                          <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 bg-accent/90 text-cta-text rounded text-[8px] font-bold uppercase tracking-wider">
                            Best Match
                          </div>
                        )}
                        {/* Screenshot */}
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img src={tmpl.image} alt={tmpl.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                          {selectedTemplate === tmpl.id && (
                            <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
                              <span className="flex items-center gap-1 px-2.5 py-1 bg-accent rounded-full text-[10px] text-cta-text font-bold">
                                <Check className="w-3 h-3" /> Selected
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-3">
                          <h4 className="font-semibold text-xs mb-0.5">{tmpl.name}</h4>
                          <p className="text-text-muted text-[10px] leading-relaxed line-clamp-2">{tmpl.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom design option */}
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-secondary uppercase tracking-wider mb-3">
                    <Sparkles className="w-4 h-4" /> Or Go Custom
                  </h3>
                  <div className="space-y-2 mb-8">
                    <button
                      onClick={() => { setSelectedTemplate("custom"); setDesign("custom"); }}
                      className={`w-full glass-card p-5 text-left flex items-center gap-4 transition-all ${
                        selectedTemplate === "custom" ? "border-accent-secondary/40 bg-accent-secondary/5" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTemplate === "custom" ? "border-accent-secondary" : "border-border"}`}>
                        {selectedTemplate === "custom" && <div className="w-2.5 h-2.5 rounded-full bg-accent-secondary" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Custom Branded Design</span>
                            <span className="px-1.5 py-0.5 bg-accent-secondary/15 rounded text-[9px] text-accent-secondary font-semibold">PREMIUM</span>
                          </div>
                          <span className="text-accent-secondary text-sm font-semibold">+$1,200</span>
                        </div>
                        <p className="text-text-muted text-xs mt-0.5">Unique to your brand. We create 2 design concepts, you pick your favorite.</p>
                      </div>
                    </button>
                    <button
                      onClick={() => { setSelectedTemplate("premium"); setDesign("premium"); }}
                      className={`w-full glass-card p-5 text-left flex items-center gap-4 transition-all ${
                        selectedTemplate === "premium" ? "border-accent-secondary/40 bg-accent-secondary/5" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTemplate === "premium" ? "border-accent-secondary" : "border-border"}`}>
                        {selectedTemplate === "premium" && <div className="w-2.5 h-2.5 rounded-full bg-accent-secondary" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Premium Award-Level Design</span>
                            <span className="px-1.5 py-0.5 bg-accent-secondary/15 rounded text-[9px] text-accent-secondary font-semibold">PREMIUM</span>
                          </div>
                          <span className="text-accent-secondary text-sm font-semibold">+$3,000</span>
                        </div>
                        <p className="text-text-muted text-xs mt-0.5">Animations, micro-interactions, scroll effects, 3D elements. The kind of site people screenshot.</p>
                      </div>
                    </button>
                  </div>

                  <button onClick={() => setStep(3)} disabled={!selectedTemplate} className="px-6 py-3 bg-cta text-cta-text font-semibold rounded-xl glow-green hover:bg-cta-hover transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                    Next: Delivery & Support &rarr;
                  </button>
                </motion.div>
              )}

              {/* ── Step 3: Rush, Revisions, Maintenance ── */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-border rounded-lg text-text-secondary text-xs hover:bg-white/10 hover:text-text-primary transition-all"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
                    <h2 className="text-xl font-bold">Delivery & Support</h2>
                  </div>

                  {/* Revisions */}
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Revisions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
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
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{m.label}</span>
                            {m.badge && <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-semibold">{m.badge}</span>}
                          </div>
                          <p className="text-text-muted text-xs mt-0.5">{m.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* AI-specific note about API costs */}
                  {projectType === "ai" && (
                    <div className="glass-card p-4 mb-8 flex items-start gap-3 border-accent/10 bg-accent/[0.02]">
                      <Brain className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-text-secondary leading-relaxed">
                        <span className="font-medium text-text-primary">About AI hosting costs:</span> AI features use API tokens (OpenAI/Claude) that have ongoing costs. With a maintenance plan, we manage the API key and usage is included up to reasonable limits. Without a plan, you provide your own API key and manage costs directly. We recommend at least the Basic plan for AI projects.
                      </div>
                    </div>
                  )}

                  <button onClick={() => setStep(4)} className="px-6 py-3 bg-cta text-cta-text font-semibold rounded-xl glow-green hover:bg-cta-hover transition-all text-sm">
                    View Summary &rarr;
                  </button>
                </motion.div>
              )}

              {/* ── Step 4: Summary ── */}
              {step === 4 && currentType && (
                <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setStep(3)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-border rounded-lg text-text-secondary text-xs hover:bg-white/10 hover:text-text-primary transition-all"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
                    <h2 className="text-xl font-bold">Your Quote</h2>
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
                          <div className="text-3xl font-bold gradient-text-green">${pricing.total.toLocaleString()}</div>
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

                  {/* Payment Plan */}
                  <div className="glass-card p-6 mt-4">
                    <h3 className="text-sm font-semibold mb-4">How would you like to pay?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          id: "full" as const,
                          label: "Pay in Full",
                          detail: `$${pricing.total.toLocaleString()}`,
                          sub: "One payment, best value",
                          badge: null,
                        },
                        {
                          id: "5050" as const,
                          label: "50/50 Split",
                          detail: `$${Math.ceil(pricing.total / 2).toLocaleString()} × 2`,
                          sub: "50% to start, 50% on delivery",
                          badge: null,
                        },
                        {
                          id: "3mo" as const,
                          label: "3 Monthly Payments",
                          detail: `$${Math.ceil(pricing.total / 3).toLocaleString()}/mo`,
                          sub: "Start → mid-project → delivery",
                          badge: "Popular",
                        },
                        {
                          id: "6mo" as const,
                          label: "6 Monthly Payments",
                          detail: `$${Math.ceil(pricing.total * 1.1 / 6).toLocaleString()}/mo`,
                          sub: "10% financing fee applies",
                          badge: "Lowest monthly",
                        },
                      ].map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => setPaymentPlan(plan.id)}
                          className={`glass-card p-4 text-left transition-all ${
                            paymentPlan === plan.id ? "border-accent/30 bg-accent/5" : "hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{plan.label}</span>
                            {plan.badge && (
                              <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-semibold">{plan.badge}</span>
                            )}
                          </div>
                          <div className="text-lg font-bold text-accent">{plan.detail}</div>
                          <div className="text-text-muted text-xs mt-0.5">{plan.sub}</div>
                        </button>
                      ))}
                    </div>
                    {paymentPlan === "6mo" && (
                      <p className="text-text-muted text-xs mt-3">
                        6-month total: ${Math.ceil(pricing.total * 1.1).toLocaleString()} (${pricing.total.toLocaleString()} + 10% financing). First payment starts the project, remaining 5 payments monthly.
                      </p>
                    )}
                  </div>

                  {/* Trust Guarantees — compact strip */}
                  <div className="glass-card p-3 mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Check className="w-3.5 h-3.5 text-accent" />
                      <span>Free Project Brief</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Shield className="w-3.5 h-3.5 text-accent" />
                      <span>Design Guarantee</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Zap className="w-3.5 h-3.5 text-accent" />
                      <span>1 Month Free Support</span>
                    </div>
                  </div>

                  {/* ROI — compact */}
                  <div className="glass-card p-4 mt-3 border-accent/10 bg-accent/[0.02]">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <span className="text-xs font-semibold">Estimated Payback</span>
                      </div>
                      <div className="flex items-center gap-4 text-center">
                        <div>
                          <div className="text-sm font-bold text-accent">{pricing.total > 0 ? `${Math.ceil(pricing.total / 2000)} mo` : "—"}</div>
                          <div className="text-text-muted text-[9px]">Payback</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-accent">${pricing.total > 0 ? Math.round(pricing.total * 0.5).toLocaleString() : "—"}</div>
                          <div className="text-text-muted text-[9px]">Monthly savings</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-accent">${pricing.total > 0 ? Math.round(pricing.total * 0.5 * 12 - pricing.total).toLocaleString() : "—"}</div>
                          <div className="text-text-muted text-[9px]">Year 1 return</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-4 mt-4 flex items-start gap-3 border-accent/10 bg-accent/[0.02]">
                    <Shield className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-text-muted text-xs leading-relaxed">
                      <span className="text-text-secondary font-medium">Price locked.</span> This is your exact price for the current configuration. Change features and the price adjusts. No hidden fees.
                    </p>
                  </div>

                  {/* Save Quote */}
                  <div className="glass-card p-6 mt-4">
                    {!savedQuoteNumber ? (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <Shield className="w-4 h-4 text-accent" />
                          Start Your Project
                        </h3>
                        <p className="text-text-muted text-xs">Enter your details to lock this price and create your project portal.</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Your name *" className="px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/30" />
                          <input value={saveEmail} onChange={(e) => setSaveEmail(e.target.value)} placeholder="Email address *" type="email" className="px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/30" />
                          <input value={saveCompany} onChange={(e) => setSaveCompany(e.target.value)} placeholder="Company name" className="px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/30" />
                          <input value={savePhone} onChange={(e) => setSavePhone(e.target.value)} placeholder="Phone (optional)" className="px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/30" />
                        </div>
                        {/* Optional notes + file upload */}
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="text-xs text-text-muted mb-1.5 block">Additional details (optional)</label>
                            <textarea
                              value={saveNotes}
                              onChange={(e) => setSaveNotes(e.target.value)}
                              rows={3}
                              placeholder="Anything else you'd like us to know? Describe your vision, mention competitors you like, specific features you need..."
                              className="w-full px-3 py-2.5 bg-bg-primary/50 border border-border rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/30 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-text-muted mb-1.5 block">Reference files (optional)</label>
                            <label className="flex items-center gap-3 px-3 py-3 bg-bg-primary/50 border border-dashed border-border rounded-lg cursor-pointer hover:border-accent/20 transition-colors">
                              <Upload className="w-4 h-4 text-text-muted" />
                              <span className="text-xs text-text-muted">
                                {saveFiles.length > 0 ? `${saveFiles.length} file${saveFiles.length > 1 ? "s" : ""} selected` : "Drop files or click — logos, screenshots, inspiration"}
                              </span>
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => setSaveFiles(Array.from(e.target.files || []))}
                                accept="image/*,.pdf,.doc,.docx,.fig,.sketch,.zip"
                              />
                            </label>
                            {saveFiles.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {saveFiles.map((f, i) => (
                                  <div key={i} className="flex items-center justify-between text-xs text-text-muted bg-bg-primary/30 rounded px-2 py-1">
                                    <span className="truncate">{f.name}</span>
                                    <button onClick={() => setSaveFiles((prev) => prev.filter((_, j) => j !== i))} className="text-text-muted hover:text-text-primary ml-2 flex-shrink-0">&times;</button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={saveQuote}
                            disabled={!saveName.trim() || !saveEmail.trim() || saveLoading}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cta text-cta-text font-semibold rounded-lg hover:bg-cta-hover transition-all text-sm disabled:opacity-40"
                          >
                            {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {saveLoading ? "Setting up..." : "Start Your Project Journey"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                          <Check className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-lg font-bold">Quote Saved!</h3>
                        <div className="text-2xl font-bold gradient-text">{savedQuoteNumber}</div>
                        <p className="text-text-muted text-sm">
                          Reference this number when you book a call. Your configuration and price are locked.
                        </p>
                        <Link href="/book" className="group inline-flex items-center gap-2 px-7 py-3 bg-cta text-cta-text font-semibold rounded-xl glow-accent hover:bg-cta-hover transition-all text-sm">
                          Book Your Free Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <button onClick={() => { setStep(0); setProjectType(null); setSelectedFeatures([]); setSelectedAutomations([]); setSelectedTemplate(null); setDesign("standard"); setRevisions("2"); setMaintenance("none"); setRushDelivery(false); setPaymentPlan("full"); setCustomEstimate(null); setCustomAdded(false); setCustomText(""); setSavedQuoteNumber(null); setSaveName(""); setSaveEmail(""); setSavePhone(""); setSaveCompany(""); setSaveNotes(""); setSaveFiles([]); }}
                      className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-text-primary transition-all">
                      <RefreshCw className="w-3.5 h-3.5" /> Start Over
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
                <div className="flex items-center gap-2 text-accent"><Sparkles className="w-5 h-5" /><h3 className="font-semibold">Your Price</h3></div>
                <div>
                  <div className="text-4xl font-bold gradient-text-green">${pricing.total.toLocaleString()}</div>
                  <p className="text-text-muted text-sm mt-1">One-time cost</p>
                </div>
                {/* Included features table */}
                {includedFeatures.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Included free</div>
                    <div className="space-y-1.5">
                      {includedFeatures.map((f) => (
                        <div key={f.id} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-accent flex-shrink-0" />
                          <span className="text-[11px] text-text-secondary">{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent-secondary" />~{pricing.weeks} weeks</div>
                  <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-accent" />{revisionOptions.find((r) => r.id === revisions)?.label} revisions</div>
                  {rushDelivery && <div className="flex items-center gap-2 text-orange-400"><Zap className="w-4 h-4" />Rush delivery</div>}
                  {pricing.monthly > 0 && <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-accent" />+${pricing.monthly}/mo maintenance</div>}
                  {selectedFeatures.filter((id) => !features.find((f) => f.id === id)?.included).length > 0 && (
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-accent" />{selectedFeatures.filter((id) => !features.find((f) => f.id === id)?.included).length} add-ons selected</div>
                  )}
                  {selectedAutomations.length > 0 && (
                    <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-accent" />{selectedAutomations.length} automation{selectedAutomations.length > 1 ? "s" : ""}</div>
                  )}
                </div>

                {paymentPlan !== "full" && (
                  <div className="pt-3 border-t border-border">
                    <div className="text-[10px] text-text-muted mb-0.5">
                      {paymentPlan === "5050" ? "50/50 Split" : paymentPlan === "3mo" ? "3 Payments" : "6 Payments"}
                    </div>
                    <div className="text-lg font-bold text-accent">
                      {paymentPlan === "5050"
                        ? `$${Math.ceil(pricing.total / 2).toLocaleString()} × 2`
                        : paymentPlan === "3mo"
                        ? `$${Math.ceil(pricing.total / 3).toLocaleString()}/mo`
                        : `$${Math.ceil(pricing.total * 1.1 / 6).toLocaleString()}/mo`}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  <p className="text-text-muted text-xs">Price locked for this configuration.</p>
                </div>
                {savedQuoteNumber ? (
                  <>
                    <div className="pt-3 border-t border-border text-center">
                      <div className="text-[10px] text-text-muted mb-1">Your Quote</div>
                      <div className="text-sm font-bold text-accent">{savedQuoteNumber}</div>
                    </div>
                    <Link href="/book" className="block w-full text-center px-6 py-3 bg-cta text-cta-text font-semibold rounded-xl glow-accent hover:bg-cta-hover transition-all text-sm">
                      Book Free Call
                    </Link>
                  </>
                ) : (
                  <div className="pt-3 border-t border-border text-center">
                    <p className="text-text-muted text-[10px]">Save your quote to book a call</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
