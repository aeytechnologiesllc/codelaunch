"use client";

import { ScrollReveal } from "@/components/ScrollReveal";

const sections = [
  {
    title: "1. Services",
    content: [
      "Southern Digital Technologies LLC, doing business as CodeLaunch (\"Company,\" \"we,\" \"us\"), provides custom software development, web application development, mobile application development, AI and automation solutions, and related technology consulting services (\"Services\") to small and medium-sized businesses (\"Client,\" \"you\").",
      "The scope of each project is defined in a separate Statement of Work (\"SOW\") or project proposal agreed upon by both parties prior to commencement. Any changes to the scope must be agreed upon in writing and may result in adjustments to timeline and cost.",
      "We reserve the right to subcontract portions of the work to qualified professionals, though we remain fully responsible for all deliverables.",
    ],
  },
  {
    title: "2. Payment Terms",
    content: [
      "All projects require a 50% upfront deposit before work begins, with the remaining 50% due upon project completion and final delivery. Payment is processed securely through Stripe.",
      "For larger projects, we offer flexible payment plans:",
    ],
    list: [
      "Standard: 50% upfront, 50% on delivery",
      "3-Month Plan: 50% upfront, then two equal monthly payments covering the remaining balance",
      "6-Month Plan: 50% upfront, then five equal monthly payments covering the remaining balance",
    ],
    extra: [
      "Late payments are subject to a 1.5% monthly interest charge after a 7-day grace period. If payment is more than 30 days overdue, we reserve the right to pause work and restrict access to deliverables until the balance is settled.",
      "All prices are in US dollars unless otherwise specified. Clients are responsible for any applicable taxes.",
    ],
  },
  {
    title: "3. Intellectual Property",
    content: [
      "Upon full payment, the Client owns all custom code, designs, and deliverables created specifically for their project. This includes source code, database schemas, and custom UI components built for the Client.",
      "We retain the right to use general-purpose tools, libraries, frameworks, and code snippets that are not unique to the Client's project. We also retain the right to showcase the project in our portfolio (without revealing confidential business information) unless otherwise agreed in writing.",
      "Third-party libraries, open-source software, and APIs used in the project remain subject to their respective licenses. We will provide documentation of all third-party dependencies upon request.",
    ],
  },
  {
    title: "4. Warranty & Support",
    content: [
      "We provide a 30-day warranty period after project delivery during which we will fix any bugs or defects in the delivered software at no additional charge. This warranty covers issues that deviate from the agreed-upon specifications in the SOW.",
      "The warranty does not cover issues caused by Client modifications, third-party integrations added after delivery, hosting environment changes, or misuse of the software.",
      "Post-warranty support and maintenance are available under separate maintenance agreements.",
    ],
  },
  {
    title: "5. Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, Southern Digital Technologies LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from or related to our Services.",
      "Our total liability for any claim arising from or related to a project shall not exceed the total amount paid by the Client for that specific project.",
      "We are not responsible for damages resulting from third-party services (hosting providers, payment processors, APIs), Client-provided content or data, force majeure events, or unauthorized modifications to delivered software.",
    ],
  },
  {
    title: "6. Confidentiality",
    content: [
      "Both parties agree to keep confidential any proprietary or sensitive information shared during the course of the project. This includes business strategies, technical specifications, financial information, and user data.",
      "Confidential information may be disclosed if required by law, provided the disclosing party gives reasonable prior notice when legally permitted.",
      "Confidentiality obligations survive termination of the agreement for a period of two (2) years.",
    ],
  },
  {
    title: "7. Termination",
    content: [
      "Either party may terminate the agreement with 14 days written notice. Upon termination:",
    ],
    list: [
      "Client is responsible for payment for all work completed up to the termination date",
      "If the Client terminates after the project midpoint, the full remaining balance becomes due",
      "The upfront deposit is non-refundable once work has commenced",
      "We will provide all completed work product and source code upon settlement of outstanding payments",
    ],
    extra: [
      "We reserve the right to terminate immediately if the Client engages in abusive behavior toward our team, breaches confidentiality, or fails to make payment for more than 30 days.",
    ],
  },
  {
    title: "8. Dispute Resolution",
    content: [
      "Any disputes arising from these terms or our Services shall first be addressed through good-faith negotiation between the parties for a period of 30 days.",
      "If negotiation fails, disputes shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) in Helena, Montana, in accordance with its Commercial Arbitration Rules.",
      "The prevailing party in any dispute shall be entitled to recover reasonable attorney fees and costs. These terms are governed by the laws of the State of Montana, without regard to conflict of law provisions.",
    ],
  },
  {
    title: "9. Modifications",
    content: [
      "We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of our Services after changes are posted constitutes acceptance of the revised terms.",
      "For active projects, any material changes to these terms will be communicated directly to affected Clients.",
    ],
  },
  {
    title: "10. Contact",
    content: [
      "If you have questions about these Terms & Conditions, please contact us:",
    ],
    list: [
      "Email: hello@codelaunch.dev",
      "Address: 55 West 14th Street, Suite 101, Helena, Montana, 59601",
      "Company: Southern Digital Technologies LLC",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Terms & <span className="gradient-text">Conditions</span>
            </h1>
            <p className="text-text-muted text-sm">
              Last updated: March 2026
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="glass-card p-8 sm:p-10 mb-8">
            <p className="text-text-secondary text-sm leading-relaxed">
              Welcome to CodeLaunch, operated by Southern Digital Technologies LLC. By engaging our
              Services, you agree to the following Terms & Conditions. Please read them carefully before
              starting a project with us.
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
