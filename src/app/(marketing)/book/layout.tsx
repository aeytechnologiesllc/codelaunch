import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Discovery Call — Scope Your Custom Software",
  description:
    "30-minute free discovery call. We'll scope your project, answer questions, and walk you through our risk-free design process. No pitch, no pressure.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book a Free Discovery Call — CodeLaunch",
    description: "30-minute free call. Scope your project. No pitch, no pressure.",
    url: "/book",
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
