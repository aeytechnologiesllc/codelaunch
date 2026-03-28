import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeLaunch | AI-Powered Software for Growing Businesses",
  description:
    "We build custom web apps, mobile apps, and AI automation for restaurants, contractors, and small businesses. Stop losing money to generic software.",
  keywords: [
    "custom software development",
    "AI automation",
    "mobile app development",
    "web application",
    "restaurant software",
    "contractor app",
    "small business software",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
