import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CodeLaunch — Custom Software That Actually Helps",
  description:
    "A small, focused software studio building custom web apps, mobile apps, and AI automation for businesses that deserve better software. Based in Helena, Montana.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CodeLaunch",
    description: "A small, focused software studio serving growing businesses.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
