import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeLaunch | AI-Powered Software for Growing Businesses",
  description:
    "We build custom web apps, mobile apps, and AI automation for restaurants, contractors, and small businesses. Stop losing money to generic software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
