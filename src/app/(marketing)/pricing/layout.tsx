import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparent Pricing — Custom Software Quotes in 60 Seconds",
  description:
    "Interactive pricing calculator. Build your quote in 60 seconds — web apps, mobile apps, AI automation. Risk-free: design phase is free, only pay if you love it. Flexible payment plans available.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Transparent Pricing — CodeLaunch",
    description:
      "Build your quote in 60 seconds. Risk-free: free design phase, only pay if you love it.",
    url: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
