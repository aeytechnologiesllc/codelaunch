import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Custom Web Apps, Mobile Apps & AI Automation",
  description:
    "We design and build custom web applications, mobile apps, AI automation, and integrations for growing businesses. Start with a free design phase — only pay if you love it.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — CodeLaunch",
    description:
      "Custom web apps, mobile apps, AI automation, and integrations — tailored to your business.",
    url: "/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
