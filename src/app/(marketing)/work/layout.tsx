import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work — Custom Software Projects & Case Studies",
  description:
    "A look at the custom software we've built — web apps, mobile apps, AI tools, and automation for real businesses.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Our Work — CodeLaunch",
    description: "Custom software projects built for growing businesses.",
    url: "/work",
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
