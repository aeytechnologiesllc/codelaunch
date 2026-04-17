import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software for Restaurants, Contractors & Service Businesses",
  description:
    "Purpose-built software for restaurants, contractors, and service businesses. Online ordering, dispatch, scheduling, invoicing, CRMs — built for how your business actually works.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industries We Serve — CodeLaunch",
    description:
      "Custom software built for restaurants, contractors, and service businesses.",
    url: "/industries",
  },
};

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
