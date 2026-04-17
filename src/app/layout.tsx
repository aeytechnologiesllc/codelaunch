import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { NoiseOverlay } from "@/components/NoiseOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = "https://codelynch.com";
const SITE_NAME = "CodeLaunch";
const DEFAULT_TITLE = "CodeLaunch — Custom Software & AI Automation for Small Businesses";
const DEFAULT_DESCRIPTION =
  "Custom web apps, mobile apps, and AI automation for restaurants, contractors, and growing businesses. Risk-free: design phase is 100% free — only pay if you love it.";

export const viewport: Viewport = {
  themeColor: "#0b0b12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | CodeLaunch",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "CodeLaunch" }],
  creator: "CodeLaunch",
  publisher: "CodeLaunch",
  keywords: [
    "custom software development",
    "AI automation agency",
    "web app development",
    "mobile app development",
    "software for small business",
    "restaurant software",
    "contractor software",
    "custom CRM",
    "custom dashboard",
    "AI chatbot development",
    "no-commitment software agency",
    "free design phase",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/images/hero-laptop-phone.png",
        width: 1200,
        height: 630,
        alt: "CodeLaunch — custom software and AI automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/images/hero-laptop-phone.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Organization + WebSite JSON-LD — applies site-wide, helps knowledge graph
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "CodeLaunch Software Studio",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description: DEFAULT_DESCRIPTION,
  foundingDate: "2025",
  slogan: "Free until you love the design.",
  areaServed: "US",
  sameAs: [],
  knowsAbout: [
    "Custom software development",
    "AI automation",
    "Web application development",
    "Mobile application development",
    "Small business software",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <NoiseOverlay />
      </body>
    </html>
  );
}
