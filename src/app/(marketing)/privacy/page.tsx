"use client";

import { ScrollReveal } from "@/components/ScrollReveal";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "We collect information you provide directly to us when using our website or engaging our Services:",
    ],
    list: [
      "Contact information: name, email address, phone number, company name",
      "Project details: project descriptions, business requirements, and specifications shared during consultations",
      "Account data: login credentials if you access a client portal or project dashboard",
      "Payment information: billing address and payment details processed securely through Stripe (we do not store credit card numbers on our servers)",
      "Communications: messages, emails, and feedback you send us",
    ],
  },
  {
    title: "2. Information Collected Automatically",
    content: [
      "When you visit our website, we automatically collect certain technical information:",
    ],
    list: [
      "Device information: browser type, operating system, device type, and screen resolution",
      "Usage data: pages visited, time spent on pages, click patterns, and navigation paths",
      "Network data: IP address, approximate geographic location, and referring URL",
      "Cookies and similar technologies: session identifiers, preferences, and analytics tokens",
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: [
      "We use the information we collect for the following purposes:",
    ],
    list: [
      "To provide, maintain, and improve our Services",
      "To communicate with you about projects, updates, and support",
      "To process payments and send invoices",
      "To send marketing communications (only with your consent; you can opt out at any time)",
      "To analyze website usage and improve the user experience",
      "To detect, prevent, and address technical issues or fraud",
      "To comply with legal obligations",
    ],
  },
  {
    title: "4. Cookies & Tracking",
    content: [
      "We use cookies and similar tracking technologies on our website:",
    ],
    list: [
      "Essential cookies: required for the website to function properly (session management, security)",
      "Analytics cookies: help us understand how visitors use our site (page views, traffic sources). We use privacy-friendly analytics tools",
      "Preference cookies: remember your settings and choices for a better experience",
    ],
    extra: [
      "You can control cookies through your browser settings. Disabling certain cookies may affect website functionality. We do not use cookies for cross-site advertising tracking.",
    ],
  },
  {
    title: "5. Data Storage & Security",
    content: [
      "Your data is stored securely using industry-standard practices:",
    ],
    list: [
      "Client project data and account information are stored in Supabase, which provides encrypted storage, row-level security, and SOC 2 Type II compliance",
      "Payment processing is handled entirely by Stripe, a PCI DSS Level 1 certified payment processor. We never store full credit card numbers on our servers",
      "All data transmitted between your browser and our servers is encrypted via TLS/SSL",
      "We implement access controls, regular security audits, and encrypted backups",
    ],
    extra: [
      "While we take reasonable measures to protect your data, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security.",
    ],
  },
  {
    title: "6. Third-Party Services",
    content: [
      "We use the following third-party services that may process your data:",
    ],
    list: [
      "Stripe: payment processing (see Stripe's privacy policy at stripe.com/privacy)",
      "Supabase: database and authentication services",
      "Vercel: website hosting and deployment",
      "Analytics provider: website usage analytics",
      "Email service: transactional and marketing emails",
    ],
    extra: [
      "Each third-party service has its own privacy policy governing the use of your information. We only share the minimum data necessary for each service to function.",
    ],
  },
  {
    title: "7. Data Retention",
    content: [
      "We retain your information for as long as necessary to provide our Services and fulfill the purposes outlined in this policy:",
    ],
    list: [
      "Active client data: retained for the duration of the business relationship and 3 years after project completion",
      "Payment records: retained for 7 years as required by tax and accounting regulations",
      "Website analytics data: retained for 26 months in anonymized/aggregated form",
      "Marketing contacts: retained until you unsubscribe or request deletion",
      "Communication records: retained for 2 years after last interaction",
    ],
    extra: [
      "Upon request, we will delete your personal data within 30 days, except where retention is required by law.",
    ],
  },
  {
    title: "8. Your Rights (CCPA / GDPR)",
    content: [
      "Depending on your location, you may have the following rights regarding your personal data:",
    ],
    list: [
      "Right to access: request a copy of the personal data we hold about you",
      "Right to correction: request correction of inaccurate or incomplete data",
      "Right to deletion: request deletion of your personal data (\"right to be forgotten\")",
      "Right to portability: receive your data in a structured, machine-readable format",
      "Right to opt out: opt out of the sale or sharing of your personal data (we do not sell personal data)",
      "Right to non-discrimination: we will not discriminate against you for exercising your privacy rights",
    ],
    extra: [
      "California residents: Under the CCPA, you have the right to know what personal information we collect, request its deletion, and opt out of its sale. We do not sell personal information.",
      "EU/EEA residents: Under the GDPR, you have additional rights including the right to restrict processing and the right to object to processing. Our legal basis for processing is contract performance and legitimate interest.",
      "To exercise any of these rights, contact us at hello@codelaunch.dev. We will respond within 30 days.",
    ],
  },
  {
    title: "9. Children's Privacy",
    content: [
      "Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete that information promptly.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. If we make material changes, we will notify active clients via email.",
      "Your continued use of our website or Services after changes are posted constitutes acceptance of the revised policy.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:",
    ],
    list: [
      "Email: hello@codelaunch.dev",
      "Address: 55 West 14th Street, Suite 101, Helena, Montana, 59601",
      "Company: Southern Digital Technologies LLC",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-text-muted text-sm">
              Last updated: March 2026
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="glass-card p-8 sm:p-10 mb-8">
            <p className="text-text-secondary text-sm leading-relaxed">
              Southern Digital Technologies LLC, doing business as CodeLaunch (&quot;Company,&quot; &quot;we,&quot; &quot;us&quot;),
              is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
              store, and protect your personal information when you use our website (codelaunch.dev) and
              engage our Services. By using our website or Services, you agree to the practices described here.
            </p>
          </div>
        </ScrollReveal>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <ScrollReveal key={section.title} delay={0.05 * i}>
              <div className="glass-card p-8 sm:p-10">
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.content.map((para, j) => (
                    <p key={j} className="text-text-secondary text-sm leading-relaxed">
                      {para}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="space-y-2 pl-1">
                      {section.list.map((item, k) => (
                        <li key={k} className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.extra?.map((para, j) => (
                    <p key={`extra-${j}`} className="text-text-secondary text-sm leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
